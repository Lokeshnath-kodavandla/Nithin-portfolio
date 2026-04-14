 



'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
// import AnimatedText from '@/components/Animatedtext';
// Replace with your actual photo import:
// import NithinPhoto from '../assets/Nithin.jpg';

interface AnimatedTextProps {
  text: string;
  className?: string;
  once?: boolean;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = '', once = false }) => {
  // Split text into words
  const words = text.split(' ');

  // Variants for container of words
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  // Variants for each word
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
    >
      {words.map((word, index) => (
        <motion.span
          className="inline-block mr-1"
          variants={child}
          key={index}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

const AboutSection: React.FC = () => {
  const [ref, inView] = useInView({ threshold: 0.15, triggerOnce: true });
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  const stats = [
    { value: 'DP-600', label: 'Certified', sub: 'Microsoft Fabric' },
    { value: '1st', label: 'Prize', sub: 'Strata Vision Fest' },
    { value: '3+', label: 'Dashboards', sub: 'Production Built' },
    { value: 'Gold', label: 'Badge', sub: 'HackerRank SQL' },
  ];

  const highlights = [
    { label: 'Role', value: 'Data Analytics Intern @ Smith & Nephew' },
    { label: 'Location', value: 'Hyderabad → Pune, India' },
    { label: 'Focus', value: 'Analytics Engineering · BI · ML' },
    { label: 'Education', value: 'B.Sc. Data Science, Statistics & Mathematics' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 90 } },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

        .about-section *,
        .about-section *::before,
        .about-section *::after { box-sizing: border-box; }

        .about-section { font-family: 'Space Grotesk', sans-serif; }

        .about-photo-wrap {
          position: relative;
          aspect-ratio: 4/5;
          max-width: 420px;
          width: 100%;
          margin: 0 auto;
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }

        .about-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .about-highlights-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .about-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 500px) {
          .about-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .about-highlights-grid {
            grid-template-columns: 1fr;
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .cert-badge {
          animation: float 4s ease-in-out infinite;
        }

        .ring-spin {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>

      <section
        className="about-section"
        id="about"
        style={{
          position: 'relative',
          padding: 'clamp(64px, 9vw, 128px) clamp(16px, 5vw, 64px)',
          background: '#0C0C14',
          overflow: 'hidden',
        }}
      >
        {/* Dot grid */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
        }} />

        {/* Ambient glow */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: '10%', right: '-80px',
          width: '480px', height: '480px', borderRadius: '50%',
          background: '#6C63FF', opacity: 0.04, filter: 'blur(90px)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto' }}>

          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#6C63FF',
                marginBottom: '12px',
              }}
            >
              Get to know me
            </motion.p>
            <AnimatedText
              text="About Me"
              className="text-3xl md:text-4xl font-bold"
              once
            />
          </div>

          <div ref={ref} className="about-grid">

            {/* ── LEFT — Photo column ── */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="about-photo-wrap"
            >
              {/* Decorative corner squares */}
              <div style={{
                position: 'absolute', top: -12, left: -12,
                width: 60, height: 60,
                border: '1.5px solid rgba(108,99,255,0.35)',
                borderRadius: '8px', zIndex: 0,
              }} />
              <div style={{
                position: 'absolute', bottom: -12, right: -12,
                width: 60, height: 60,
                border: '1.5px solid rgba(0,201,167,0.3)',
                borderRadius: '8px', zIndex: 0,
              }} />

              {/* Spinning ring behind photo */}
              <div className="ring-spin" style={{
                position: 'absolute', inset: '-20px',
                borderRadius: '50%',
                border: '1px dashed rgba(108,99,255,0.15)',
                zIndex: 0,
                pointerEvents: 'none',
              }} />

              {/* Photo frame */}
              <div style={{
                position: 'relative', zIndex: 1,
                width: '80%', height: '80%',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
              }}>
                {/* ── Replace with your actual photo ── */}
                <img src="https://noonsavath-nithin.web.app/assets/Nithin_Portfolio_pic-Dw8nE6rU.jpg" alt="Nithin Nunsavath" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              </div>

              {/* Floating cert badge */}
              <div className="cert-badge" style={{
                position: 'absolute', bottom: 24, left: -24, zIndex: 2,
                background: 'rgba(18,18,30,0.92)',
                border: '1px solid rgba(108,99,255,0.4)',
                borderRadius: '14px',
                padding: '10px 16px',
                backdropFilter: 'blur(12px)',
                display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '8px',
                  background: 'rgba(108,99,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px',
                }}>🏆</div>
                <div>
                  <div style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600, fontSize: '12px', color: '#E0E0F0',
                  }}>DP-600 Certified</div>
                  <div style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '10px', color: '#6C63FF', marginTop: '1px',
                  }}>Microsoft Fabric</div>
                </div>
              </div>

              {/* Floating IBM badge */}
              <div style={{
                position: 'absolute', top: 24, right: -20, zIndex: 2,
                background: 'rgba(18,18,30,0.92)',
                border: '1px solid rgba(0,201,167,0.35)',
                borderRadius: '12px',
                padding: '8px 14px',
                backdropFilter: 'blur(12px)',
              }}>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '10px', color: '#00C9A7', letterSpacing: '0.06em',
                }}>IBM SkillBuild</div>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '11px', fontWeight: 500, color: '#C0C0D8', marginTop: '2px',
                }}>National Pitch Night</div>
              </div>
            </motion.div>

            {/* ── RIGHT — Content column ── */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              <motion.div variants={itemVariants}>
                <h3 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(22px, 3vw, 30px)',
                  color: '#F0F0FA',
                  margin: '0 0 6px',
                  letterSpacing: '-0.02em',
                }}>
                  Nithin Nunsavath
                </h3>
                <p style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '12px',
                  color: '#6C63FF',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  margin: '0 0 24px',
                }}>
                  Data Analytics &amp; Analytics Engineering
                </p>
              </motion.div>

              <motion.p variants={itemVariants} style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '15px',
                color: 'rgba(200,200,220,0.75)',
                lineHeight: 1.75,
                margin: '0 0 16px',
              }}>
                Microsoft Fabric Certified Data Analyst (DP-600) with hands-on experience at
                <strong style={{ color: '#E0E0F0', fontWeight: 500 }}> Smith &amp; Nephew</strong>.
                I specialize in building end-to-end analytics pipelines — from raw data ingestion
                to insight delivery — using Power BI, SQL, Python, and Microsoft Fabric.
              </motion.p>

              <motion.p variants={itemVariants} style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '15px',
                color: 'rgba(200,200,220,0.65)',
                lineHeight: 1.75,
                margin: '0 0 28px',
              }}>
                I've automated reporting workflows, reduced 84 Power Query queries down to 9
                optimized Lakehouse tables, and delivered dashboards that drive real operational
                decisions. Passionate about machine learning and predictive analytics — my disease
                forecasting project was selected for IBM SkillBuild's National-Level Pitch Night.
              </motion.p>

              {/* Quick highlights */}
              <motion.div variants={itemVariants} className="about-highlights-grid" style={{ marginBottom: '28px' }}>
                {highlights.map((h, i) => (
                  <div key={i} style={{
                    padding: '12px 14px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '12px',
                  }}>
                    <div style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '10px',
                      color: 'rgba(108,99,255,0.8)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginBottom: '4px',
                    }}>
                      {h.label}
                    </div>
                    <div style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#D0D0E8',
                    }}>
                      {h.value}
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Stats */}
              <motion.div variants={containerVariants} className="about-stats-grid">
                {stats.map((s, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    onMouseEnter={() => setHoveredStat(i)}
                    onMouseLeave={() => setHoveredStat(null)}
                    style={{
                      textAlign: 'center',
                      padding: '16px 10px',
                      background: hoveredStat === i
                        ? 'rgba(108,99,255,0.1)'
                        : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${hoveredStat === i ? 'rgba(108,99,255,0.4)' : 'rgba(255,255,255,0.07)'}`,
                      borderRadius: '14px',
                      cursor: 'default',
                      transition: 'all 0.22s ease',
                    }}
                  >
                    <div style={{
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 700,
                      fontSize: 'clamp(16px, 2.5vw, 22px)',
                      color: hoveredStat === i ? '#8B83FF' : '#E0E0F0',
                      transition: 'color 0.22s ease',
                    }}>
                      {s.value}
                    </div>
                    <div style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'rgba(200,200,220,0.8)',
                      marginTop: '2px',
                    }}>
                      {s.label}
                    </div>
                    <div style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '9px',
                      color: 'rgba(108,99,255,0.65)',
                      marginTop: '3px',
                      letterSpacing: '0.04em',
                    }}>
                      {s.sub}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  );
};

export default AboutSection;