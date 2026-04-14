import { Navbar } from '@/components/Navbar';
import  HeroSection from '@/components/portfolio/HeroSection';
import { SkillsSection } from '@/components/portfolio/SkillsSection';
import { ProjectsSection } from '@/components/portfolio/ProjectsSection';
import { CertificationsSection } from '@/components/portfolio/CertificationsSection';
import  EducationSection  from '@/components/portfolio/EducationSection';
import { SnakeGame } from '@/components/game/SnakeGame';
import  AboutSection  from '@/components/portfolio/AboutSection';
import ContactSection from '@/components/portfolio/ContactSection';
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
      <footer className="border-t py-8 text-center text-xs text-muted-foreground">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            <span className="electric-text font-semibold">Nithin</span> — Data Analyst
          </span>
          <a
            href="/admin"
            className="hover:electric-text transition-colors duration-200"
          >
            Admin Dashboard →
          </a>
        </div>
      </footer>
    </main>
  );
}
