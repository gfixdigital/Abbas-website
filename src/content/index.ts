export * from "./types";
export * from "./profile";
export * from "./work";
export * from "./posts";

import { caseStudies, services, testimonials } from "./work";
import { posts } from "./posts";
import type { GalleryItem } from "./types";

export const workCategories = [
  "All",
  ...Array.from(new Set(caseStudies.map((c) => c.category))),
];

export const featuredCaseStudies = caseStudies.filter((c) => c.featured);

export const postTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort();

/**
 * Default gallery, derived from case study covers.
 *
 * Once Abbas uploads images under Gallery in /admin, those rows take over.
 * Deriving the default means the gallery is never empty on a fresh install.
 */
export const galleryItems: GalleryItem[] = caseStudies
  .filter((study) => study.coverImageUrl)
  .map((study) => ({
    title: study.title,
    category: study.category,
    imageUrl: study.coverImageUrl as string,
    caption: `${study.category} for ${study.client}`,
  }));

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug) ?? null;
}

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug) ?? null;
}

export function getService(slug: string) {
  return services.find((s) => s.slug === slug) ?? null;
}

export { caseStudies, services, testimonials, posts };
