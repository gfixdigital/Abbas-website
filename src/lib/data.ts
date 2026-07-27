import {
  galleryItems as staticGallery,
  partners as staticPartners,
  type GalleryItem,
  type Partner,
} from "@/content";
import { createStaticSupabase } from "@/lib/supabase/static";
import { supabaseConfigured } from "@/lib/supabase/config";

/**
 * Read helpers for content that can be overridden from the CMS.
 *
 * Each one returns the static content unless Supabase is configured AND the
 * query succeeds AND it returned rows. That ordering is deliberate: a missing
 * table, an expired key or an empty table must never blank out a public page.
 * Errors are logged and swallowed rather than thrown.
 */

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
      // Expected while the migrations have not been run yet.
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
