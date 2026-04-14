'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { SkillsManager } from '@/components/admin/SkillsManager';
import { CertificationsManager } from '@/components/admin/CertificationsManager';
import { ProjectsManager } from '@/components/admin/ProjectsManager';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Database, Code, Award, Layers, LogOut, Chrome as Home, ChevronRight, Loader as Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { User } from '@supabase/supabase-js';

type Tab = 'skills' | 'certifications' | 'projects';

const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'skills', label: 'Skills', icon: Code },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'projects', label: 'Projects', icon: Layers },
];

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('skills');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/admin/login');
      } else {
        setUser(session.user);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.replace('/admin/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace('/admin/login');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 electric-text animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-bg">
      <header className="glass border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg electric-bg flex items-center justify-center">
              <Database className="w-4 h-4 text-black" />
            </div>
            <div>
              <span className="font-bold text-sm">Admin Dashboard</span>
              <span className="hidden sm:inline text-muted-foreground text-xs ml-2">
                {user?.email}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href="/"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-electric/5 transition-all"
            >
              <Home className="w-3.5 h-3.5" />
              Portfolio
            </a>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Portfolio Manager</h1>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
              <span>Admin</span>
              <ChevronRight className="w-3 h-3" />
              <span className="electric-text capitalize">{activeTab}</span>
            </div>
          </div>

          <div className="flex gap-2 mb-6 flex-wrap">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'electric-bg text-black electric-glow'
                      : 'glass-card text-muted-foreground hover:text-foreground hover:electric-text'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="glass rounded-2xl p-6">
            {activeTab === 'skills' && (
              <motion.div key="skills" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-lg font-semibold mb-4">Manage Skills</h2>
                <SkillsManager />
              </motion.div>
            )}
            {activeTab === 'certifications' && (
              <motion.div key="certs" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-lg font-semibold mb-4">Manage Certifications</h2>
                <CertificationsManager />
              </motion.div>
            )}
            {activeTab === 'projects' && (
              <motion.div key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-lg font-semibold mb-4">Manage Projects</h2>
                <ProjectsManager />
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
