'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Skill } from '@/lib/types';
import { Plus, Trash2, Code } from 'lucide-react';

const ICON_OPTIONS = [
  'Code', 'Database', 'BarChart2', 'TrendingUp', 'Brain', 'Cloud',
  'Table', 'PieChart', 'GitBranch', 'Terminal', 'Globe', 'Layers',
  'Cpu', 'FileText', 'Activity', 'Zap',
];

export function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Code');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    const { data } = await supabase.from('skills').select('*').order('created_at');
    setSkills(data ?? []);
  }

  useEffect(() => { load(); }, []);

  async function add() {
    if (!name.trim()) { setError('Please enter a skill name.'); return; }
    setLoading(true);
    setError('');
    const { error: err } = await supabase.from('skills').insert({ name: name.trim(), icon_name: icon });
    if (err) setError(err.message);
    else { setName(''); await load(); }
    setLoading(false);
  }

  async function remove(id: string) {
    await supabase.from('skills').delete().eq('id', id);
    await load();
  }

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-xl p-4 space-y-3">
        <div className="flex gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="Skill name (e.g. Python)"
            className="flex-1 bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-electric/50"
          />
          <select
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-electric/50"
          >
            {ICON_OPTIONS.map((ic) => (
              <option key={ic} value={ic}>{ic}</option>
            ))}
          </select>
          <button
            onClick={add}
            disabled={loading}
            className="px-4 py-2 electric-bg text-black rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        {error && <p className="text-destructive text-xs">{error}</p>}
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          No skills yet. Add your first skill above.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center justify-between glass-card rounded-lg px-4 py-2.5"
            >
              <div className="flex items-center gap-2.5">
                <Code className="w-4 h-4 electric-text" />
                <div>
                  <p className="text-sm font-medium">{skill.name}</p>
                  <p className="text-xs text-muted-foreground">{skill.icon_name}</p>
                </div>
              </div>
              <button
                onClick={() => remove(skill.id)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
