'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2 } from 'lucide-react';

export function CertificationsManager() {
  const [certs, setCerts] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [link, setLink] = useState('');
  const [error, setError] = useState('');

  async function load() {
    const { data } = await supabase
      .from('certifications')
      .select('*')
      .order('created_at', { ascending: false });

    setCerts(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function add() {
    setError('');

    if (!title.trim()) {
      setError('Title required');
      return;
    }

    const { error } = await supabase.from('certifications').insert({
      title,
      description,
      image_url: imageUrl,
      link,
    });

    if (error) {
      setError(error.message);
    } else {
      setTitle('');
      setDescription('');
      setImageUrl('');
      setLink('');
      load();
    }
  }

  async function remove(id: string) {
    await supabase.from('certifications').delete().eq('id', id);
    load();
  }

  return (
    <div className="space-y-6">

      {/* FORM */}
      <div className="p-4 border rounded-lg space-y-3">

         <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded bg-black text-white placeholder-gray-400"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded bg-black text-white placeholder-gray-400"
          />

          <input
            type="text"
            placeholder="Image URL (Google / Internet)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border p-2 rounded bg-black text-white placeholder-gray-400"
          />

          <input
            type="text"
            placeholder="Credential Link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full border p-2 rounded bg-black text-white placeholder-gray-400"
          />
        {/* Preview */}
        {imageUrl && (
          <img
            src={imageUrl}
            className="w-full h-40 object-cover rounded"
          />
        )}

        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={add}
          className="bg-cyan-400 px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={16} /> Add Certification
        </button>
      </div>

      {/* LIST */}
      <div className="grid md:grid-cols-3 gap-4">
        {certs.map((cert) => (
          <div key={cert.id} className="border p-3 rounded">
            <img
              src={cert.image_url}
              className="h-32 w-full object-cover mb-2 rounded"
            />
            <p className="font-semibold">{cert.title}</p>
            <button
              onClick={() => remove(cert.id)}
              className="text-red-500 mt-2 flex items-center gap-1"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}