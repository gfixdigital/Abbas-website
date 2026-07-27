/**
 * Seeds Supabase from the static content layer in src/content.
 *
 *   npm run db:seed
 *
 * Idempotent. Content tables are cleared and rewritten each run, so this is the
 * way to reset the database back to the committed content. It never touches
 * contact_messages or newsletter_subscribers, which hold real submissions.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY, because RLS blocks anonymous writes.
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

import {
  awards,
  caseStudies,
  certifications,
  clients,
  education,
  experience,
  metrics,
  partners,
  posts,
  profile,
  services,
  skillGroups,
  socialLinks,
  speaking,
  testimonials,
} from "../src/content/index";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local.",
  );
  process.exit(1);
}

const db = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

/** Tables rewritten on every seed, in an order that respects nothing because
 *  there are no foreign keys between them. */
const CONTENT_TABLES = [
  "profile",
  "metrics",
  "services",
  "case_studies",
  "testimonials",
  "experience",
  "education",
  "certifications",
  "awards",
  "skill_groups",
  "clients",
  "partners",
  "speaking",
  "posts",
  "social_links",
  "site_settings",
] as const;
// gallery_items is intentionally NOT wiped or seeded: it holds images Abbas
// uploads himself, and the gallery falls back to case study covers when empty.

/**
 * Confirms every table exists and carries the columns this script writes,
 * BEFORE anything is deleted.
 *
 * Without this, a database still on an older schema would be wiped and then
 * fail on the first insert, destroying the content it was meant to replace.
 */
async function preflight(plan: { table: string; rows: Record<string, unknown>[] }[]) {
  const problems: string[] = [];

  for (const { table, rows } of plan) {
    if (rows.length === 0) continue;
    const columns = Object.keys(rows[0]);

    const { error } = await db
      .from(table)
      .select(columns.join(","))
      .limit(0);

    if (error) problems.push(`  ${table}: ${error.message}`);
  }

  if (problems.length > 0) {
    console.error(
      "Your database schema does not match this version of the site yet.\n" +
        "Nothing has been changed. Run these first, in the Supabase SQL editor:\n" +
        "  supabase/migrations/0001_schema.sql\n" +
        "  supabase/migrations/0002_rls.sql\n\nDetails:",
    );
    console.error(problems.join("\n"));
    process.exit(1);
  }

  console.log("Schema check passed.");
}

async function wipe() {
  for (const table of CONTENT_TABLES) {
    const { error } = await db
      .from(table)
      .delete()
      .not("id", "is", null);
    if (error) throw new Error(`Clearing ${table} failed: ${error.message}`);
  }
  console.log(`Cleared ${CONTENT_TABLES.length} content tables.`);
}

async function insert(table: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  const { error } = await db.from(table).insert(rows);
  if (error) throw new Error(`Seeding ${table} failed: ${error.message}`);
  console.log(`  ${table.padEnd(16)} ${rows.length} row(s)`);
}

async function seed() {
  console.log(`Seeding ${url}\n`);

  // Build the full write plan first. Nothing touches the database until the
  // schema check below has passed.
  const plan: { table: string; rows: Record<string, unknown>[] }[] = [];
  const add = (table: string, rows: Record<string, unknown>[]) =>
    plan.push({ table, rows });

  add("profile", [
    {
      name: profile.name,
      title: profile.title,
      full_title: profile.fullTitle,
      tagline: profile.tagline,
      short_bio: profile.shortBio,
      long_bio: profile.longBio,
      founding_story: profile.foundingStory,
      location: profile.location,
      email: profile.email,
      phone: profile.phone,
      headshot_url: profile.headshotUrl,
      portrait_url: profile.portraitUrl,
      cv_url: profile.cvUrl,
      company: profile.company,
      company_url: profile.companyUrl,
      availability: profile.availability,
      published: true,
    },
  ]);

  add(
    "metrics",
    metrics.map((row, i) => ({
      label: row.label,
      value: row.value,
      suffix: row.suffix,
      track: row.track,
      note: row.note,
      published: true,
      sort_order: i,
    })),
  );

  add(
    "services",
    services.map((row, i) => ({
      title: row.title,
      slug: row.slug,
      description: row.description,
      icon_name: row.iconName,
      features: row.features,
      track: row.track,
      published: true,
      sort_order: i,
    })),
  );

  add(
    "case_studies",
    caseStudies.map((row, i) => ({
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
      cover_image_url: row.coverImageUrl,
      gallery: row.gallery,
      tech_used: row.techUsed,
      live_url: row.liveUrl,
      featured: row.featured,
      track: row.track,
      published: true,
      sort_order: i,
    })),
  );

  add(
    "testimonials",
    testimonials.map((row, i) => ({
      quote: row.quote,
      author_name: row.authorName,
      author_title: row.authorTitle,
      author_company: row.authorCompany,
      author_photo_url: row.authorPhotoUrl,
      published: true,
      sort_order: i,
    })),
  );

  add(
    "experience",
    experience.map((row, i) => ({
      organisation: row.organisation,
      role: row.role,
      start_date: row.startDate,
      end_date: row.endDate,
      is_current: row.isCurrent,
      location: row.location,
      description: row.description,
      bullets: row.bullets,
      track: row.track,
      published: true,
      sort_order: i,
    })),
  );

  add(
    "education",
    education.map((row, i) => ({
      institution: row.institution,
      qualification: row.qualification,
      start_year: row.startYear,
      end_year: row.endYear,
      is_current: row.isCurrent,
      note: row.note,
      published: true,
      sort_order: i,
    })),
  );

  add(
    "certifications",
    certifications.map((row, i) => ({
      title: row.title,
      issuer: row.issuer,
      year: row.year,
      description: row.description,
      credential_url: row.credentialUrl,
      published: true,
      sort_order: i,
    })),
  );

  add(
    "awards",
    awards.map((row, i) => ({
      title: row.title,
      issuer: row.issuer,
      year: row.year,
      description: row.description,
      published: true,
      sort_order: i,
    })),
  );

  add(
    "skill_groups",
    skillGroups.map((row, i) => ({
      group: row.group,
      icon_name: row.iconName,
      skills: row.skills,
      published: true,
      sort_order: i,
    })),
  );

  add(
    "clients",
    clients.map((row, i) => ({
      name: row.name,
      context: row.context,
      url: row.url,
      published: true,
      sort_order: i,
    })),
  );

  add(
    "partners",
    partners.map((row, i) => ({
      name: row.name,
      category: row.category,
      description: row.description,
      logo_url: row.logoUrl,
      url: row.url,
      published: true,
      sort_order: i,
    })),
  );

  add(
    "speaking",
    speaking.map((row, i) => ({
      title: row.title,
      event: row.event,
      organiser: row.organiser,
      year: row.year,
      type: row.type,
      description: row.description,
      url: row.url,
      published: true,
      sort_order: i,
    })),
  );

  add(
    "posts",
    posts.map((row, i) => ({
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      body: row.body,
      tags: row.tags,
      published_at: row.publishedAt,
      reading_minutes: row.readingMinutes,
      // Drafts stay unpublished until Abbas has approved the copy.
      published: false,
      sort_order: i,
    })),
  );

  add(
    "social_links",
    socialLinks.map((row, i) => ({
      platform: row.platform,
      url: row.url,
      icon_name: row.iconName,
      handle: row.handle,
      published: true,
      sort_order: i,
    })),
  );

  add("site_settings", [
    {
      meta_title: `${profile.name} — ${profile.title}, ${profile.company}`,
      meta_description: profile.shortBio,
      footer_text: `© ${new Date().getFullYear()} ${profile.name}. Built in Swat.`,
      booking_url: null,
      published: true,
    },
  ]);

  await preflight(plan);

  await wipe();

  console.log("\nInserting:");
  for (const { table, rows } of plan) {
    await insert(table, rows);
  }

  console.log("\nDone. Blog posts were seeded as unpublished drafts.");
}

seed().catch((error: unknown) => {
  console.error(`\nSeed failed: ${error instanceof Error ? error.message : error}`);
  process.exit(1);
});
