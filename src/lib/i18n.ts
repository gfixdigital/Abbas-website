/**
 * Multi-language readiness.
 *
 * The site ships in English only. This module exists so a second language can
 * be added without restructuring: all UI chrome strings live here rather than
 * being hardcoded in components, and the locale metadata needed for routing,
 * `hreflang` and text direction is already declared.
 *
 * To actually add a locale:
 *   1. Add it to LOCALES below with its dictionary.
 *   2. Wrap the public routes in an `app/[locale]/` segment.
 *   3. Read the locale in the root layout and set <html lang dir>.
 *   4. Add `alternates.languages` to the metadata in each route.
 *
 * Body content (projects, posts, bio) is CMS-driven, so translating it means
 * adding a `locale` column to the content tables rather than editing code.
 * Deliberately not done yet: Abbas publishes in English, and shipping an empty
 * Urdu or Pashto site would be worse than shipping one language well.
 */

export const DEFAULT_LOCALE = "en" as const;

export type Locale = "en" | "ur" | "ps";

export type LocaleMeta = {
  code: Locale;
  /** BCP 47 tag for the lang attribute and hreflang. */
  tag: string;
  label: string;
  /** Endonym, for a language switcher. */
  nativeLabel: string;
  dir: "ltr" | "rtl";
  enabled: boolean;
};

/**
 * Urdu and Pashto are declared but disabled. Both are right-to-left, which the
 * layout would need auditing for before enabling: the numbered section rail,
 * the timeline rails and the marquee all assume left-to-right flow.
 */
export const LOCALES: Record<Locale, LocaleMeta> = {
  en: {
    code: "en",
    tag: "en-GB",
    label: "English",
    nativeLabel: "English",
    dir: "ltr",
    enabled: true,
  },
  ur: {
    code: "ur",
    tag: "ur-PK",
    label: "Urdu",
    nativeLabel: "اردو",
    dir: "rtl",
    enabled: false,
  },
  ps: {
    code: "ps",
    tag: "ps-PK",
    label: "Pashto",
    nativeLabel: "پښتو",
    dir: "rtl",
    enabled: false,
  },
};

export const enabledLocales = Object.values(LOCALES).filter((l) => l.enabled);

export function isRtl(locale: Locale) {
  return LOCALES[locale]?.dir === "rtl";
}

/** UI chrome strings. Body content comes from the CMS, not from here. */
const en = {
  nav: {
    skipToContent: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    search: "Search this site",
    more: "More",
    startProject: "Start a project",
    home: "Home",
  },
  actions: {
    readMore: "Read more",
    viewAll: "View all",
    allProjects: "All projects",
    getInTouch: "Get in touch",
    backToTop: "Back to top",
    copy: "Copy",
    copied: "Copied",
    download: "Download",
    send: "Send message",
    sending: "Sending",
  },
  contact: {
    responseTime: "Within two working days",
    privacyNote:
      "Your details are used only to reply. Nothing is shared or added to a mailing list.",
    successTitle: "Message sent.",
  },
  errors: {
    notFoundTitle: "That page does not exist.",
    genericForm: "Please check the highlighted fields.",
    network: "Network problem. Try again in a moment.",
  },
  meta: {
    readingTime: "min read",
    published: "Published",
  },
} as const;

export type Dictionary = typeof en;

/** Add further dictionaries here as locales are enabled. */
const DICTIONARIES: Partial<Record<Locale, Dictionary>> = { en };

export function getDictionary(locale: Locale = DEFAULT_LOCALE): Dictionary {
  return DICTIONARIES[locale] ?? en;
}

/**
 * hreflang map for metadata.alternates.languages. Returns only enabled
 * locales, so it stays correct as languages are switched on.
 */
export function languageAlternates(path = "/") {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbas.gfixdigital.com";

  return Object.fromEntries(
    enabledLocales.map((locale) => [
      locale.tag,
      new URL(
        locale.code === DEFAULT_LOCALE ? path : `/${locale.code}${path}`,
        base,
      ).toString(),
    ]),
  );
}
