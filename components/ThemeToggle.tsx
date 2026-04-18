'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Waves, Flame, Monitor, ChevronDown } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const themes = [
  { id: 'system',  label: 'System',  icon: Monitor, desc: 'Auto-detect' },
  { id: 'light',   label: 'Light',   icon: Sun,     desc: 'Clean & bright' },
  { id: 'dark',    label: 'Dark',    icon: Moon,    desc: 'Easy on eyes' },
  { id: 'ocean',   label: 'Ocean',   icon: Waves,   desc: 'Deep sea vibes' },
  { id: 'sunset',  label: 'Sunset',  icon: Flame,   desc: 'Warm & cozy' },
];

function getIcon(theme: string | undefined) {
  switch (theme) {
    case 'light':  return Sun;
    case 'dark':   return Moon;
    case 'ocean':  return Waves;
    case 'sunset': return Flame;
    default:       return Monitor;
  }
}

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!mounted) {
    return <div className="h-10 w-32" />;
  }

  const CurrentIcon = getIcon(theme === 'system' ? resolvedTheme : theme);
  const currentLabel = themes.find(t => t.id === theme)?.label || 'System';

  return (
    <div ref={ref} className="relative">
      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-300"
        style={{
          background: 'var(--badge-bg)',
          border: '1px solid var(--badge-border)',
          color: 'var(--text-accent-light)',
        }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <CurrentIcon className="w-4 h-4" />
        <span className="font-mono text-xs tracking-wide">{currentLabel}</span>
        <ChevronDown
          className="w-3.5 h-3.5 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-52 rounded-xl overflow-hidden z-50"
            style={{
              background: 'var(--card-bg-solid)',
              border: '1px solid var(--card-border-hover)',
              backdropFilter: 'blur(20px)',
              boxShadow: `0 0 40px rgba(var(--accent-rgb), 0.12), 0 16px 32px rgba(0,0,0,0.3)`,
            }}
          >
            {/* Header */}
            <div
              className="px-3.5 py-2 text-[10px] font-mono tracking-widest uppercase"
              style={{
                color: 'var(--text-accent)',
                borderBottom: '1px solid var(--divider)',
              }}
            >
              &gt; select theme
            </div>

            {/* Theme options */}
            <div className="py-1">
              {themes.map((t) => {
                const Icon = t.icon;
                const isActive = theme === t.id;
                return (
                  <motion.button
                    key={t.id}
                    onClick={() => { setTheme(t.id); setOpen(false); }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-all duration-150"
                    style={{
                      background: isActive ? 'var(--card-bg-hover)' : 'transparent',
                      color: isActive ? 'var(--text-accent-lightest)' : 'var(--text-body)',
                    }}
                    whileHover={{
                      backgroundColor: `rgba(var(--accent-rgb), 0.08)`,
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: isActive
                          ? `rgba(var(--accent-rgb), 0.18)`
                          : `rgba(var(--accent-rgb), 0.06)`,
                        border: `1px solid ${isActive
                          ? `rgba(var(--accent-rgb), 0.4)`
                          : `rgba(var(--accent-rgb), 0.12)`}`,
                      }}
                    >
                      <Icon className="w-4 h-4" style={{ color: 'var(--text-accent-light)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold">{t.label}</div>
                      <div
                        className="text-[10px] font-mono"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {t.desc}
                      </div>
                    </div>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: 'var(--accent-color)' }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
