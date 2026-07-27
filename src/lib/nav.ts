export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

/** Primary header links. Kept to five so the bar never wraps or crowds. */
export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Work", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

/**
 * Everything else lives in the mega menu and the footer. Grouping mirrors the
 * dual-track idea: what he builds, what he has earned, what he writes.
 * Footer columns are balanced to ~5 items each for even visual weight.
 */
export const navGroups: NavGroup[] = [
  {
    label: "Profile",
    items: [
      { label: "About", href: "/about", description: "Career story and long-form bio" },
      { label: "Leadership", href: "/leadership", description: "How he runs the studio" },
      { label: "Experience", href: "/experience", description: "Roles and career timeline" },
      { label: "Skills", href: "/skills", description: "Disciplines and tooling" },
      { label: "Résumé", href: "/resume", description: "Full CV, printable" },
    ],
  },
  {
    label: "Studio",
    items: [
      { label: "Projects", href: "/projects", description: "All case studies, filterable" },
      { label: "Case Studies", href: "/case-studies", description: "Long-form project write-ups" },
      { label: "Services", href: "/services", description: "What the studio delivers" },
      { label: "Clients", href: "/clients", description: "Who he has worked with" },
      { label: "Partners", href: "/partners", description: "Standing collaborations" },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Gallery", href: "/gallery", description: "Visual archive" },
      { label: "Awards", href: "/awards", description: "Honours and commendations" },
      { label: "Certifications", href: "/certifications", description: "Credentials and training" },
      { label: "Testimonials", href: "/testimonials", description: "Client and student words" },
      { label: "Speaking & Media", href: "/speaking", description: "Sessions, summits, partnerships" },
    ],
  },
  {
    label: "Connect",
    items: [
      { label: "Contact", href: "/contact", description: "Start a conversation" },
      { label: "Insights", href: "/insights", description: "Notes on building the studio" },
      { label: "Blog", href: "/blog", description: "All posts by tag" },
      { label: "Media Kit", href: "/media-kit", description: "Bio, headshot and brand facts" },
    ],
  },
];

export const footerLegal: NavItem[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

/** Flat list used by the command palette and the sitemap. */
export const allRoutes: NavItem[] = [
  { label: "Home", href: "/" },
  ...navGroups.flatMap((group) => group.items),
  ...footerLegal,
];
