/*
  # Portfolio Website Schema

  ## Summary
  Creates all tables needed for the Data Analyst portfolio website.

  ## New Tables
  1. `skills` - Stores skill cards with name and lucide icon name
     - `id` (uuid, primary key)
     - `name` (text, skill name)
     - `icon_name` (text, lucide icon identifier)
     - `created_at` (timestamp)

  2. `certifications` - Stores certification cards
     - `id` (uuid, primary key)
     - `title` (text, certification title)
     - `image_url` (text, Supabase Storage URL)
     - `link` (text, optional external link)
     - `created_at` (timestamp)

  3. `projects` - Stores portfolio projects
     - `id` (uuid, primary key)
     - `title` (text, project title)
     - `description` (text, project description)
     - `youtube_url` (text, YouTube video URL)
     - `thumbnail_url` (text, optional thumbnail image URL)
     - `created_at` (timestamp)

  ## Security
  - RLS enabled on all tables
  - Public SELECT for all tables (portfolio is publicly viewable)
  - Authenticated users only for INSERT, UPDATE, DELETE
*/

CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon_name text NOT NULL DEFAULT 'Code',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view skills"
  ON skills FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert skills"
  ON skills FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete skills"
  ON skills FOR DELETE
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text DEFAULT '',
  link text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view certifications"
  ON certifications FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert certifications"
  ON certifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete certifications"
  ON certifications FOR DELETE
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  youtube_url text DEFAULT '',
  thumbnail_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view projects"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (true);
