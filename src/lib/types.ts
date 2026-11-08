export type Profile = {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  resumeUrl: string;
  available: boolean;
  yearsExperience: number;
  /** Extra titles on the right of the hero, one per line. */
  heroRoles: string;
  /** Short word next to the About heading, e.g. "Engineer." */
  aboutTag: string;
  quote: string;
  /** Path or URL of your photo, e.g. /me.png (file goes in /public). */
  photoUrl: string;
  /** Optional separate photo for the About section (e.g. /ahmad-about.jpg). */
  aboutPhotoUrl?: string;
  instagram: string;
  /** WhatsApp number with country code, digits only (e.g. 923001234567). Empty = hidden. */
  whatsapp?: string;
  /** Short line in the footer under your name. */
  footerText: string;
};

export type Highlight = { title: string; text: string };
export type Language = { name: string; level: string; percent: number };
export type Interest = { title: string; description: string; imageUrl: string };

export type Skill = {
  id: string;
  name: string;
  category: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  createdAt: string;
  /* Case study (all optional — empty parts are hidden in the popup) */
  year?: string;
  /** Your role, e.g. "Full-stack developer" */
  role?: string;
  problem?: string;
  solution?: string;
  /** Bullet points */
  features?: string[];
  /** Bullet points */
  results?: string[];
  /** Extra screenshots shown in the popup */
  gallery?: string[];
  /** Google Drive (or YouTube) link to a video — shown as a player in the popup */
  videoUrl?: string;
};

export type Experience = {
  id: string;
  type: "work" | "education" | "achievement";
  role: string;
  company: string;
  period: string;
  description: string;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
};

export type Db = {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  highlights: Highlight[];
  languages: Language[];
  interests: Interest[];
  messages: Message[];
  /** page views per day, keyed by YYYY-MM-DD */
  views: Record<string, number>;
};
