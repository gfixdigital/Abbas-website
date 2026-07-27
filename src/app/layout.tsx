import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";

import { profile } from "@/content";
import { absoluteUrl } from "@/lib/utils";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { Toaster } from "@/components/ui/sonner";
import { PersonJsonLd } from "@/components/shared/JsonLd";

/* Display: geometric and architectural. Body: humanist, quiet at small sizes.
   Mono carries the eyebrow labels and every number on the site. */
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbas.gfixdigital.com",
  ),
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f19" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sora.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider>
          <PersonJsonLd />
          <SiteChrome>{children}</SiteChrome>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
