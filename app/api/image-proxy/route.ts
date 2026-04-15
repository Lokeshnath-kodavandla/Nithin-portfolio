/**
 * /api/image-proxy/route.ts
 *
 * Server-side image proxy. Fetches any external image (Google Drive, Dropbox,
 * OneDrive, etc.) from YOUR server and streams it to the browser.
 *
 * Because the request comes from your Next.js server — not the browser —
 * CORS restrictions don't apply. The browser only ever talks to your own domain.
 *
 * Usage in <img> tag:
 *   <img src={`/api/image-proxy?url=${encodeURIComponent(originalUrl)}`} />
 *
 * Place this file at:
 *   app/api/image-proxy/route.ts   (App Router)
 *
 * Security:
 *   - Only whitelisted hostnames are allowed (prevents open-proxy abuse)
 *   - Response must be an image content-type or it is rejected
 *   - 10 second fetch timeout
 *   - Max 10MB response size
 */

import { NextRequest, NextResponse } from 'next/server';

// ── Allowed source hostnames ─────────────────────────────────────────────────
// Add any hostname your users might paste images from.
const ALLOWED_HOSTS = new Set([
  'drive.google.com',
  'lh3.googleusercontent.com',
  'lh4.googleusercontent.com',
  'lh5.googleusercontent.com',
  'lh6.googleusercontent.com',
  'docs.google.com',
  'www.dropbox.com',
  'dropbox.com',
  'dl.dropboxusercontent.com',
  'onedrive.live.com',
  'i.imgur.com',
  'imgur.com',
  'images.unsplash.com',
  'res.cloudinary.com',
  'postimg.cc',
  'i.postimg.cc',
  'ibb.co',
  'i.ibb.co',
]);

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const FETCH_TIMEOUT_MS = 10_000;          // 10 seconds

/**
 * Converts a user-facing Google Drive share URL to a direct file URL.
 * Other services can be added here if needed.
 */
function resolveSourceUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    if (host === 'drive.google.com') {
      // /file/d/FILE_ID/view  or  /file/d/FILE_ID/preview
      const fileMatch = parsed.pathname.match(/\/file\/d\/([^/]+)/);
      if (fileMatch) {
        return `https://drive.google.com/uc?export=download&id=${fileMatch[1]}`;
      }
      // /open?id=FILE_ID
      const openId = parsed.searchParams.get('id');
      if (openId && parsed.pathname.startsWith('/open')) {
        return `https://drive.google.com/uc?export=download&id=${openId}`;
      }
      // /uc?id=FILE_ID
      const ucId = parsed.searchParams.get('id');
      if (parsed.pathname.startsWith('/uc') && ucId) {
        return `https://drive.google.com/uc?export=download&id=${ucId}`;
      }
    }

    if (host === 'www.dropbox.com' || host === 'dropbox.com') {
      return url.replace(/[?&]dl=0/, '').replace(/[?&]dl=1/, '') + '?raw=1';
    }
  } catch {
    // fall through
  }
  return url;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const rawUrl = searchParams.get('url');

  // ── Validate input ───────────────────────────────────────────────────────
  if (!rawUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    return new NextResponse('Invalid url parameter', { status: 400 });
  }

  const host = parsedUrl.hostname.toLowerCase();
  if (!ALLOWED_HOSTS.has(host)) {
    return new NextResponse(`Host "${host}" is not allowed`, { status: 403 });
  }

  const sourceUrl = resolveSourceUrl(rawUrl);

  // ── Fetch with timeout ───────────────────────────────────────────────────
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(sourceUrl, {
      signal: controller.signal,
      headers: {
        // Mimic a browser so Google Drive doesn't serve an HTML warning page
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
      redirect: 'follow', // follow Google's redirect chain automatically
    });
  } catch (err: any) {
    clearTimeout(timer);
    if (err?.name === 'AbortError') {
      return new NextResponse('Upstream fetch timed out', { status: 504 });
    }
    return new NextResponse('Failed to fetch image', { status: 502 });
  }
  clearTimeout(timer);

  if (!response.ok) {
    return new NextResponse(`Upstream returned ${response.status}`, {
      status: response.status,
    });
  }

  // ── Validate content type ────────────────────────────────────────────────
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.startsWith('image/')) {
    // Google Drive sometimes returns an HTML "Download anyway" page for large files.
    // If that happens, return a clear error rather than serving HTML as an image.
    return new NextResponse(
      `Expected image, got "${contentType}". ` +
        'Make sure the file is shared as "Anyone with the link" and is an image.',
      { status: 422 }
    );
  }

  // ── Stream with size limit ───────────────────────────────────────────────
  const reader = response.body?.getReader();
  if (!reader) {
    return new NextResponse('No response body', { status: 502 });
  }

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > MAX_SIZE_BYTES) {
      reader.cancel();
      return new NextResponse('Image exceeds 10 MB limit', { status: 413 });
    }
    chunks.push(value);
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  // ── Return image with caching headers ────────────────────────────────────
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Length': String(totalBytes),
      // Cache for 7 days in the browser, 30 days on CDN/edge
      'Cache-Control': 'public, max-age=604800, s-maxage=2592000, stale-while-revalidate=86400',
    },
  });
}