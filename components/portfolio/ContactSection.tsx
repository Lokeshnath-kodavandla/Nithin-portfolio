'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  ExternalLink,
  Send,
  MessageCircle,
  Copy,
  Check,
} from 'lucide-react';

// ─── Contact data from resume ─────────────────────────────────────────────────
const CONTACT = {
  name: 'Nithin Nunsavath',
  email: 'nunsavathnithin@outlook.com',
  phone: '+91 8978225293',
  location: 'Hyderabad, India',
  linkedin: 'https://www.linkedin.com/in/nunsavath-nithin-aa87aa252/',
  github: 'https://github.com/Aidenarthub',
  whatsapp: 'https://wa.me/918978225293',
};

// ─── Corner SVG ───────────────────────────────────────────────────────────────
function Corner({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={className}>
      <path d="M0 12 L0 0 L12 0" stroke="#6366f1" strokeWidth="1.5" />
    </svg>
  );
}

// ─── Copy to clipboard button ─────────────────────────────────────────────────
function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
      style={{
        background: copied ? 'rgba(79,70,229,0.2)' : 'rgba(99,102,241,0.08)',
        border: `1px solid ${copied ? 'rgba(99,102,241,0.5)' : 'rgba(99,102,241,0.18)'}`,
      }}
      title="Copy to clipboard"
    >
      {copied
        ? <Check className="w-3.5 h-3.5" style={{ color: '#a5b4fc' }} />
        : <Copy className="w-3.5 h-3.5" style={{ color: '#818cf8' }} />
      }
    </button>
  );
}

// ─── Info row ─────────────────────────────────────────────────────────────────
function InfoRow({
  icon,
  label,
  value,
  href,
  copyValue,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  copyValue?: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-4 group"
    >
      {/* Icon box */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: 'rgba(79,70,229,0.1)',
          border: '1px solid rgba(99,102,241,0.22)',
        }}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-mono tracking-widest uppercase mb-0.5" style={{ color: '#818cf8' }}>
          {label}
        </p>
        {href ? (
          <a
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="text-sm font-medium truncate block transition-colors duration-200 hover:underline"
            style={{ color: '#c7d2fe' }}
          >
            {value}
          </a>
        ) : (
          <p className="text-sm font-medium truncate" style={{ color: '#c7d2fe' }}>
            {value}
          </p>
        )}
      </div>

      {/* Copy button */}
      {copyValue && <CopyButton value={copyValue} />}
    </motion.div>
  );
}

// ─── Social link button ───────────────────────────────────────────────────────
function SocialBtn({
  href,
  icon,
  label,
  accent,
  delay,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  accent: string;
  delay: number;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, scale: 1.03 }}
      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
      style={{
        background: accent,
        border: '1px solid rgba(99,102,241,0.3)',
        color: '#f1f5f9',
        boxShadow: '0 0 20px rgba(79,70,229,0.2)',
        minWidth: 0,
      }}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </motion.a>
  );
}

// ─── WhatsApp SVG icon ────────────────────────────────────────────────────────
function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
const ContactSection: React.FC = () => {
  return (
    <section
      id="contact"
      className="relative py-24 px-4 sm:px-6 overflow-hidden"
      style={{ background: '#0a0b1a' }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(99,102,241,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.035) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(79,70,229,0.07) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative max-w-2xl mx-auto">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full"
            style={{
              background: 'rgba(79,70,229,0.1)',
              border: '1px solid rgba(99,102,241,0.25)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#6366f1' }} />
            <span className="text-xs font-mono tracking-widest uppercase" style={{ color: '#818cf8' }}>
              Get In Touch
            </span>
          </div>

          <h2
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: '#f1f5f9', letterSpacing: '-0.03em' }}
          >
            Contact{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #6366f1, #a5b4fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Me
            </span>
          </h2>
          <p className="text-sm" style={{ color: '#94a3b8' }}>
            Open to Data Analytics & Analytics Engineering roles
          </p>
        </motion.div>

        {/* ── Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #0e0f23 0%, #0a0b1a 100%)',
            border: '1px solid rgba(99,102,241,0.2)',
            boxShadow: '0 0 60px rgba(79,70,229,0.08), 0 24px 48px rgba(0,0,0,0.5)',
          }}
        >
          {/* Corner accents */}
          <Corner className="absolute top-0 left-0 z-10 opacity-70" />
          <Corner className="absolute top-0 right-0 z-10 opacity-70 rotate-90" />
          <Corner className="absolute bottom-0 left-0 z-10 opacity-70 -rotate-90" />
          <Corner className="absolute bottom-0 right-0 z-10 opacity-70 rotate-180" />

          {/* Top bar */}
          <div
            className="h-[2px] w-full"
            style={{
              background: 'linear-gradient(90deg, transparent, #4f46e5, #6366f1, transparent)',
            }}
          />

          <div className="p-7 sm:p-9">
            {/* ── Contact info rows ── */}
            <div className="space-y-5 mb-8">
              <InfoRow
                icon={<Mail className="w-4 h-4" style={{ color: '#818cf8' }} />}
                label="Email"
                value={CONTACT.email}
                href={`mailto:${CONTACT.email}`}
                copyValue={CONTACT.email}
                delay={0.1}
              />

              <div
                className="h-px"
                style={{ background: 'rgba(99,102,241,0.1)' }}
              />

              <InfoRow
                icon={<Phone className="w-4 h-4" style={{ color: '#818cf8' }} />}
                label="Phone"
                value={CONTACT.phone}
                href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}
                copyValue={CONTACT.phone}
                delay={0.15}
              />

              <div
                className="h-px"
                style={{ background: 'rgba(99,102,241,0.1)' }}
              />

              <InfoRow
                icon={<MapPin className="w-4 h-4" style={{ color: '#818cf8' }} />}
                label="Location"
                value={CONTACT.location}
                delay={0.2}
              />
            </div>

            {/* ── Divider ── */}
            <div
              className="mb-7 h-px"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.35), transparent)',
              }}
            />

            {/* ── Social / action buttons ── */}
            <div className="flex gap-3">
              <SocialBtn
                href={CONTACT.linkedin}
                icon={<Linkedin className="w-4 h-4" />}
                label="LinkedIn"
                accent="linear-gradient(135deg, #1a1f3a, #1e2a4a)"
                delay={0.25}
              />
              <SocialBtn
                href={CONTACT.github}
                icon={<Github className="w-4 h-4" />}
                label="GitHub"
                accent="linear-gradient(135deg, #111827, #1f2937)"
                delay={0.3}
              />
              <SocialBtn
                href={`mailto:${CONTACT.email}`}
                icon={<Send className="w-4 h-4" />}
                label="Email"
                accent="linear-gradient(135deg, #4f46e5, #6366f1)"
                delay={0.35}
              />
              <SocialBtn
                href={CONTACT.whatsapp}
                icon={<WhatsAppIcon />}
                label="WhatsApp"
                accent="linear-gradient(135deg, #16532a, #166534)"
                delay={0.4}
              />
            </div>

            {/* ── Availability badge ── */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="mt-7 flex items-center justify-center gap-2"
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: '#4ade80' }}
              />
              <span className="text-xs font-mono" style={{ color: '#94a3b8' }}>
                Available for full-time roles · Pune / Remote
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;