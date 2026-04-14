'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 hover:electric-bg hover:text-black group border border-transparent hover:border-electric"
      aria-label="Toggle theme"
    >
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 electric-glow-sm" />
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 electric-text" />
      ) : (
        <Moon className="w-4 h-4 electric-text" />
      )}
    </button>
  );
}
