export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  version?: string | null;
  purpose?: string | null;
  demoLink?: string | null;
  githubLink?: string | null;
  videoLink?: string | null;
  guidelineLink?: string | null;
  alternativeLink?: string | null;
  categories: string[];
}

export interface ProjectsData {
  categories: Category[];
  projects: Project[];
  categoryOrder: Record<string, string[]>;
}
