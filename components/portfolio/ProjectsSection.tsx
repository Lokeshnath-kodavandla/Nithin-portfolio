'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Layers, ImageOff, Github, X, Eye, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/lib/types';

// ─── YouTube embed URL extractor ─────────────────────────────────────────────
function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  // Handles: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID, youtube.com/v/ID, youtube.com/shorts/ID
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([A-Za-z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0&modestbranding=1` : null;
}

// ─── Corner decoration SVG ────────────────────────────────────────────────────
function CornerDecor({ className }: { className?: string }) {
  return (
    <svg
      width="20" height="20" viewBox="0 0 20 20"
      className={className}
      fill="none"
    >
      <path d="M0 20 L0 0 L20 0" stroke="#6366f1" strokeWidth="1.5" />
    </svg>
  );
}

// ─── YouTube Modal ────────────────────────────────────────────────────────────
function YouTubeModal({ url, onClose }: { url: string; onClose: () => void }) {
  const embedUrl = getYouTubeEmbedUrl(url);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
        style={{ background: 'rgba(6,6,15,0.92)', backdropFilter: 'blur(16px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.88, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.88, opacity: 0, y: 24 }}
          transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          className="relative w-full max-w-4xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glow */}
          <div className="absolute -inset-1 rounded-2xl opacity-40 blur-xl"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)' }} />

          {/* Frame */}
          <div className="relative rounded-2xl overflow-hidden aspect-video"
            style={{ border: '1px solid rgba(99,102,241,0.35)', background: '#06060f' }}>
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3"
                style={{ color: '#818cf8' }}>
                <Play className="w-10 h-10 opacity-30" />
                <p className="text-sm" style={{ color: '#94a3b8' }}>Unable to parse YouTube URL</p>
                <a href={url} target="_blank" rel="noopener noreferrer"
                  className="text-xs underline" style={{ color: '#6366f1' }}>
                  Open original link
                </a>
              </div>
            )}
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ background: '#4f46e5', border: '1px solid rgba(99,102,241,0.5)' }}
          >
            <X className="w-4 h-4" style={{ color: '#f1f5f9' }} />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Description Modal ────────────────────────────────────────────────────────
function DescriptionModal({
  project,
  onClose,
  onWatchDemo,
}: {
  project: Project;
  onClose: () => void;
  onWatchDemo: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handler);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
        style={{ background: 'rgba(6,6,15,0.85)', backdropFilter: 'blur(20px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 48, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 48, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          className="relative w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #0e0f23 0%, #0a0b1a 100%)',
            border: '1px solid rgba(99,102,241,0.25)',
            boxShadow: '0 0 60px rgba(79,70,229,0.15), 0 24px 48px rgba(0,0,0,0.6)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Corner decors */}
          <CornerDecor className="absolute top-0 left-0" />
          <CornerDecor className="absolute top-0 right-0 rotate-90" />
          <CornerDecor className="absolute bottom-0 left-0 -rotate-90" />
          <CornerDecor className="absolute bottom-0 right-0 rotate-180" />

          {/* Close btn */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}
          >
            <X className="w-4 h-4" style={{ color: '#818cf8' }} />
          </button>

          {/* Thumbnail — fixed, doesn't scroll */}
          {project.thumbnail_url && (
            <div className="relative h-44 flex-shrink-0 overflow-hidden">
              <img
                src={project.thumbnail_url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(to bottom, transparent 40%, #0a0b1a 100%)' }} />
              {/* Scan-line overlay */}
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)',
                }} />
            </div>
          )}

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 pb-6 pt-4"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#4f46e5 transparent' }}>

            {/* Tag + title */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded"
                style={{ background: 'rgba(79,70,229,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>
                Project
              </span>
            </div>
            <h3 className="text-xl font-bold pr-10 mb-4" style={{ color: '#f1f5f9', letterSpacing: '-0.02em' }}>
              {project.title}
            </h3>

            {/* Description — fully readable */}
            <p className="text-sm leading-7 whitespace-pre-wrap"
              style={{ color: '#94a3b8' }}>
              {project.description || 'No description provided for this project.'}
            </p>

            {/* Divider */}
            <div className="my-5 h-px" style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.3), transparent)' }} />

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105"
                  style={{
                    background: 'rgba(99,102,241,0.08)',
                    border: '1px solid rgba(99,102,241,0.25)',
                    color: '#a5b4fc',
                  }}
                >
                  <Github className="w-4 h-4" />
                  View Source
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              )}
              {project.youtube_url && (
                <button
                  onClick={() => { onClose(); setTimeout(onWatchDemo, 150); }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                    color: '#f1f5f9',
                    boxShadow: '0 0 20px rgba(79,70,229,0.4)',
                  }}
                >
                  <Play className="w-4 h-4 fill-current" />
                  Watch Demo
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  index,
  onWatchDemo,
  onReadMore,
}: {
  project: Project;
  index: number;
  onWatchDemo: () => void;
  onReadMore: () => void;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0e0f23 0%, #0a0b1a 100%)',
        border: '1px solid rgba(99,102,241,0.15)',
        transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.45)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(79,70,229,0.12), 0 16px 48px rgba(0,0,0,0.4)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.15)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Corner accents */}
      <CornerDecor className="absolute top-0 left-0 z-10 opacity-60" />
      <CornerDecor className="absolute top-0 right-0 z-10 opacity-60 rotate-90" />

      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden flex-shrink-0"
        style={{ background: 'rgba(79,70,229,0.04)' }}>
        {project.thumbnail_url && !imgError ? (
          <>
            <img
              src={project.thumbnail_url}
              alt={project.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            />
            {/* Scanline */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,1) 2px, rgba(0,0,0,1) 4px)',
              }} />
            {/* Bottom gradient fade */}
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, transparent 50%, #0a0b1a 100%)' }} />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <ImageOff className="w-8 h-8" style={{ color: '#818cf8', opacity: 0.3 }} />
            <span className="text-xs font-mono" style={{ color: '#818cf8', opacity: 0.4 }}>NO_THUMBNAIL</span>
          </div>
        )}

        {/* Watch demo hover overlay */}
        {project.youtube_url && (
          <button
            onClick={onWatchDemo}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'rgba(6,6,15,0.6)', backdropFilter: 'blur(2px)' }}
          >
            <div className="relative flex items-center justify-center w-16 h-16 rounded-full"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)', boxShadow: '0 0 32px rgba(79,70,229,0.7)' }}>
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-full animate-ping opacity-30"
                style={{ background: 'rgba(99,102,241,0.4)' }} />
              <Play className="w-6 h-6 fill-current ml-0.5" style={{ color: '#f1f5f9' }} />
            </div>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title */}
        <h3 className="font-bold text-base mb-2 leading-snug transition-colors duration-200"
          style={{ color: '#f1f5f9', letterSpacing: '-0.01em' }}>
          {project.title}
        </h3>

        {/* Description preview */}
        {project.description && (
          <p className="text-xs leading-relaxed line-clamp-2 flex-1 mb-4"
            style={{ color: '#94a3b8' }}>
            {project.description}
          </p>
        )}

        {/* Separator */}
        <div className="mb-4 h-px"
          style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.25), transparent)' }} />

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Details */}
          <button
            onClick={onReadMore}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
            style={{
              background: 'rgba(99,102,241,0.07)',
              border: '1px solid rgba(99,102,241,0.2)',
              color: '#a5b4fc',
            }}
          >
            <Eye className="w-3 h-3" />
            Details
          </button>

          {/* GitHub */}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
              style={{
                background: 'rgba(99,102,241,0.07)',
                border: '1px solid rgba(99,102,241,0.2)',
                color: '#a5b4fc',
              }}
            >
              <Github className="w-3 h-3" />
              GitHub
            </a>
          )}

          {/* Watch Demo */}
          {project.youtube_url && (
            <button
              onClick={onWatchDemo}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                color: '#f1f5f9',
                boxShadow: '0 0 16px rgba(79,70,229,0.35)',
              }}
            >
              <Play className="w-3 h-3 fill-current" />
              Watch Demo
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [youtubeProject, setYoutubeProject] = useState<Project | null>(null);
  const [detailProject, setDetailProject] = useState<Project | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      setProjects(data ?? []);
      setLoading(false);
    }
    fetchProjects();

    const channel = supabase
      .channel('projects-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, fetchProjects)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <>
      <section
        id="projects"
        className="py-24 px-4 sm:px-6 max-w-6xl mx-auto"
      >
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full"
            style={{ background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(99,102,241,0.25)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#6366f1' }} />
            <span className="text-xs font-mono tracking-widest uppercase" style={{ color: '#818cf8' }}>
              Portfolio / Work
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4"
            style={{ color: '#f1f5f9', letterSpacing: '-0.03em' }}>
            Projects
          </h2>
          <p className="text-sm max-w-sm mx-auto" style={{ color: '#94a3b8' }}>
            Hover to preview · Details for full info · Watch Demo for live video
          </p>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-72 rounded-2xl animate-pulse"
                style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.1)' }} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <Layers className="w-12 h-12 mx-auto mb-4" style={{ color: '#4f46e5', opacity: 0.3 }} />
            <p className="text-sm font-mono" style={{ color: '#94a3b8' }}>NO_PROJECTS_FOUND</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onWatchDemo={() => setYoutubeProject(project)}
                onReadMore={() => setDetailProject(project)}
              />
            ))}
          </div>
        )}
      </section>

      {/* YouTube modal */}
      {youtubeProject?.youtube_url && (
        <YouTubeModal
          url={youtubeProject.youtube_url}
          onClose={() => setYoutubeProject(null)}
        />
      )}

      {/* Description modal */}
      {detailProject && (
        <DescriptionModal
          project={detailProject}
          onClose={() => setDetailProject(null)}
          onWatchDemo={() => setYoutubeProject(detailProject)}
        />
      )}
    </>
  );
}