import { z } from "zod";

/**
 * The admin panel is generated from this registry rather than hand-built per
 * table. Adding a field here adds it to the list view, the form and the
 * validation in one place.
 *
 * Every label is written for a designer, not a developer: no column names, no
 * types, no jargon.
 */

export type FieldKind =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "date"
  | "url"
  | "email"
  | "image"
  | "select"
  | "switch"
  | "taglist"
  | "paragraphs"
  | "skills";

export type FieldDef = {
  name: string;
  label: string;
  kind: FieldKind;
  help?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  /** Shown in the list view table. */
  inList?: boolean;
  /** Half-width on wide screens. */
  half?: boolean;
  optional?: boolean;
};

export type EntityDef = {
  /** URL segment under /admin. */
  key: string;
  table: string;
  /** Plural, used for headings. */
  label: string;
  /** Singular, used in buttons and dialogs. */
  singular: string;
  description: string;
  icon: string;
  /** Single-row tables render one form instead of a list. */
  singleton?: boolean;
  /** Read-only inbox behaviour. */
  inbox?: boolean;
  titleField: string;
  subtitleField?: string;
  orderable: boolean;
  fields: FieldDef[];
};

const TRACK_OPTIONS = [
  { value: "studio", label: "Studio (client work)" },
  { value: "academy", label: "Academy (training)" },
];

const TRACK_OPTIONS_WITH_COMMUNITY = [
  ...TRACK_OPTIONS,
  { value: "community", label: "Community (volunteer)" },
];

const ICON_OPTIONS = [
  { value: "Palette", label: "Palette (design)" },
  { value: "Code2", label: "Code (development)" },
  { value: "TrendingUp", label: "Trending up (marketing)" },
  { value: "Clapperboard", label: "Clapperboard (video)" },
  { value: "GraduationCap", label: "Graduation cap (training)" },
  { value: "CalendarCheck", label: "Calendar (events)" },
  { value: "Users", label: "Users (leadership)" },
  { value: "Handshake", label: "Handshake (partnership)" },
  { value: "Gem", label: "Gem (craft)" },
  { value: "Sprout", label: "Sprout (growth)" },
  { value: "Zap", label: "Lightning (momentum)" },
  { value: "Award", label: "Award" },
];

export const entities: EntityDef[] = [
  {
    key: "profile",
    table: "profile",
    label: "Profile",
    singular: "Profile",
    description: "Your name, title, biography and contact details.",
    icon: "user",
    singleton: true,
    titleField: "name",
    orderable: false,
    fields: [
      { name: "name", label: "Full name", kind: "text", half: true },
      { name: "title", label: "Short job title", kind: "text", half: true, help: "Shown under your name, for example Founder & CEO." },
      { name: "full_title", label: "Full job title", kind: "text", help: "The long version used on the about page." },
      { name: "tagline", label: "Tagline", kind: "text", help: "The one-line statement used across the site." },
      { name: "short_bio", label: "Short biography", kind: "textarea", help: "Two or three sentences. Used for search results and link previews." },
      { name: "long_bio", label: "Full biography", kind: "paragraphs", help: "One paragraph per box. Use Add paragraph for more." },
      { name: "founding_story", label: "Founding story", kind: "paragraphs", help: "Why you started GFix Digital. One paragraph per box." },
      { name: "email", label: "Email address", kind: "email", half: true },
      { name: "phone", label: "Phone number", kind: "text", half: true },
      { name: "location", label: "Location", kind: "text", half: true },
      { name: "availability", label: "Availability note", kind: "text", half: true },
      { name: "company", label: "Company name", kind: "text", half: true },
      { name: "company_url", label: "Company website", kind: "url", half: true },
      { name: "headshot_url", label: "Headshot", kind: "image", help: "Square crop works best." },
      { name: "portrait_url", label: "Portrait", kind: "image", help: "Tall crop, used on the about page." },
      { name: "cv_url", label: "CV file", kind: "image", optional: true, help: "Optional. Upload a PDF to offer a download." },
    ],
  },
  {
    key: "case-studies",
    table: "case_studies",
    label: "Projects",
    singular: "Project",
    description: "Case studies shown on the projects and case studies pages.",
    icon: "folder",
    titleField: "title",
    subtitleField: "client",
    orderable: true,
    fields: [
      { name: "title", label: "Project name", kind: "text", inList: true },
      { name: "slug", label: "Web address", kind: "text", help: "Lowercase words separated by hyphens. Changing this breaks existing links." },
      { name: "client", label: "Client", kind: "text", half: true, inList: true },
      { name: "category", label: "Category", kind: "text", half: true, inList: true, help: "Used by the filter buttons. Reuse an existing wording to group projects together." },
      { name: "eyebrow", label: "Small label above the title", kind: "text", half: true },
      { name: "year", label: "Year", kind: "text", half: true },
      { name: "track", label: "Which side of the business", kind: "select", options: TRACK_OPTIONS, half: true },
      { name: "featured", label: "Show on the homepage", kind: "switch", half: true },
      { name: "summary", label: "Summary", kind: "textarea", help: "One or two sentences. Shown on cards and in link previews." },
      { name: "brief", label: "The brief", kind: "textarea", help: "What the client needed and why." },
      { name: "solution", label: "What we did", kind: "textarea" },
      { name: "result", label: "The outcome", kind: "textarea" },
      { name: "tech_used", label: "Skills and tools used", kind: "taglist", help: "Press Enter after each one." },
      { name: "cover_image_url", label: "Cover image", kind: "image" },
      { name: "gallery", label: "More images", kind: "taglist", optional: true, help: "Paste image addresses, or upload above and paste the address here." },
      { name: "live_url", label: "Link to the live work", kind: "url", optional: true },
    ],
  },
  {
    key: "services",
    table: "services",
    label: "Services",
    singular: "Service",
    description: "What you offer, shown on the services page and homepage.",
    icon: "layers",
    titleField: "title",
    orderable: true,
    fields: [
      { name: "title", label: "Service name", kind: "text", inList: true },
      { name: "slug", label: "Web address", kind: "text" },
      { name: "description", label: "Description", kind: "textarea" },
      { name: "icon_name", label: "Icon", kind: "select", options: ICON_OPTIONS, half: true },
      { name: "track", label: "Which side of the business", kind: "select", options: TRACK_OPTIONS, half: true, inList: true },
      { name: "features", label: "What is included", kind: "taglist", help: "Press Enter after each item." },
    ],
  },
  {
    key: "experience",
    table: "experience",
    label: "Experience",
    singular: "Role",
    description: "Your career timeline.",
    icon: "briefcase",
    titleField: "role",
    subtitleField: "organisation",
    orderable: true,
    fields: [
      { name: "role", label: "Job title", kind: "text", inList: true },
      { name: "organisation", label: "Organisation", kind: "text", inList: true },
      { name: "location", label: "Location", kind: "text", half: true },
      { name: "track", label: "Which side of the business", kind: "select", options: TRACK_OPTIONS_WITH_COMMUNITY, half: true },
      { name: "start_date", label: "Start date", kind: "date", half: true },
      { name: "end_date", label: "End date", kind: "date", half: true, optional: true, help: "Leave empty if this is still current." },
      { name: "is_current", label: "This is a current role", kind: "switch" },
      { name: "description", label: "Summary", kind: "textarea" },
      { name: "bullets", label: "Key points", kind: "taglist", help: "Press Enter after each point." },
    ],
  },
  {
    key: "metrics",
    table: "metrics",
    label: "Key figures",
    singular: "Figure",
    description: "The counting numbers shown on the homepage.",
    icon: "chart",
    titleField: "label",
    orderable: true,
    fields: [
      { name: "label", label: "What it counts", kind: "text", inList: true, placeholder: "Projects delivered" },
      { name: "value", label: "The number", kind: "number", half: true, inList: true },
      { name: "suffix", label: "Symbol after it", kind: "text", half: true, placeholder: "+", optional: true },
      { name: "track", label: "Which side of the business", kind: "select", options: TRACK_OPTIONS, half: true },
      { name: "note", label: "Explanation", kind: "textarea", help: "One sentence on what the number covers." },
    ],
  },
  {
    key: "testimonials",
    table: "testimonials",
    label: "Testimonials",
    singular: "Testimonial",
    description: "Quotes from clients, students and partners.",
    icon: "quote",
    titleField: "author_name",
    subtitleField: "author_title",
    orderable: true,
    fields: [
      { name: "quote", label: "What they said", kind: "textarea", help: "Publish it as written. Do not tidy up their wording." },
      { name: "author_name", label: "Their name", kind: "text", half: true, inList: true },
      { name: "author_title", label: "Their role", kind: "text", half: true, inList: true },
      { name: "author_company", label: "Their company", kind: "text", half: true, optional: true },
      { name: "author_photo_url", label: "Their photo", kind: "image", optional: true, help: "Optional. Initials are shown if there is no photo." },
    ],
  },
  {
    key: "posts",
    table: "posts",
    label: "Writing",
    singular: "Post",
    description: "Blog and insights articles.",
    icon: "pen",
    titleField: "title",
    orderable: true,
    fields: [
      { name: "title", label: "Headline", kind: "text", inList: true },
      { name: "slug", label: "Web address", kind: "text" },
      { name: "excerpt", label: "Standfirst", kind: "textarea", help: "The bold line under the headline. Also used in link previews." },
      { name: "body", label: "Article", kind: "paragraphs", help: "One paragraph per box." },
      { name: "tags", label: "Tags", kind: "taglist", help: "Press Enter after each tag." },
      { name: "published_at", label: "Date", kind: "date", half: true, inList: true },
      { name: "reading_minutes", label: "Reading time in minutes", kind: "number", half: true },
      { name: "cover_image_url", label: "Cover image", kind: "image", optional: true },
    ],
  },
  {
    key: "skills",
    table: "skill_groups",
    label: "Skills",
    singular: "Skill group",
    description: "Skill groups and the bars shown on the skills page.",
    icon: "sliders",
    titleField: "group",
    orderable: true,
    fields: [
      { name: "group", label: "Group name", kind: "text", inList: true },
      { name: "icon_name", label: "Icon", kind: "select", options: ICON_OPTIONS, half: true },
      { name: "skills", label: "Skills in this group", kind: "skills", help: "Add a skill and set how strong it is from 0 to 100." },
    ],
  },
  {
    key: "awards",
    table: "awards",
    label: "Awards",
    singular: "Award",
    description: "Honours and commendations.",
    icon: "award",
    titleField: "title",
    subtitleField: "issuer",
    orderable: true,
    fields: [
      { name: "title", label: "Award name", kind: "text", inList: true },
      { name: "issuer", label: "Awarded by", kind: "text", half: true, inList: true },
      { name: "year", label: "Year", kind: "text", half: true },
      { name: "description", label: "What it was for", kind: "textarea" },
      { name: "certificate_url", label: "Certificate image", kind: "image", optional: true },
    ],
  },
  {
    key: "certifications",
    table: "certifications",
    label: "Certifications",
    singular: "Certification",
    description: "Credentials and completed training.",
    icon: "badge",
    titleField: "title",
    subtitleField: "issuer",
    orderable: true,
    fields: [
      { name: "title", label: "Certification name", kind: "text", inList: true },
      { name: "issuer", label: "Issued by", kind: "text", half: true, inList: true },
      { name: "year", label: "Year", kind: "text", half: true },
      { name: "description", label: "What it covered", kind: "textarea" },
      { name: "credential_url", label: "Link to the issuing body", kind: "url", optional: true },
    ],
  },
  {
    key: "education",
    table: "education",
    label: "Education",
    singular: "Qualification",
    description: "Degrees and diplomas.",
    icon: "school",
    titleField: "qualification",
    subtitleField: "institution",
    orderable: true,
    fields: [
      { name: "qualification", label: "Qualification", kind: "text", inList: true },
      { name: "institution", label: "Institution", kind: "text", inList: true },
      { name: "start_year", label: "Started", kind: "text", half: true },
      { name: "end_year", label: "Finished", kind: "text", half: true, help: "Write Present if you are still studying." },
      { name: "is_current", label: "Still studying", kind: "switch" },
      { name: "note", label: "Note", kind: "textarea", optional: true },
    ],
  },
  {
    key: "clients",
    table: "clients",
    label: "Clients",
    singular: "Client",
    description: "Organisations shown on the clients page and homepage marquee.",
    icon: "building",
    titleField: "name",
    subtitleField: "context",
    orderable: true,
    fields: [
      { name: "name", label: "Client name", kind: "text", inList: true },
      { name: "context", label: "What they do", kind: "text", inList: true },
      { name: "url", label: "Their website", kind: "url", optional: true },
      { name: "logo_url", label: "Their logo", kind: "image", optional: true },
    ],
  },
  {
    key: "partners",
    table: "partners",
    label: "Partners",
    singular: "Partner",
    description: "Standing collaborations shown on the partners page.",
    icon: "handshake",
    titleField: "name",
    subtitleField: "category",
    orderable: true,
    fields: [
      { name: "name", label: "Partner name", kind: "text", inList: true },
      { name: "category", label: "Kind of partner", kind: "text", half: true, inList: true, placeholder: "Education" },
      { name: "url", label: "Their website or page", kind: "url", half: true, optional: true },
      { name: "description", label: "What the partnership covers", kind: "textarea" },
      { name: "logo_url", label: "Their logo", kind: "image", optional: true, help: "Any shape. It is fitted inside a box rather than cropped." },
    ],
  },
  {
    key: "gallery",
    table: "gallery_items",
    label: "Gallery",
    singular: "Image",
    description:
      "Images on the gallery page. While this is empty, project cover images are shown instead.",
    icon: "image",
    titleField: "title",
    subtitleField: "category",
    orderable: true,
    fields: [
      { name: "title", label: "Title", kind: "text", inList: true },
      { name: "category", label: "Category", kind: "text", half: true, inList: true, help: "Used by the filter buttons. Reuse a wording to group images." },
      { name: "caption", label: "Caption", kind: "text", help: "Shown on hover, and used as the image description for screen readers." },
      { name: "image_url", label: "Image", kind: "image" },
    ],
  },
  {
    key: "speaking",
    table: "speaking",
    label: "Speaking",
    singular: "Engagement",
    description: "Sessions, summits and media partnerships.",
    icon: "mic",
    titleField: "title",
    subtitleField: "organiser",
    orderable: true,
    fields: [
      { name: "title", label: "Session title", kind: "text", inList: true },
      { name: "event", label: "Event name", kind: "text", half: true },
      { name: "organiser", label: "Organised by", kind: "text", half: true, inList: true },
      { name: "year", label: "Year", kind: "text", half: true },
      { name: "type", label: "Kind of engagement", kind: "text", half: true, placeholder: "Workshop" },
      { name: "description", label: "Description", kind: "textarea" },
      { name: "url", label: "Link", kind: "url", optional: true },
    ],
  },
  {
    key: "social-links",
    table: "social_links",
    label: "Social links",
    singular: "Social link",
    description: "Profiles listed in the footer and on the contact page.",
    icon: "share",
    titleField: "platform",
    subtitleField: "handle",
    orderable: true,
    fields: [
      { name: "platform", label: "Platform", kind: "text", half: true, inList: true },
      { name: "handle", label: "Your handle", kind: "text", half: true, inList: true },
      { name: "url", label: "Full address", kind: "url" },
      {
        name: "icon_name",
        label: "Icon",
        kind: "select",
        options: [
          { value: "Linkedin", label: "LinkedIn" },
          { value: "Facebook", label: "Facebook" },
          { value: "Instagram", label: "Instagram" },
          { value: "Twitter", label: "X" },
          { value: "Music2", label: "TikTok" },
          { value: "MessageCircle", label: "WhatsApp" },
          { value: "Image", label: "Pinterest" },
        ],
      },
    ],
  },
  {
    key: "messages",
    table: "contact_messages",
    label: "Inbox",
    singular: "Message",
    description: "Enquiries submitted through the contact form.",
    icon: "inbox",
    inbox: true,
    titleField: "name",
    subtitleField: "email",
    orderable: false,
    fields: [
      { name: "name", label: "From", kind: "text", inList: true },
      { name: "email", label: "Email", kind: "email", inList: true },
      { name: "subject", label: "Subject", kind: "text", inList: true },
      { name: "message", label: "Message", kind: "textarea" },
    ],
  },
  {
    key: "settings",
    table: "site_settings",
    label: "Site settings",
    singular: "Site settings",
    description: "Search engine title, description and footer text.",
    icon: "settings",
    singleton: true,
    titleField: "meta_title",
    orderable: false,
    fields: [
      { name: "meta_title", label: "Title shown in search results", kind: "text" },
      { name: "meta_description", label: "Description shown in search results", kind: "textarea", help: "Aim for 150 to 160 characters." },
      { name: "og_image_url", label: "Link preview image", kind: "image", optional: true, help: "Optional. Leave empty to use the automatic one." },
      { name: "footer_text", label: "Footer text", kind: "text" },
      {
        name: "booking_url",
        label: "Scheduling link",
        kind: "url",
        optional: true,
        help: "Optional. Paste a Cal.com or Calendly link and the contact page will show a Book a call button. Leave empty to use WhatsApp and email instead.",
      },
    ],
  },
];

export function getEntity(key: string) {
  return entities.find((entity) => entity.key === key) ?? null;
}

/** Builds a Zod schema from a field list, so validation follows the registry. */
export function schemaFor(entity: EntityDef) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of entity.fields) {
    let rule: z.ZodTypeAny;

    switch (field.kind) {
      case "number":
        rule = z.coerce.number({ invalid_type_error: "Enter a number." });
        break;
      case "switch":
        rule = z.boolean();
        break;
      case "email":
        rule = field.optional
          ? z.union([z.string().email("Enter a valid email address."), z.literal("")])
          : z.string().email("Enter a valid email address.");
        break;
      case "url":
        rule = z.union([z.string().url("Enter a full web address including https://"), z.literal("")]);
        break;
      case "taglist":
      case "paragraphs":
        rule = z.array(z.string());
        break;
      case "skills":
        rule = z.array(
          z.object({
            name: z.string().min(1, "Give the skill a name."),
            level: z.coerce.number().min(0).max(100),
          }),
        );
        break;
      case "date":
        rule = field.optional
          ? z.union([z.string(), z.literal("")])
          : z.string().min(1, "Choose a date.");
        break;
      default:
        rule = field.optional
          ? z.string()
          : z.string().min(1, `${field.label} cannot be empty.`);
    }

    shape[field.name] = field.optional ? rule.optional().nullable() : rule;
  }

  shape.published = z.boolean().optional();

  return z.object(shape);
}
