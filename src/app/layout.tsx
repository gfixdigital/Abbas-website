import type { Metadata, Viewport } from "next";
import { Montserrat, Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { absoluteUrl } from "@/lib/utils";
import { getProfile, getEducation, getSkillGroups, getSocialLinks, getSiteSettings, getCaseStudies } from "@/lib/data";
import { SiteProvider } from "@/lib/site-context";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { Toaster } from "@/components/ui/sonner";
import { PersonJsonLd } from "@/components/shared/JsonLd";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["400", "600"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500"],
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbas.gfixdigital.com";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: `${profile.name} — ${profile.title}, ${profile.company}`,
      template: `%s — ${profile.name}`,
    },
    description: profile.shortBio,
    applicationName: `${profile.name} Portfolio`,
    authors: [{ name: profile.name, url: absoluteUrl("/") }],
    creator: profile.name,
    keywords: [
      "Muhammad Abbas",
      "GFix Digital",
      "digital agency Pakistan",
      "IT training Swat",
      "graphic design Swat",
      "web development Pakistan",
      "digital marketing Swat",
      "ICT trainer",
    ],
    openGraph: {
      type: "profile",
      locale: "en_GB",
      url: absoluteUrl("/"),
      siteName: `${profile.name} — ${profile.title}`,
      title: `${profile.name} — ${profile.title}, ${profile.company}`,
      description: profile.shortBio,
      images: [
        {
          url: "/api/og",
          width: 1200,
          height: 630,
          alt: `${profile.name}, ${profile.title} at ${profile.company}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@GFixDigital",
      title: `${profile.name} — ${profile.title}, ${profile.company}`,
      description: profile.shortBio,
      images: ["/api/og"],
    },
    alternates: {
      canonical: absoluteUrl("/"),
      types: { "application/rss+xml": absoluteUrl("/rss.xml") },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    category: "technology",
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [profile, education, skillGroups, socialLinks, settings] = await Promise.all([
    getProfile(),
    getEducation(),
    getSkillGroups(),
    getSocialLinks(),
    getSiteSettings(),
  ]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${poppins.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <SiteProvider value={{ profile, settings }}>
          <ThemeProvider>
            <PersonJsonLd
              profile={profile}
              education={education}
              skillGroups={skillGroups}
              socialLinks={socialLinks}
            />
            <SiteChrome>{children}</SiteChrome>
            <Toaster />
          </ThemeProvider>
        </SiteProvider>
      </body>
    </html>
  );
}
