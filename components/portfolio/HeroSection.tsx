'use client';

import { motion } from 'framer-motion';
import { FileDown } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tech = ['Power BI', 'SQL', 'Python', 'DAX', 'Azure', 'Fabric', 'Tableau', 'ETL'];

  const orbits = [
    { items: ['ML', 'AI'], radius: 110, duration: 12 },
    { items: ['SQL', 'DAX', 'ETL'], radius: 160, duration: 18 },
    { items: ['Power BI', 'Python', 'Azure', 'MLOps'], radius: 210, duration: 25 },
  ];

  // Animated grid canvas background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let frame = 0;
    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Read the accent RGB from CSS variable
      const style = getComputedStyle(document.documentElement);
      const accentRgb = style.getPropertyValue('--accent-rgb').trim() || '99, 102, 241';

      const gridSize = 44;
      ctx.strokeStyle = `rgba(${accentRgb}, 0.07)`;
      ctx.lineWidth = 1;

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Floating particles
      const particles = 28;
      for (let i = 0; i < particles; i++) {
        const seed = i * 137.5;
        const x = ((seed * 73.1 + frame * 0.12 * (i % 3 === 0 ? 1 : -0.5)) % canvas.width + canvas.width) % canvas.width;
        const y = ((seed * 41.7 + frame * 0.08 * (i % 2 === 0 ? 1 : -1)) % canvas.height + canvas.height) % canvas.height;
        const opacity = 0.15 + 0.2 * Math.sin(frame * 0.02 + i);
        const size = 1 + (i % 3) * 0.5;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accentRgb}, ${opacity})`;
        ctx.fill();
      }

      frame++;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center pt-24 md:pt-28 px-6 overflow-hidden theme-transition"
      style={{ background: 'var(--hero-bg)', color: 'var(--text-heading)' }}
    >

      {/* Canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Radial glow */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, rgba(var(--accent-rgb), 0.12) 0%, transparent 70%)` }} />

      <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center w-full">

        {/* ── LEFT ── */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.p
            className="text-sm font-mono"
            style={{ color: 'var(--accent-light)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span style={{ color: 'var(--accent-color)' }}>&gt;</span> hello, i&apos;m
          </motion.p>

          <motion.h1
            className="text-5xl font-bold leading-tight tracking-tight"
            style={{ color: 'var(--text-heading)' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Nithin Nunsavath
          </motion.h1>

          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-8 h-px" style={{ background: 'var(--accent-color)' }} />
            <span className="font-medium tracking-wide" style={{ color: 'var(--text-accent-lighter)' }}>Data Analytics Specialist</span>
          </motion.div>

          <motion.p
            className="max-w-md leading-relaxed text-sm"
            style={{ color: 'var(--text-body)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Microsoft Fabric Certified{' '}
            <span className="font-semibold" style={{ color: 'var(--text-accent-lighter)' }}>DP-600</span> analyst turning raw data
            into decisions that move revenue. Fluent in Power BI, SQL, Python and DAX — building
            dashboards executives actually trust.
          </motion.p>

          {/* Cert badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono"
            style={{
              background: 'var(--badge-bg)',
              border: '1px solid var(--badge-border)',
              color: 'var(--text-accent-lighter)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--text-accent-lighter)' }} />
            Microsoft DP-600 Certified
          </motion.div>

          {/* Tech stack */}
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {tech.map((item, i) => (
              <motion.span
                key={item}
                className="text-xs px-3 py-1 rounded-md font-mono"
                style={{
                  background: `rgba(var(--accent-rgb), 0.04)`,
                  border: `1px solid rgba(var(--accent-rgb), 0.12)`,
                  color: 'var(--text-body)',
                }}
                whileHover={{
                  background: `rgba(var(--accent-rgb), 0.15)`,
                  borderColor: `rgba(var(--accent-rgb), 0.4)`,
                  color: 'var(--text-accent-lightest)',
                  scale: 1.05,
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 + i * 0.05 }}
              >
                {item}
              </motion.span>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.a
            href="/Nithin Nunsavath Resume Data Analyst.pdf"
            download
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium"
            style={{ background: 'var(--gradient-accent)', color: '#fff' }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <FileDown size={15} />
            Download CV
          </motion.a>
        </motion.div>

        {/* ── RIGHT – ORBITAL SYSTEM ── */}
        <div className="relative h-[420px] flex items-center justify-center">

          {/* Orbit rings */}
          {orbits.map((orbit, oi) => (
            <div
              key={oi}
              className="absolute rounded-full"
              style={{
                width: orbit.radius * 2,
                height: orbit.radius * 2,
                border: `1px solid rgba(var(--accent-rgb), 0.12)`,
              }}
            />
          ))}

          {/* Orbiting tags */}
          {orbits.map((orbit, oi) =>
            orbit.items.map((label, ii) => {
              return (
                <motion.div
                  key={`${oi}-${ii}`}
                  className="absolute flex items-center justify-center"
                  style={{ width: 0, height: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: orbit.duration,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: -(orbit.duration / orbit.items.length) * ii,
                  }}
                >
                  <motion.div
                    className="absolute px-2.5 py-1 rounded-md text-xs font-mono whitespace-nowrap"
                    style={{
                      x: orbit.radius,
                      background: 'var(--orbit-tag-bg)',
                      border: `1px solid rgba(var(--accent-rgb), 0.35)`,
                      color: 'var(--text-accent-light)',
                      backdropFilter: 'blur(6px)',
                    }}
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: orbit.duration,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: -(orbit.duration / orbit.items.length) * ii,
                    }}
                  >
                    {label}
                  </motion.div>
                </motion.div>
              );
            })
          )}

          {/* Pulse rings on core */}
          {[1, 2, 3].map((n) => (
            <motion.div
              key={n}
              className="absolute rounded-full"
              style={{ border: `1px solid rgba(var(--accent-rgb), 0.2)` }}
              animate={{
                width: [60, 60 + n * 30],
                height: [60, 60 + n * 30],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: n * 0.7,
                ease: 'easeOut',
              }}
            />
          ))}

          {/* Core */}
          <motion.div
            className="relative z-10 w-[72px] h-[72px] rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, rgba(var(--accent-rgb), 0.3), rgba(var(--accent-rgb), 0.15))`,
              border: `1px solid rgba(var(--accent-rgb), 0.5)`,
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-xs font-mono tracking-widest" style={{ color: 'var(--text-accent-lighter)' }}>DATA</span>
          </motion.div>

          {/* Corner scan line */}
          <motion.div
            className="absolute left-0 right-0 h-px pointer-events-none"
            style={{ background: `linear-gradient(90deg, transparent, rgba(var(--accent-rgb), 0.4), transparent)` }}
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        </div>

      </div>
    </section>
  );
}