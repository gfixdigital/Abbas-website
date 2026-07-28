import { getPosts, getProfile } from "@/lib/data";
import { absoluteUrl } from "@/lib/utils";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const [posts, profile] = await Promise.all([getPosts(), getProfile()]);
  const items = posts
    .map((post) =>
      [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${absoluteUrl(`/blog/${post.slug}`)}</link>`,
        `      <guid isPermaLink="true">${absoluteUrl(`/blog/${post.slug}`)}</guid>`,
        `      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>`,
        `      <description>${escapeXml(post.excerpt)}</description>`,
        ...post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
        "    </item>",
      ].join("\n"),
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${profile.name} — Insights`)}</title>
    <link>${absoluteUrl("/insights")}</link>
    <description>${escapeXml("Notes on running a digital studio and training programme in Swat, Pakistan.")}</description>
    <language>en-GB</language>
    <managingEditor>${profile.email} (${escapeXml(profile.name)})</managingEditor>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
