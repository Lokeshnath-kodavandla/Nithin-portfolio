import { Navbar } from '@/components/Navbar';
import  HeroSection from '@/components/portfolio/HeroSection';
import { SkillsSection } from '@/components/portfolio/SkillsSection';
import { ProjectsSection } from '@/components/portfolio/ProjectsSection';
import { CertificationsSection } from '@/components/portfolio/CertificationsSection';
import  EducationSection  from '@/components/portfolio/EducationSection';
import { SnakeGame } from '@/components/game/SnakeGame';
import  AboutSection  from '@/components/portfolio/AboutSection';
import ContactSection from '@/components/portfolio/ContactSection';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <HeroSection />
      <div className="max-w-full overflow-hidden">
        <AboutSection/>
        <SkillsSection />
        <ProjectsSection />
        <CertificationsSection />
        <EducationSection />
        <SnakeGame />
        <ContactSection/>
      </div>
      <footer
        className="border-t py-8 text-center text-xs theme-transition"
        style={{
          background: 'var(--section-bg)',
          color: 'var(--text-muted)',
          borderColor: 'var(--divider)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>
            <span style={{ color: 'var(--text-accent)' }} className="font-semibold">Nithin</span>
            <span style={{ color: 'var(--text-body)' }}> — Data Analyst</span>
          </span>

          {/* Theme Switcher */}
          <ThemeToggle />

          <a
            href="/admin"
            className="admin-footer-link transition-colors duration-200"
            style={{ color: 'var(--text-muted)' }}
          >
            Admin Dashboard →
          </a>
        </div>
      </footer>
    </main>
  );
}
