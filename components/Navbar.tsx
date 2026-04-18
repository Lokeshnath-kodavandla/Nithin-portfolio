'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'About', href: '#hero' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Education', href: '#education' },
  { label: 'Playground', href: '#playground' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: scrolled ? 'var(--nav-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--nav-border)' : '1px solid transparent',
          padding: scrolled ? '10px 0' : '16px 0',
        }}
      >
        {/* Scan line on scroll */}
        {scrolled && (
          <motion.div
            className="absolute bottom-0 left-0 h-px w-full"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(var(--accent-rgb), 0.5), transparent)`,
            }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        )}

        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">

          {/* Logo */}
          <a href="#hero" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-md"
                style={{ border: `1px solid rgba(var(--accent-rgb), 0.3)`, background: `rgba(var(--accent-rgb), 0.08)` }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <Database className="w-4 h-4 relative z-10" style={{ color: 'var(--accent-light)' }} />
            </div>
            <span className="font-bold text-base tracking-tight" style={{ color: 'var(--text-heading)' }}>
              Nithin<span style={{ color: 'var(--text-accent)' }}> </span>
              <span style={{ color: 'var(--text-body)' }}>Portfolio</span>
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={() => setActiveLink(link.label)}
                className="relative px-4 py-1.5 text-sm rounded-md transition-all duration-200 group"
                style={{ color: activeLink === link.label ? 'var(--text-accent-lighter)' : 'var(--nav-text)' }}
                whileHover={{ color: 'var(--nav-hover)' }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
              >
                <span className="relative z-10 font-mono text-xs tracking-wider">{link.label}</span>

                {/* Hover bg */}
                <motion.span
                  className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: `rgba(var(--accent-rgb), 0.07)`, border: `1px solid rgba(var(--accent-rgb), 0.12)` }}
                />

                {/* Active underline dot */}
                {activeLink === link.label && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: 'var(--accent-color)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.a>
            ))}
          </div>

          {/* Right — status indicator + hamburger */}
          <div className="flex items-center gap-3">

            {/* Live indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full"
              style={{ background: `rgba(var(--accent-rgb), 0.08)`, border: `1px solid rgba(var(--accent-rgb), 0.18)` }}>
              <motion.span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: 'var(--accent-color)' }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
              <span className="text-xs font-mono" style={{ color: 'var(--accent-light)' }}>available</span>
            </div>

            {/* Hamburger */}
            <motion.button
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-md transition-all"
              style={{ border: `1px solid rgba(var(--accent-rgb), 0.2)`, background: `rgba(var(--accent-rgb), 0.06)` }}
              onClick={() => setMobileOpen(!mobileOpen)}
              whileTap={{ scale: 0.92 }}
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="w-4 h-4" style={{ color: 'var(--accent-light)' }} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="w-4 h-4" style={{ color: 'var(--accent-light)' }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -12, scaleY: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed top-[57px] left-0 right-0 z-40"
            style={{
              background: 'var(--overlay-heavy)',
              backdropFilter: 'blur(20px)',
              borderBottom: `1px solid rgba(var(--accent-rgb), 0.14)`,
              transformOrigin: 'top',
            }}
          >
            <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => { setMobileOpen(false); setActiveLink(link.label); }}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-mono transition-all duration-150"
                  style={{ color: 'var(--nav-text)' }}
                  whileHover={{
                    backgroundColor: `rgba(var(--accent-rgb), 0.08)`,
                    color: 'var(--nav-hover)',
                    paddingLeft: '20px',
                  }}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <span style={{ color: 'var(--accent-color)', fontSize: '10px' }}>▸</span>
                  {link.label}
                </motion.a>
              ))}

              {/* Mobile status */}
              <div className="mt-3 pt-3 flex items-center gap-2 px-4"
                style={{ borderTop: `1px solid rgba(var(--accent-rgb), 0.1)` }}>
                <motion.span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--accent-color)' }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                />
                <span className="text-xs font-mono" style={{ color: 'var(--text-accent)' }}>open to opportunities</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}