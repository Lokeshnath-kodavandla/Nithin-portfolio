'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code, Database, ChartBar as BarChart2, TrendingUp, Brain, Cloud,
  Table, ChartPie as PieChart, GitBranch, Terminal, Globe, Layers,
  Cpu, FileText, Activity, Zap,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Skill } from '@/lib/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code, Database, BarChart2, TrendingUp, Brain, Cloud,
  Table, PieChart, GitBranch, Terminal, Globe, Layers,
  Cpu, FileText, Activity, Zap,
};

const defaultSkills: Skill[] = [
  { id: '1', name: 'Python',           icon_name: 'Code',      created_at: '' },
  { id: '2', name: 'SQL',              icon_name: 'Database',  created_at: '' },
  { id: '3', name: 'Tableau',          icon_name: 'BarChart2', created_at: '' },
  { id: '4', name: 'Machine Learning', icon_name: 'Brain',     created_at: '' },
  { id: '5', name: 'Power BI',         icon_name: 'PieChart',  created_at: '' },
  { id: '6', name: 'TensorFlow',       icon_name: 'Cpu',       created_at: '' },
  { id: '7', name: 'AWS',              icon_name: 'Cloud',     created_at: '' },
  { id: '8', name: 'Git',              icon_name: 'GitBranch', created_at: '' },
];

export function SkillsSection() {
  const [skills, setSkills]   = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSkills() {
      const { data } = await supabase
        .from('skills')
        .select('*')
        .order('created_at', { ascending: true });
      setSkills(data && data.length > 0 ? data : defaultSkills);
      setLoading(false);
    }
    fetchSkills();

    const channel = supabase
      .channel('skills-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'skills' }, () => {
        fetchSkills();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <section
      id="skills"
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
            &gt; expertise
          </p>

          <h2
            className="text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ color: '#f1f5f9' }}
          >
            Skills &amp;{' '}
            <span style={{ color: '#818cf8' }}>Tools</span>
          </h2>

          {/* Decorative line */}
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="h-28 rounded-xl"
                style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.1)' }}
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-16 font-mono text-sm" style={{ color: '#4f46e5' }}>
            _ no skills found
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {skills.map((skill, index) => {
              const Icon      = iconMap[skill.icon_name] || Code;
              const isHovered = hovered === skill.id;

              return (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  onHoverStart={() => setHovered(skill.id)}
                  onHoverEnd={() => setHovered(null)}
                  whileHover={{ y: -5, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative rounded-xl p-5 flex flex-col items-center gap-3 cursor-default overflow-hidden"
                  style={{
                    background: isHovered
                      ? 'rgba(99,102,241,0.1)'
                      : 'rgba(15,15,30,0.7)',
                    border: isHovered
                      ? '1px solid rgba(99,102,241,0.35)'
                      : '1px solid rgba(99,102,241,0.12)',
                    backdropFilter: 'blur(12px)',
                    transition: 'background 0.25s, border-color 0.25s',
                  }}
                >
                  {/* Corner accent */}
                  <div
                    className="absolute top-0 right-0 w-6 h-6 pointer-events-none"
                    style={{
                      borderTop: `1px solid ${isHovered ? 'rgba(99,102,241,0.6)' : 'rgba(99,102,241,0.2)'}`,
                      borderRight: `1px solid ${isHovered ? 'rgba(99,102,241,0.6)' : 'rgba(99,102,241,0.2)'}`,
                      transition: 'border-color 0.25s',
                    }}
                  />
                  <div
                    className="absolute bottom-0 left-0 w-6 h-6 pointer-events-none"
                    style={{
                      borderBottom: `1px solid ${isHovered ? 'rgba(99,102,241,0.6)' : 'rgba(99,102,241,0.2)'}`,
                      borderLeft: `1px solid ${isHovered ? 'rgba(99,102,241,0.6)' : 'rgba(99,102,241,0.2)'}`,
                      transition: 'border-color 0.25s',
                    }}
                  />

                  {/* Scan line on hover */}
                  {isHovered && (
                    <motion.div
                      className="absolute left-0 right-0 h-px pointer-events-none"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)',
                      }}
                      animate={{ top: ['0%', '100%'] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    />
                  )}

                  {/* Icon */}
                  <motion.div
                    className="relative w-11 h-11 rounded-lg flex items-center justify-center"
                    style={{
                      background: isHovered
                        ? 'rgba(99,102,241,0.2)'
                        : 'rgba(99,102,241,0.08)',
                      border: '1px solid rgba(99,102,241,0.2)',
                      transition: 'background 0.25s',
                    }}
                    animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                  <span style={{ color: isHovered ? '#a5b4fc' : '#818cf8' }} className="w-5 h-5 flex items-center justify-center">
                    <Icon />
                  </span>

                    {/* Pulse dot */}
                    {isHovered && (
                      <motion.span
                        className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                        style={{ background: '#6366f1' }}
                        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </motion.div>

                  {/* Label */}
                  <span
                    className="text-xs sm:text-sm font-mono font-medium text-center leading-tight"
                    style={{ color: isHovered ? '#c7d2fe' : '#94a3b8', transition: 'color 0.25s' }}
                  >
                    {skill.name}
                  </span>

                  {/* Index number */}
                  <span
                    className="absolute top-2 left-3 text-[10px] font-mono"
                    style={{ color: 'rgba(99,102,241,0.3)' }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ── Footer line ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 mt-14"
        >
          <div className="h-px flex-1 max-w-xs" style={{ background: 'rgba(99,102,241,0.1)' }} />
          <span className="text-xs font-mono" style={{ color: 'rgba(99,102,241,0.4)' }}>
            {skills.length} tools loaded
          </span>
          <div className="h-px flex-1 max-w-xs" style={{ background: 'rgba(99,102,241,0.1)' }} />
        </motion.div>

      </div>
    </section>
  );
}