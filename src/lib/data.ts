import {
  galleryItems as staticGallery,
  partners as staticPartners,
  services as staticServices,
  caseStudies as staticCaseStudies,
  testimonials as staticTestimonials,
  posts as staticPosts,
  profile as staticProfile,
  metrics as staticMetrics,
  experience as staticExperience,
  education as staticEducation,
  certifications as staticCertifications,
  awards as staticAwards,
  skillGroups as staticSkillGroups,
  clients as staticClients,
  speaking as staticSpeaking,
  socialLinks as staticSocialLinks,
  type GalleryItem,
  type Partner,
  type Service,
  type Profile,
  type Metric,
  type CaseStudy,
  type Testimonial,
  type Post,
  type Experience,
  type Education,
  type Certification,
  type Award,
  type SkillGroup,
  type Client,
  type Speaking,
  type SocialLink,
} from "@/content";
import { createStaticSupabase } from "@/lib/supabase/static";
import { supabaseConfigured } from "@/lib/supabase/config";

async function tryQuery<T>(
  table: string,
  select: string,
): Promise<T[] | null> {
  if (!supabaseConfigured) return null;

  try {
    const supabase = createStaticSupabase();
    const { data, error } = await supabase
      .from(table)
      .select(select)
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.warn(`[data] ${table}: ${error.message} — using built-in content.`);
      return null;
    }

    return (data as T[] | null) ?? null;
  } catch (error) {
    console.warn(
      `[data] ${table} unreachable: ${error instanceof Error ? error.message : error}`,
    );
    return null;
  }
}

async function tryQueryFirst<T>(
  table: string,
  select: string,
): Promise<T | null> {
  const rows = await tryQuery<T>(table, select);
  return rows?.[0] ?? null;
}

function parseArray(v: unknown): string[] {
  if (Array.isArray(v)) return v;
  if (typeof v === "string") {
    try { return JSON.parse(v); } catch { return [v]; }
  }
  return [];
}

function parseSkills(v: unknown): { name: string; level: number }[] {
  if (Array.isArray(v)) return v as { name: string; level: number }[];
  if (typeof v === "string") {
    try { const p = JSON.parse(v); if (Array.isArray(p)) return p; } catch {}
  }
  return [];
}

export async function getProfile(): Promise<Profile> {
  const row = await tryQueryFirst<{
    name: string;
    title: string;
    full_title: string;
    tagline: string;
    short_bio: string;
    long_bio: unknown;
    founding_story: unknown;
    location: string;
    email: string;
    phone: string;
    headshot_url: string;
    portrait_url: string;
    cv_url: string | null;
    company: string;
    company_url: string;
    availability: string;
  }>("profile", "name,title,full_title,tagline,short_bio,long_bio,founding_story,location,email,phone,headshot_url,portrait_url,cv_url,company,company_url,availability");

  if (!row) return staticProfile;

  const parseArray = (v: unknown): string[] => {
    if (Array.isArray(v)) return v;
    if (typeof v === "string") {
      try { return JSON.parse(v); } catch { return [v]; }
    }
    return [];
  };

  return {
    name: row.name,
    title: row.title,
    fullTitle: row.full_title,
    tagline: row.tagline,
    shortBio: row.short_bio,
    longBio: parseArray(row.long_bio),
    foundingStory: parseArray(row.founding_story),
    location: row.location,
    email: row.email,
    phone: row.phone,
    headshotUrl: row.headshot_url,
    portraitUrl: row.portrait_url,
    cvUrl: row.cv_url,
    company: row.company,
    companyUrl: row.company_url,
    companyTagline: staticProfile.companyTagline,
    availability: row.availability,
  };
}

export async function getMetrics(): Promise<Metric[]> {
  const rows = await tryQuery<{
    label: string;
    value: number;
    suffix: string | null;
    track: "studio" | "academy";
    note: string;
  }>("metrics", "label,value,suffix,track,note,sort_order");

  if (!rows || rows.length === 0) return staticMetrics;

  return rows.map((row) => ({
    label: row.label,
    value: row.value,
    suffix: row.suffix ?? "",
    track: row.track,
    note: row.note,
  }));
}

export async function getServices(): Promise<Service[]> {
  const rows = await tryQuery<{
    title: string;
    slug: string;
    description: string;
    icon_name: string;
    features: unknown;
    track: "studio" | "academy";
  }>("services", "title,slug,description,icon_name,features,track,sort_order");

  if (!rows || rows.length === 0) return staticServices;

  return rows.map((row) => ({
    title: row.title,
    slug: row.slug,
    description: row.description,
    iconName: row.icon_name,
    features: parseArray(row.features),
    track: row.track,
  }));
}

export async function getService(slug: string): Promise<Service | null> {
  const services = await getServices();
  return services.find((s) => s.slug === slug) ?? null;
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const rows = await tryQuery<{
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
    cover_image_url: string | null;
    gallery: unknown;
    tech_used: unknown;
    live_url: string | null;
    featured: boolean;
    track: "studio" | "academy";
  }>("case_studies", "title,slug,client,category,eyebrow,year,summary,brief,solution,result,cover_image_url,gallery,tech_used,live_url,featured,track,sort_order");

  if (!rows || rows.length === 0) return staticCaseStudies;

  return rows.map((row) => ({
    title: row.title,
    slug: row.slug,
    client: row.client,
    category: row.category,
    eyebrow: row.eyebrow,
    year: row.year,
    summary: row.summary,
    brief: row.brief,
    solution: row.solution,
    result: row.result,
    coverImageUrl: row.cover_image_url,
    gallery: parseArray(row.gallery),
    techUsed: parseArray(row.tech_used),
    liveUrl: row.live_url,
    featured: row.featured,
    track: row.track,
  }));
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  const studies = await getCaseStudies();
  return studies.find((c) => c.slug === slug) ?? null;
}

export async function getFeaturedCaseStudies(): Promise<CaseStudy[]> {
  const studies = await getCaseStudies();
  return studies.filter((c) => c.featured);
}

export async function getWorkCategories(): Promise<string[]> {
  const studies = await getCaseStudies();
  return ["All", ...Array.from(new Set(studies.map((c) => c.category)))];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const rows = await tryQuery<{
    quote: string;
    author_name: string;
    author_title: string;
    author_company: string | null;
    author_photo_url: string | null;
  }>("testimonials", "quote,author_name,author_title,author_company,author_photo_url,sort_order");

  if (!rows || rows.length === 0) return staticTestimonials;

  return rows.map((row) => ({
    quote: row.quote,
    authorName: row.author_name,
    authorTitle: row.author_title,
    authorCompany: row.author_company,
    authorPhotoUrl: row.author_photo_url,
  }));
}

export async function getPosts(): Promise<Post[]> {
  const rows = await tryQuery<{
    title: string;
    slug: string;
    excerpt: string;
    body: unknown;
    tags: unknown;
    published_at: string;
    reading_minutes: number;
  }>("posts", "title,slug,excerpt,body,tags,published_at,reading_minutes,sort_order");

  if (!rows || rows.length === 0) return staticPosts;

  return rows.map((row) => ({
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    body: parseArray(row.body),
    tags: parseArray(row.tags),
    publishedAt: row.published_at,
    readingMinutes: row.reading_minutes,
  }));
}

export async function getPost(slug: string): Promise<Post | null> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getPostTags(): Promise<string[]> {
  const posts = await getPosts();
  return Array.from(new Set(posts.flatMap((p) => p.tags))).sort();
}

export async function getExperience(): Promise<Experience[]> {
  const rows = await tryQuery<{
    role: string;
    organisation: string;
    location: string;
    track: "studio" | "academy" | "community";
    start_date: string;
    end_date: string | null;
    is_current: boolean;
    description: string;
    bullets: unknown;
  }>("experience", "role,organisation,location,track,start_date,end_date,is_current,description,bullets,sort_order");

  if (!rows || rows.length === 0) return staticExperience;

  return rows.map((row) => ({
    role: row.role,
    organisation: row.organisation,
    location: row.location,
    track: row.track,
    startDate: row.start_date,
    endDate: row.end_date,
    isCurrent: row.is_current,
    description: row.description,
    bullets: parseArray(row.bullets),
  }));
}

export async function getEducation(): Promise<Education[]> {
  const rows = await tryQuery<{
    qualification: string;
    institution: string;
    start_year: string;
    end_year: string;
    is_current: boolean;
    note: string | null;
  }>("education", "qualification,institution,start_year,end_year,is_current,note,sort_order");

  if (!rows || rows.length === 0) return staticEducation;

  return rows.map((row) => ({
    qualification: row.qualification,
    institution: row.institution,
    startYear: row.start_year,
    endYear: row.end_year,
    isCurrent: row.is_current,
    note: row.note,
  }));
}

export async function getCertifications(): Promise<Certification[]> {
  const rows = await tryQuery<{
    title: string;
    issuer: string;
    year: string;
    description: string;
    credential_url: string | null;
  }>("certifications", "title,issuer,year,description,credential_url,sort_order");

  if (!rows || rows.length === 0) return staticCertifications;

  return rows.map((row) => ({
    title: row.title,
    issuer: row.issuer,
    year: row.year,
    description: row.description,
    credentialUrl: row.credential_url,
  }));
}

export async function getAwards(): Promise<Award[]> {
  const rows = await tryQuery<{
    title: string;
    issuer: string;
    year: string;
    description: string;
  }>("awards", "title,issuer,year,description,sort_order");

  if (!rows || rows.length === 0) return staticAwards;

  return rows.map((row) => ({
    title: row.title,
    issuer: row.issuer,
    year: row.year,
    description: row.description,
  }));
}

export async function getSkillGroups(): Promise<SkillGroup[]> {
  const rows = await tryQuery<{
    group: string;
    icon_name: string;
    skills: unknown;
  }>("skill_groups", "group,icon_name,skills,sort_order");

  if (!rows || rows.length === 0) return staticSkillGroups;

  return rows.map((row) => ({
    group: row.group,
    iconName: row.icon_name,
    skills: parseSkills(row.skills),
  }));
}

export async function getClients(): Promise<Client[]> {
  const rows = await tryQuery<{
    name: string;
    context: string;
    url: string | null;
  }>("clients", "name,context,url,sort_order");

  if (!rows || rows.length === 0) return staticClients;

  return rows.map((row) => ({
    name: row.name,
    context: row.context,
    url: row.url,
  }));
}

export async function getPartners(): Promise<Partner[]> {
  const rows = await tryQuery<{
    name: string;
    category: string | null;
    description: string | null;
    logo_url: string | null;
    url: string | null;
  }>("partners", "name,category,description,logo_url,url,sort_order");

  if (!rows || rows.length === 0) return staticPartners;

  return rows.map((row) => ({
    name: row.name,
    category: row.category ?? "",
    description: row.description ?? "",
    logoUrl: row.logo_url,
    url: row.url,
  }));
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const rows = await tryQuery<{
    title: string;
    category: string | null;
    image_url: string;
    caption: string | null;
  }>("gallery_items", "title,category,image_url,caption,sort_order");

  if (!rows || rows.length === 0) return staticGallery;

  return rows
    .filter((row) => Boolean(row.image_url))
    .map((row) => ({
      title: row.title,
      category: row.category ?? "Uncategorised",
      imageUrl: row.image_url,
      caption: row.caption ?? row.title,
    }));
}

export async function getSpeaking(): Promise<Speaking[]> {
  const rows = await tryQuery<{
    title: string;
    event: string;
    organiser: string;
    year: string;
    type: string;
    description: string;
    url: string | null;
  }>("speaking", "title,event,organiser,year,type,description,url,sort_order");

  if (!rows || rows.length === 0) return staticSpeaking;

  return rows.map((row) => ({
    title: row.title,
    event: row.event,
    organiser: row.organiser,
    year: row.year,
    type: row.type,
    description: row.description,
    url: row.url,
  }));
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const rows = await tryQuery<{
    platform: string;
    url: string;
    icon_name: string;
    handle: string;
  }>("social_links", "platform,url,icon_name,handle,sort_order");

  if (!rows || rows.length === 0) return staticSocialLinks;

  return rows.map((row) => ({
    platform: row.platform,
    url: row.url,
    iconName: row.icon_name,
    handle: row.handle,
  }));
}

export type SiteSettings = {
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  footerText: string | null;
  bookingUrl: string | null;
};

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const rows = await tryQuery<{
    meta_title: string | null;
    meta_description: string | null;
    og_image_url: string | null;
    footer_text: string | null;
    booking_url: string | null;
  }>(
    "site_settings",
    "meta_title,meta_description,og_image_url,footer_text,booking_url,sort_order",
  );

  const row = rows?.[0];
  if (!row) return null;

  return {
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    ogImageUrl: row.og_image_url,
    footerText: row.footer_text,
    bookingUrl: row.booking_url,
  };
}
