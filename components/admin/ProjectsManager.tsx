'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/lib/types';
import { Plus, Trash2, Layers, Youtube, Image } from 'lucide-react';

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [githubUrl, setgithubUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    setProjects(data ?? []);
  }

  useEffect(() => { load(); }, []);

  async function add() {
    if (!title.trim()) { setError('Please enter a project title.'); return; }
    setError('');
    setLoading(true);
    const { error: err } = await supabase.from('projects').insert({
      title: title.trim(),
      description: description.trim(),
      youtube_url: youtubeUrl.trim(),
      thumbnail_url: thumbnailUrl.trim(),
      github_url: githubUrl.trim()
    });
    if (err) setError(err.message);
    else {
      setTitle('');
      setDescription('');
      setYoutubeUrl('');
      setThumbnailUrl('');
      setgithubUrl('');
      await load();
    }
    setLoading(false);
  }

  async function remove(id: string) {
    await supabase.from('projects').delete().eq('id', id);
    await load();
  }

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-xl p-4 space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Project title"
          className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-electric/50"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Project description (optional)"
          rows={3}
          className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-electric/50 resize-none"
        />
        <div className="flex items-center gap-2">
          <Youtube className="w-4 h-4 electric-text flex-shrink-0" />
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="YouTube URL (e.g. https://youtu.be/...)"
            className="flex-1 bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-electric/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Image className="w-4 h-4 electric-text flex-shrink-0" />
          <input
            type="url"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            placeholder="Thumbnail image URL (e.g. https://...)"
            className="flex-1 bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-electric/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Image className="w-4 h-4 electric-text flex-shrink-0" />
          <input
            type="url"
            value={githubUrl}
            onChange={(e) => setgithubUrl(e.target.value)}
            placeholder="Github Link"
            className="flex-1 bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-electric/50"
          />
        </div>

        {error && <p className="text-destructive text-xs">{error}</p>}

        <button
          onClick={add}
          disabled={loading}
          className="w-full py-2.5 electric-bg text-black rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          No projects yet.
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((project) => (
            <div key={project.id} className="flex items-start justify-between glass-card rounded-lg px-4 py-3 gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-electric/10 flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden">
                  {project.thumbnail_url ? (
                    <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <Layers className="w-4 h-4 electric-text" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{project.title}</p>
                  {project.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{project.description}</p>
                  )}
                  {project.youtube_url && (
                    <p className="text-xs electric-text truncate mt-0.5">{project.youtube_url}</p>
                  )}
                  {project.thumbnail_url && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{project.thumbnail_url}</p>
                  )}
                  {project.github_url && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{project.github_url}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => remove(project.id)}
                className="w-7 h-7 flex-shrink-0 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}