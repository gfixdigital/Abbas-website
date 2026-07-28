import { absoluteUrl } from "@/lib/utils";
import type { Profile, Education, SkillGroup, SocialLink, CaseStudy } from "@/content";

function Script({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function PersonJsonLd({
  profile,
  education,
  skillGroups,
  socialLinks,
}: {
  profile: Profile;
  education: Education[];
  skillGroups: SkillGroup[];
  socialLinks: SocialLink[];
}) {
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

export function OrganizationJsonLd({
  profile,
  socialLinks,
}: {
  profile: Profile;
  socialLinks: SocialLink[];
}) {
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

export function WebsiteJsonLd({ profile }: { profile: Profile }) {
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

export function CaseStudyJsonLd({
  caseStudy,
}: {
  caseStudy: CaseStudy;
}) {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: caseStudy.title,
        headline: caseStudy.title,
        description: caseStudy.summary,
        url: absoluteUrl(`/projects/${caseStudy.slug}`),
        image: caseStudy.coverImageUrl ?? undefined,
        dateCreated: caseStudy.year,
        creator: { "@id": absoluteUrl("/#person") },
        about: caseStudy.category,
        keywords: caseStudy.techUsed.join(", "),
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
