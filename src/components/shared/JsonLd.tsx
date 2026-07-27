import { caseStudies, education, profile, skillGroups } from "@/content";
import { absoluteUrl } from "@/lib/utils";
import { socialLinks } from "@/content";

function Script({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is server-rendered from local content only, never
      // from user input, so this is safe.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function PersonJsonLd() {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": absoluteUrl("/#person"),
        name: profile.name,
        jobTitle: profile.title,
        description: profile.shortBio,
        url: absoluteUrl("/"),
        image: profile.portraitUrl,
        email: `mailto:${profile.email}`,
        telephone: profile.phone,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Mingora",
          addressRegion: "Khyber Pakhtunkhwa",
          addressCountry: "PK",
        },
        worksFor: {
          "@type": "Organization",
          name: profile.company,
          url: profile.companyUrl,
        },
        alumniOf: education.map((item) => ({
          "@type": "EducationalOrganization",
          name: item.institution,
        })),
        knowsAbout: skillGroups.flatMap((group) =>
          group.skills.map((skill) => skill.name),
        ),
        sameAs: socialLinks.map((social) => social.url),
      }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${profile.companyUrl}/#organization`,
        name: profile.company,
        alternateName: profile.companyTagline,
        url: profile.companyUrl,
        description:
          "Digital solutions agency and IT training hub delivering graphic design, web development, digital marketing, video production and ICT training.",
        founder: { "@id": absoluteUrl("/#person") },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Mingora",
          addressRegion: "Khyber Pakhtunkhwa",
          addressCountry: "PK",
        },
        contactPoint: {
          "@type": "ContactPoint",
          email: profile.email,
          telephone: profile.phone,
          contactType: "sales",
        },
        sameAs: socialLinks.map((social) => social.url),
      }}
    />
  );
}

export function WebsiteJsonLd() {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        url: absoluteUrl("/"),
        name: `${profile.name} — ${profile.title}`,
        publisher: { "@id": absoluteUrl("/#person") },
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; href: string }[];
}) {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: absoluteUrl(item.href),
        })),
      }}
    />
  );
}

export function CaseStudyJsonLd({ slug }: { slug: string }) {
  const study = caseStudies.find((item) => item.slug === slug);
  if (!study) return null;

  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: study.title,
        headline: study.title,
        description: study.summary,
        url: absoluteUrl(`/projects/${study.slug}`),
        image: study.coverImageUrl ?? undefined,
        dateCreated: study.year,
        creator: { "@id": absoluteUrl("/#person") },
        about: study.category,
        keywords: study.techUsed.join(", "),
      }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  slug,
  publishedAt,
  tags,
}: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  tags: string[];
}) {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description,
        url: absoluteUrl(`/blog/${slug}`),
        datePublished: publishedAt,
        dateModified: publishedAt,
        author: { "@id": absoluteUrl("/#person") },
        publisher: { "@id": absoluteUrl("/#person") },
        keywords: tags.join(", "),
        mainEntityOfPage: absoluteUrl(`/blog/${slug}`),
      }}
    />
  );
}
