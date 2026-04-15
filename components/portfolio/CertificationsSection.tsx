'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ImageOff, X, Award } from 'lucide-react';
import { supabase } from '@/lib/supabase';

/**
 * Routes any external image URL through our server-side proxy (/api/image-proxy).
 *
 * WHY: Browsers enforce CORS on <img> tags for cross-origin URLs.
 * Google Drive, Dropbox etc. don't send the required CORS headers,
 * so the image silently fails — even when the file is public.
 *
 * HOW: Instead of the browser fetching the image directly from Google,
 * we ask OUR Next.js server to fetch it and stream it back.
 * The browser only ever talks to our own domain → no CORS issue at all.
 *
 * Works for: Google Drive, Dropbox, OneDrive, Imgur, Cloudinary, and any
 * other host added to the ALLOWED_HOSTS list in route.ts.
 *
 * The proxy lives at: app/api/image-proxy/route.ts
 */
function resolveImageUrl(url: string): string {
  if (!url) return url;
  // Already a relative/same-origin URL — use as-is
  try {
    const parsed = new URL(url);
    if (parsed.origin === window?.location?.origin) return url;
  } catch {
    return url; // relative path
  }
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

export function CertificationsSection() {
  const [certs, setCerts]       = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [viewCert, setViewCert] = useState<any | null>(null);
  const [hovered, setHovered]   = useState<string | null>(null);

  useEffect(() => {
    async function fetchCerts() {
      const { data } = await supabase
        .from('certifications')
        .select('*')
        .order('created_at', { ascending: false });
      setCerts(data || []);
      setLoading(false);
    }
    fetchCerts();
  }, []);

  // lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = viewCert ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [viewCert]);

  return (
    <section
      id="certifications"
      className="relative py-28 px-4 sm:px-6 overflow-hidden"
      style={{ background: '#0a0b1a' }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="text-xs font-mono tracking-[0.3em] uppercase mb-3" style={{ color: '#6366f1' }}>
            &gt; credentials
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight" style={{ color: '#f1f5f9' }}>
            Certifi<span style={{ color: '#818cf8' }}>cations</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-px w-16" style={{ background: 'rgba(99,102,241,0.3)' }} />
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#6366f1' }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="h-px w-16" style={{ background: 'rgba(99,102,241,0.3)' }} />
          </div>
        </motion.div>

        {/* ── Skeleton ── */}
        {loading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="rounded-xl"
                style={{
                  height: '280px',
                  background: 'rgba(99,102,241,0.06)',
                  border: '1px solid rgba(99,102,241,0.1)',
                }}
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
        ) : certs.length === 0 ? (
          <div className="text-center py-16 font-mono text-sm" style={{ color: '#4f46e5' }}>
            _ no certifications found
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {certs.map((cert, index) => {
              const isHov = hovered === cert.id;
              return (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.07 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onHoverStart={() => setHovered(cert.id)}
                  onHoverEnd={() => setHovered(null)}
                  onClick={() => setViewCert(cert)}
                  className="relative rounded-xl overflow-hidden cursor-pointer"
                  style={{
                    background: 'rgba(15,15,30,0.7)',
                    border: isHov
                      ? '1px solid rgba(99,102,241,0.35)'
                      : '1px solid rgba(99,102,241,0.12)',
                    backdropFilter: 'blur(12px)',
                    transition: 'border-color 0.25s',
                  }}
                >
                  {/* Corner accents */}
                  <div className="absolute top-0 right-0 w-5 h-5 pointer-events-none z-10"
                    style={{
                      borderTop: `1px solid ${isHov ? 'rgba(99,102,241,0.6)' : 'rgba(99,102,241,0.2)'}`,
                      borderRight: `1px solid ${isHov ? 'rgba(99,102,241,0.6)' : 'rgba(99,102,241,0.2)'}`,
                      transition: 'border-color 0.25s',
                    }} />
                  <div className="absolute bottom-0 left-0 w-5 h-5 pointer-events-none z-10"
                    style={{
                      borderBottom: `1px solid ${isHov ? 'rgba(99,102,241,0.6)' : 'rgba(99,102,241,0.2)'}`,
                      borderLeft: `1px solid ${isHov ? 'rgba(99,102,241,0.6)' : 'rgba(99,102,241,0.2)'}`,
                      transition: 'border-color 0.25s',
                    }} />

                  {/* Index */}
                  <span className="absolute top-2.5 left-3 text-[10px] font-mono z-10"
                    style={{ color: 'rgba(99,102,241,0.4)' }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* Image */}
                  <div className="relative h-44 overflow-hidden"
                    style={{ background: 'rgba(99,102,241,0.06)' }}>
                    {cert.image_url ? (
                      <>
                        <img
                          src={resolveImageUrl(cert.image_url)}
                          alt={cert.title}
                          className="w-full h-full object-cover"
                          style={{
                            filter: isHov ? 'brightness(1.05)' : 'brightness(0.85)',
                            transition: 'filter 0.3s',
                          }}
                          onError={(e) => {
                            // If the resolved URL fails, hide img and show fallback
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement | null;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        {/* Overlay gradient */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background: isHov
                              ? 'linear-gradient(to top, rgba(10,11,26,0.85) 0%, transparent 60%)'
                              : 'linear-gradient(to top, rgba(10,11,26,0.95) 0%, rgba(10,11,26,0.4) 100%)',
                            transition: 'background 0.3s',
                          }}
                        />
                        {/* Hidden fallback shown via onError */}
                        <div
                          className="absolute inset-0 flex-col items-center justify-center gap-2"
                          style={{ display: 'none' }}
                        >
                          <ImageOff className="w-8 h-8" style={{ color: 'rgba(99,102,241,0.3)' }} />
                          <span className="text-xs font-mono" style={{ color: 'rgba(99,102,241,0.3)' }}>no preview</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-2">
                        <ImageOff className="w-8 h-8" style={{ color: 'rgba(99,102,241,0.3)' }} />
                        <span className="text-xs font-mono" style={{ color: 'rgba(99,102,241,0.3)' }}>no preview</span>
                      </div>
                    )}

                    {/* Scan line on hover */}
                    {isHov && (
                      <motion.div
                        className="absolute left-0 right-0 h-px pointer-events-none z-10"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)' }}
                        animate={{ top: ['0%', '100%'] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className="text-sm font-semibold leading-snug line-clamp-2"
                        style={{ color: isHov ? '#c7d2fe' : '#f1f5f9', transition: 'color 0.25s' }}
                      >
                        {cert.title}
                      </h3>
                      <Award className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: '#6366f1' }} />
                    </div>
                    {cert.description && (
                      <p className="text-xs leading-relaxed line-clamp-2" style={{ color: '#94a3b8' }}>
                        {cert.description}
                      </p>
                    )}
                    <p className="text-[10px] font-mono" style={{ color: 'rgba(99,102,241,0.5)' }}>
                      _ click to view
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Footer line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 mt-14"
        >
          <div className="h-px flex-1 max-w-xs" style={{ background: 'rgba(99,102,241,0.1)' }} />
          <span className="text-xs font-mono" style={{ color: 'rgba(99,102,241,0.4)' }}>
            {certs.length} credentials loaded
          </span>
          <div className="h-px flex-1 max-w-xs" style={{ background: 'rgba(99,102,241,0.1)' }} />
        </motion.div>
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {viewCert && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setViewCert(null)}
            style={{ background: 'rgba(6,6,15,0.92)', backdropFilter: 'blur(16px)' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl rounded-xl overflow-hidden"
              style={{
                background: 'rgba(15,15,30,0.97)',
                border: '1px solid rgba(99,102,241,0.25)',
                backdropFilter: 'blur(20px)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              {/* Corner accents */}
              <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none z-20"
                style={{ borderTop: '1px solid rgba(99,102,241,0.5)', borderRight: '1px solid rgba(99,102,241,0.5)' }} />
              <div className="absolute bottom-0 left-0 w-8 h-8 pointer-events-none z-20"
                style={{ borderBottom: '1px solid rgba(99,102,241,0.5)', borderLeft: '1px solid rgba(99,102,241,0.5)' }} />

              {/* Close */}
              <button
                onClick={() => setViewCert(null)}
                className="absolute top-3 right-3 z-30 w-8 h-8 flex items-center justify-center rounded-lg transition-all"
                style={{
                  background: 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(99,102,241,0.25)',
                  color: '#818cf8',
                }}
              >
                <X className="w-4 h-4" />
              </button>

              {/* Full image */}
              {viewCert.image_url && (
                <div className="relative w-full" style={{ background: 'rgba(99,102,241,0.04)' }}>
                  <img
                    src={resolveImageUrl(viewCert.image_url)}
                    alt={viewCert.title}
                    className="w-full object-contain"
                    style={{ maxHeight: '65vh', display: 'block' }}
                    onError={(e) => {
                      // Hide the broken image container gracefully
                      const target = e.currentTarget;
                      const wrapper = target.closest('.relative.w-full') as HTMLElement | null;
                      if (wrapper) wrapper.style.display = 'none';
                    }}
                  />
                  {/* Bottom gradient fade into content */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                    style={{ background: 'linear-gradient(to bottom, transparent, rgba(15,15,30,0.97))' }}
                  />
                </div>
              )}

              {/* Details */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-mono mb-1" style={{ color: '#6366f1' }}>&gt; credential</p>
                    <h2 className="text-xl font-bold" style={{ color: '#f1f5f9' }}>
                      {viewCert.title}
                    </h2>
                  </div>
                  <Award className="w-5 h-5 shrink-0 mt-1" style={{ color: '#6366f1' }} />
                </div>

                {viewCert.description && (
                  <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                    {viewCert.description}
                  </p>
                )}

                {viewCert.link && (
                  <a
                    href={viewCert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono transition-all"
                    style={{
                      background: 'rgba(99,102,241,0.1)',
                      border: '1px solid rgba(99,102,241,0.3)',
                      color: '#a5b4fc',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View Credential
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}