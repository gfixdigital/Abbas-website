import type { MetadataRoute } from "next";
import { getCaseStudies, getPosts } from "@/lib/data";
import { allRoutes } from "@/lib/nav";
import { absoluteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [caseStudies, posts] = await Promise.all([getCaseStudies(), getPosts()]);
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = allRoutes.map((route) => ({
    url: absoluteUrl(route.href),
    lastModified: now,
    changeFrequency: route.href === "/" ? "weekly" : "monthly",
    priority: route.href === "/" ? 1 : route.href === "/projects" ? 0.9 : 0.7,
  }));

  const projectRoutes: MetadataRoute.Sitemap = caseStudies.map((study) => ({
    url: absoluteUrl(`/projects/${study.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.publishedAt),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
