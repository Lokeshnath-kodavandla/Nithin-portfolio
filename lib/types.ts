export interface Skill {
  id: string;
  name: string;
  icon_name: string;
  created_at: string;
}

export interface Certification {
  id: string;
  title: string;
  image_url: string;
  link: string;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  youtube_url: string;
  image_url: string;
  thumbnail_url: string;
  github_url: string | null;
  created_at: string;
}
