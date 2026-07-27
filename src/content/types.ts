/**
 * Content shapes. These are the single source of truth for both the static
 * fallback content and the Supabase row types, so the site renders identically
 * whether or not the database is reachable.
 */

export type Profile = {
  name: string;
  title: string;
  fullTitle: string;
  tagline: string;
  shortBio: string;
  longBio: string[];
  foundingStory: string[];
  location: string;
  email: string;
  phone: string;
  headshotUrl: string;
  portraitUrl: string;
  cvUrl: string | null;
  company: string;
  companyUrl: string;
  companyTagline: string;
  availability: string;
};

export type Metric = {
  label: string;
  value: number;
  suffix: string;
  /** Which side of the dual-track motif this metric belongs to. */
  track: "studio" | "academy";
  note: string;
};

export type Service = {
  title: string;
  slug: string;
  description: string;
  iconName: string;
  features: string[];
  track: "studio" | "academy";
};

export type CaseStudy = {
  title: string;
  slug: string;
  client: string;
  category: string;
  eyebrow: string;
  year: string;
  summary: string;
  brief: string;
  solution: string;
  result: string;
  coverImageUrl: string | null;
  gallery: string[];
  techUsed: string[];
  liveUrl: string | null;
  featured: boolean;
  track: "studio" | "academy";
};

export type Testimonial = {
  quote: string;
  authorName: string;
  authorTitle: string;
  authorCompany: string | null;
  authorPhotoUrl: string | null;
};

export type Experience = {
  organisation: string;
  role: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  location: string;
  description: string;
  bullets: string[];
  track: "studio" | "academy" | "community";
};

export type Education = {
  institution: string;
  qualification: string;
  startYear: string;
  endYear: string;
  isCurrent: boolean;
  note: string | null;
};

export type Certification = {
  title: string;
  issuer: string;
  year: string;
  description: string;
  credentialUrl: string | null;
};

export type Award = {
  title: string;
  issuer: string;
  year: string;
  description: string;
};

export type SkillGroup = {
  group: string;
  iconName: string;
  skills: { name: string; level: number }[];
};

export type Tool = {
  name: string;
  category: string;
};

export type Client = {
  name: string;
  context: string;
  url: string | null;
};

export type Partner = {
  name: string;
  category: string;
  description: string;
  logoUrl: string | null;
  url: string | null;
};

export type GalleryItem = {
  title: string;
  category: string;
  imageUrl: string;
  caption: string;
};

export type SocialLink = {
  platform: string;
  url: string;
  iconName: string;
  handle: string;
};

export type Speaking = {
  title: string;
  event: string;
  organiser: string;
  year: string;
  type: string;
  description: string;
  url: string | null;
};

export type Post = {
  title: string;
  slug: string;
  excerpt: string;
  body: string[];
  tags: string[];
  publishedAt: string;
  readingMinutes: number;
};

export type ValuePillar = {
  title: string;
  description: string;
  iconName: string;
};

export type ProcessStep = {
  index: string;
  title: string;
  description: string;
};
