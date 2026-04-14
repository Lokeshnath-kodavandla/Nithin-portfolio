'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Calendar, MapPin, GraduationCap, Code2 } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Education {
  id: number;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  type: 'academic' | 'self';
  highlights?: string[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const educationHistory: Education[] = [
  {
    id: 1,
    degree: "Master of Data Sciences",
    institution: "University college of Science Saifabad",
    location: "Hyderabad, India",
    startDate: "2024",
    endDate: "Present",
    description:
      "Focused on futuristic Data Science student with real-world deployment, and full integration.",
    type: "academic",
    highlights: ["Data Science", "Machine Learning","AI","Mloops","Framer Motion"],
  },
  {
    id: 2,
    degree: "B.Sc. in Data Science, Statistics & Mathematics",
    institution: "Tara Government Degree College, Sangareddy",
    location: "Osmania University, Telangana",
    startDate: "2021",
    endDate: "Jul 2024",
    description:
      "Graduated with a specialisation in Data Science, Statistics & Mathematics. Built ML models for disease prediction selected for IBM SkillBuild National-Level Pitch Night. Won 1st Prize at Strata Vision — National-Level Data Analytics Fest.",
    type: "academic",
    highlights: ["Data Science", "Machine Learning", "IBM SkillBuild", "1st Prize — Strata Vision"],
  },
];

// ─── Corner SVG accent ────────────────────────────────────────────────────────
function Corner({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      <path d="M0 14 L0 0 L14 0" stroke="#6366f1" strokeWidth="1.5" />
    </svg>
  );
}

// ─── Animated heading text ────────────────────────────────────────────────────
function AnimatedText({ text, gradient }: { text: string; gradient?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <span ref={ref} className="inline-block overflow-hidden">
      <motion.span
        className="inline-block"
        initial={{ y: '100%', opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={
          gradient
            ? {
                background: 'linear-gradient(90deg, #6366f1, #a5b4fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }
            : { color: '#f1f5f9' }
        }
      >
        {text}
      </motion.span>
    </span>
  );
}

// ─── Highlight pill ───────────────────────────────────────────────────────────
function Pill({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wide"
      style={{
        background: 'rgba(79,70,229,0.1)',
        border: '1px solid rgba(99,102,241,0.22)',
        color: '#818cf8',
      }}
    >
      {label}
    </span>
  );
}

// ─── Single Education Card ────────────────────────────────────────────────────
function EduCard({ edu, index }: { edu: Education; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.13, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex flex-col md:flex-row items-start gap-0 md:gap-8 ${
        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
    >
      {/* ── Card half ── */}
      <div className="w-full md:w-[calc(50%-2.5rem)]">
        <motion.div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #0e0f23 0%, #0a0b1a 100%)',
            border: '1px solid rgba(99,102,241,0.18)',
          }}
          whileHover={{
            borderColor: 'rgba(99,102,241,0.5)',
            boxShadow:
              '0 0 48px rgba(79,70,229,0.13), 0 20px 48px rgba(0,0,0,0.55)',
            y: -5,
          }}
          transition={{ duration: 0.25 }}
        >
          {/* Corner accents */}
          <Corner className="absolute top-0 left-0 z-10 opacity-60" />
          <Corner className="absolute top-0 right-0 z-10 opacity-60 rotate-90" />
          <Corner className="absolute bottom-0 left-0 z-10 opacity-60 -rotate-90" />
          <Corner className="absolute bottom-0 right-0 z-10 opacity-60 rotate-180" />

          {/* Top gradient bar */}
          <div
            className="h-[2px] w-full"
            style={{
              background:
                'linear-gradient(90deg, transparent, #4f46e5, #6366f1, transparent)',
            }}
          />

          <div className="p-6">
            {/* Icon row */}
            <div className="flex items-start justify-between mb-5">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{
                  background: 'rgba(79,70,229,0.12)',
                  border: '1px solid rgba(99,102,241,0.25)',
                }}
              >
                {edu.type === 'self' ? (
                  <Code2 className="w-5 h-5" style={{ color: '#818cf8' }} />
                ) : (
                  <GraduationCap className="w-5 h-5" style={{ color: '#818cf8' }} />
                )}
              </div>

              <span
                className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full"
                style={{
                  background: 'rgba(79,70,229,0.1)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  color: '#818cf8',
                }}
              >
                {edu.type === 'self' ? 'Self-Directed' : 'Academic'}
              </span>
            </div>

            {/* Degree */}
            <h3
              className="text-base font-bold mb-1 leading-snug"
              style={{ color: '#f1f5f9', letterSpacing: '-0.015em' }}
            >
              {edu.degree}
            </h3>

            {/* Institution */}
            <p className="text-sm font-semibold mb-1" style={{ color: '#a5b4fc' }}>
              {edu.institution}
            </p>

            {/* Location */}
            <div className="flex items-center gap-1 mb-4">
              <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: '#818cf8' }} />
              <span className="text-xs" style={{ color: '#94a3b8' }}>
                {edu.location}
              </span>
            </div>

            {/* Date badge */}
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg mb-5"
              style={{
                background: 'rgba(99,102,241,0.07)',
                border: '1px solid rgba(99,102,241,0.16)',
              }}
            >
              <Calendar className="w-3 h-3" style={{ color: '#6366f1' }} />
              <span className="text-xs font-mono" style={{ color: '#818cf8' }}>
                {edu.startDate} — {edu.endDate}
              </span>
            </div>

            {/* Divider */}
            <div
              className="mb-4 h-px"
              style={{
                background:
                  'linear-gradient(90deg, rgba(99,102,241,0.3), transparent)',
              }}
            />

            {/* Description */}
            <p className="text-sm leading-7 mb-5" style={{ color: '#94a3b8' }}>
              {edu.description}
            </p>

            {/* Highlight pills */}
            {edu.highlights && (
              <div className="flex flex-wrap gap-2">
                {edu.highlights.map((h) => (
                  <Pill key={h} label={h} />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Centre dot (desktop) ── */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-7 z-10 items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.13 + 0.2 }}
          className="w-4 h-4 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
            boxShadow: '0 0 18px rgba(99,102,241,0.75)',
            border: '2px solid #0a0b1a',
          }}
        />
      </div>

      {/* ── Empty half ── */}
      <div className="hidden md:block md:w-[calc(50%-2.5rem)]" />
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
const EducationSection: React.FC = () => {
  return (
    <section
      id="education"
      className="relative py-24 px-4 sm:px-6 overflow-hidden"
      style={{ background: '#0a0b1a' }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Ambient glow orbs */}
      <div
        className="absolute top-16 left-1/3 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(79,70,229,0.07) 0%, transparent 70%)',
          filter: 'blur(48px)',
        }}
      />
      <div
        className="absolute bottom-16 right-1/3 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)',
          filter: 'blur(48px)',
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          {/* Label badge */}
          <div
            className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full"
            style={{
              background: 'rgba(79,70,229,0.1)',
              border: '1px solid rgba(99,102,241,0.25)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: '#6366f1' }}
            />
            <span
              className="text-xs font-mono tracking-widest uppercase"
              style={{ color: '#818cf8' }}
            >
              Academic Background
            </span>
          </div>

          {/* Heading */}
          <h2
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ letterSpacing: '-0.03em' }}
          >
            <AnimatedText text="Education & " />
            <AnimatedText text="Training" gradient />
          </h2>

          <p className="text-sm max-w-xs mx-auto" style={{ color: '#94a3b8' }}>
            Academic roots and continuous self-development
          </p>
        </motion.div>

        {/* ── Timeline ── */}
        <div className="relative">
          {/* Vertical line — desktop only */}
          <div
            className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px"
            style={{
              background:
                'linear-gradient(to bottom, transparent, rgba(99,102,241,0.4) 12%, rgba(99,102,241,0.4) 88%, transparent)',
            }}
          />

          <div className="flex flex-col gap-12 md:gap-16">
            {educationHistory.map((edu, index) => (
              <EduCard key={edu.id} edu={edu} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;