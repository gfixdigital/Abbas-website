# abbas.gfixdigital.com

Executive portfolio for **Muhammad Abbas**, Founder & CEO of [GFix Digital](https://gfixdigital.com), with a Supabase-backed CMS at `/admin`.

Next.js 15 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Radix · Framer Motion · Supabase · Resend 555

---

## Contents

- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Database setup](#database-setup)
- [Deployment](#deployment)
- [Architecture](#architecture)
- [Design system](#design-system)
- [Editing your site — a guide for Abbas](#editing-your-site--a-guide-for-abbas)
- [Content that still needs your approval](#content-that-still-needs-your-approval)
- [Security notes](#security-notes)

---

## Quick start

```bash
npm install
```

Copy the environment template and fill it in:

```bash
cp .env.example .env.local
```

Then:

```bash
npm run dev
```

The site runs at http://localhost:3000.

**The site works without Supabase.** Every page renders from the typed content in `src/content/`, so you get a complete working site with no database. Supabase adds the `/admin` editor on top.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm run db:migrate` | Apply `supabase/migrations` over a direct Postgres connection |
| `npm run db:seed` | Load `src/content/` into Supabase |
| `npm run db:setup` | Migrate, then seed |

> If the dev server ever throws `Cannot find module './xxx.js'`, a production build has overwritten the dev `.next` directory. Stop the server, delete `.next`, and restart.

---

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical origin. Drives sitemap, OG tags and JSON-LD. |
| `NEXT_PUBLIC_SUPABASE_URL` | For `/admin` | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For `/admin` | Public key. Safe in the browser; RLS constrains it. |
| `SUPABASE_SERVICE_ROLE_KEY` | For form storage | Bypasses RLS. **Server only, never expose.** |
| `SUPABASE_DB_PASSWORD` | For `db:migrate` only | Database password. Not read at runtime. |
| `SUPABASE_DB_REGION` | For `db:migrate` only | Pooler region, e.g. `ap-southeast-1`. Needed where IPv6 is unavailable. |
| `SUPABASE_DB_URL` | Optional | Full Postgres URI. Overrides the two above. |
| `RESEND_API_KEY` | For contact email | Resend API key. |
| `RESEND_FROM_EMAIL` | For contact email | Must be a verified Resend domain. |
| `CONTACT_TO_EMAIL` | No | Where enquiries go. Defaults to `abbas@gfixdigital.com`. |

Missing variables degrade gracefully rather than crashing: no Supabase means `/admin` redirects home and the public site uses its built-in content; no Resend means enquiries still save to the database.

---

## Database setup

### 1. Run the migrations

Add the database password to `.env.local`:

```
SUPABASE_DB_PASSWORD=your-database-password
SUPABASE_DB_REGION=ap-southeast-1
```

Supplying the password separately rather than as a full URI is deliberate. Passwords routinely contain `@`, `:` or `/`, which terminate the userinfo section of a connection URI early and produce a misleading "host not found" rather than an obvious parse error. The script percent-encodes it for you.

`SUPABASE_DB_REGION` routes through the IPv4 connection pooler in session mode. It is needed because `db.<ref>.supabase.co` is IPv6-only on this project and does not resolve from most networks. Find the region under **Project Settings → Database**, or in the pooler hostname (`aws-0-<region>.pooler.supabase.com`). Omit it to attempt a direct connection instead.

A full `SUPABASE_DB_URL` also works and takes precedence if you prefer to paste one.

Then:

```bash
npm run db:migrate
```

This applies every file in `supabase/migrations` in order, **each inside its own transaction**, and prints the resulting table list and policy count so the outcome is verifiable.

The transaction matters. `0002_rls.sql` drops every existing policy before recreating them; pasted into the SQL editor, a mid-file error would leave the tables with RLS enabled and no policies at all, silently breaking all reads. Here a failure rolls back cleanly.

`SUPABASE_DB_URL` is only used by this script. It is never read at runtime and never reaches the browser.

> **Alternative:** if you would rather not put the password on disk, paste `0001_schema.sql` then `0002_rls.sql` into the Supabase SQL Editor by hand. Both files are idempotent and safe to re-run either way.

`0001` creates every table and, for a database created by an earlier version of this site, adds the columns introduced since. `0002` enables Row Level Security and creates the storage bucket.

> **`0002` deliberately drops every pre-existing policy** on the tables it manages before creating its own. Permissive policies are additive in Postgres, so a leftover policy from an older schema would keep granting access this file is meant to remove. If you have hand-written policies on these tables, review the file before running it.

### 2. Load the content

```bash
npm run db:seed
```

This reads `src/content/` and writes it to the database. It clears and rewrites the content tables, so it is also how you reset to the committed content. It never touches `contact_messages` or `newsletter_subscribers`.

Blog posts are seeded **unpublished**, because the drafts need approval first.

### 3. Create your login

Supabase dashboard → **Authentication** → **Users** → **Add user** → **Create new user**. Use your email and a strong password, and tick *Auto Confirm User*.

Then sign in at `/admin/login`.

Leave sign-ups disabled (**Authentication → Providers → Email → Allow new users to sign up: off**) so `/admin` stays a single-account area.

### Security model

| Table | Public (anon) | Signed-in admin |
|---|---|---|
| Content tables | `SELECT` where `published = true` | Full read/write |
| `contact_messages` | `INSERT` only | Full read/write |
| `newsletter_subscribers` | `INSERT` only, no read | Read and delete |
| Storage bucket `media` | Read | Read/write |

---

## Deployment

Built for Vercel.

1. Push the repository to GitHub.
2. Import it in Vercel. The framework is detected automatically.
3. Add every variable from the table above under **Settings → Environment Variables**. Set `NEXT_PUBLIC_SITE_URL` to `https://abbas.gfixdigital.com`.
4. Deploy.
5. **Settings → Domains** → add `abbas.gfixdigital.com`, then add the `CNAME` Vercel gives you to the `gfixdigital.com` DNS zone.
6. In Supabase → **Authentication → URL Configuration**, add `https://abbas.gfixdigital.com` as a redirect URL so admin login works in production.

### Post-deploy checks

- `/sitemap.xml` and `/robots.txt` show the production domain, not localhost.
- `/api/og` renders a share card.
- Submit the contact form and confirm both the email and the `/admin` inbox entry.
- Sign in at `/admin`, change something, and confirm it appears on the public page.

---

## Architecture

```
src/
├── app/
│   ├── (public routes)      home, about, leadership, experience, projects,
│   │                        case-studies, services, skills, awards,
│   │                        certifications, testimonials, clients, partners,
│   │                        speaking, media-kit, gallery, blog, insights,
│   │                        resume, contact, privacy, terms, 404
│   ├── admin/               auth-protected CMS
│   │   ├── actions.ts       every mutation, session-checked
│   │   ├── insights/        content and enquiry analytics
│   │   ├── login/
│   │   └── [entity]/        one route serving all content types
│   ├── api/
│   │   ├── og/              dynamic Open Graph images
│   │   └── newsletter/
│   ├── rss.xml/
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── motion/              Reveal, Spotlight, Backdrop, Interactions,
│   │                        Transitions — the animation primitives
│   ├── ui/                  shadcn/ui primitives
│   ├── layout/              Navbar, Footer, CommandPalette, theme
│   ├── admin/               CMS: EntityManager, FieldRenderer, ImageUpload
│   ├── home/  work/  blog/  gallery/  contact/  shared/
├── content/                 typed content: the single source of truth
├── lib/
│   ├── admin/entities.ts    the CMS registry
│   ├── data.ts              CMS reads with static fallback
│   ├── i18n.ts              locale config and UI dictionary
│   ├── supabase/            browser, server, static and service-role clients
│   ├── motion.ts  nav.ts  utils.ts  validation.ts
├── middleware.ts            admin route protection
└── supabase/migrations/     schema + RLS
```

### Two decisions worth knowing

**Content lives in TypeScript, not only in the database.** `src/content/` holds every fact about Abbas as typed data. It is both the seed for Supabase and a working fallback, which is why the site builds and renders on a clean checkout with no environment file. Nothing in there is invented: every value traces to the CV or to gfixdigital.com.

**Public pages read Supabase without cookies.** `lib/data.ts` uses a cookie-free client (`lib/supabase/static.ts`) so pages stay statically generated. The cookie-based server client carries the admin session, and any page touching it is forced dynamic — which silently cost `/partners`, `/gallery` and `/contact` their static generation until this was split out. Freshness comes from `revalidatePath` in the admin actions instead.

**The admin panel is generated, not hand-written.** `src/lib/admin/entities.ts` describes each content type as a list of fields. From that one registry the CMS derives its list views, forms, validation and Zod schemas. Adding a field is one entry in one file, not edits across five. Every label in it is written for a designer rather than a developer, which is why the UI never shows a database column name.

### Accessibility and motion

- Verified at 320px with no horizontal page overflow.
- Single `h1` per page, no skipped heading levels, alt text on every image, every control labelled, skip link to `#main`.
- Contrast measured: light mode 18.55:1 body, 6.26:1 muted, 5.17:1 on brand buttons. Dark mode 17.71:1 and 7.57:1. All above WCAG AA.
- `prefers-reduced-motion` is respected twice over: a global CSS stop, and every Framer Motion variant gated through `useReducedMotion`. Counters render their final value immediately, the marquee stops, cursor and spotlight effects do not mount, and the loading screen is skipped.
- Pointer effects also check `(hover: hover) and (pointer: fine)`, so they never run on touch devices.

---

## Design system

Brand values are lifted verbatim from `gfixdigital.com`'s CSS custom properties so the two sites read as one family.

| Token | Value | Role |
|---|---|---|
| `--brand-blue` | `#2563eb` | GFix primary |
| `--brand-navy` | `#1e3a8a` | GFix deep |
| `--brand-sky` | `#3b82f6` | GFix highlight |
| `--accent` | `#f59e0b` | **Personal layer.** Amber, used sparingly |
| `--ink` / `--muted` | `#11131a` / `#5b6071` | Text |
| `--bg` / `--bg-soft` / `--line` | `#ffffff` / `#f7f8fb` / `#ececf1` | Surfaces |

GFix is monochrome blue. The amber accent is what gives Abbas's site its own centre of gravity while staying in family, and it is reserved for awards, primary CTAs and active states.

**Type:** GFix uses Montserrat and Poppins. This site keeps that geometric direction but modernises it — **Sora** for display, **DM Sans** for body, **JetBrains Mono** for eyebrow labels and every number. All self-hosted via `next/font`.

**Signature element — the dual track.** Abbas runs two things at once: a studio that ships client work, and an academy that trains people. Rather than saying that in copy, the layout encodes it: split live counters in the hero, colour-coded rails in the career timeline, and a studio/academy split running through services and metrics. The Swiss numbered section rail down the left edge carries across every page.

---

## Editing your site — a guide for Abbas

Everything on the site can be changed at **abbas.gfixdigital.com/admin** without touching code.

### Signing in

Go to `/admin` and enter your email and password. If you have forgotten the password, reset it from the Supabase dashboard under Authentication, or ask whoever set this up.

### Making a change

1. Pick a section from the menu on the left.
2. Press **Edit** on the item you want to change, or **Add** for a new one.
3. Change what you need and press **Save changes**.

The live site updates immediately. There is no separate publish step.

### Things worth knowing

**The Visible switch is safer than deleting.** Every item has one. Turn it off and the item disappears from the public site but stays in your editor, so you can bring it back later. Deleting is permanent.

**Drag the handle to reorder.** The grip on the left of each row sets the order things appear in on the site. Drag it and the new order saves automatically.

**Web addresses matter.** Projects and posts have a "Web address" field, the short lowercase name that appears in the link. Changing it breaks any existing link to that page, so avoid changing it after something has been shared.

**Adding images.** Press *Choose a file from your computer* to upload, or paste a web address if the image already lives somewhere online. Images under 5 MB work best. Compress large photos first, since big images slow the site down.

**Fields with a red star are required.** The form tells you what is missing rather than failing silently.

**Paragraph boxes.** Long text like your biography is split into one box per paragraph. Use *Add paragraph* for another, the arrows to reorder, and the bin to remove one.

**Tag fields.** Type an item and press Enter. Repeat. Press the small × on any tag to remove it.

### Gallery, partners and the booking link

**Gallery** starts empty and the page shows your project cover images instead. As soon as you upload anything under Gallery, your uploads take over completely. So it is never blank, and you are never stuck with the defaults.

**Partners** is separate from Clients on purpose. Clients commissioned work; partners are standing collaborations.

**Booking link.** Under *Site settings* there is a "Scheduling link" field. Paste a Cal.com or Calendly link and the contact page grows a "See available times" button. Leave it empty and it offers WhatsApp and email instead, which is how you book calls now.

### Insights

**Insights** in the sidebar shows how much content you have, what is currently hidden from the site, and how many enquiries arrived each week for the last twelve weeks. It flags empty sections and hidden items so nothing goes stale by accident.

These are content figures, not visitor numbers. For website traffic, enable Vercel Analytics on the project.

### Your inbox

Contact form enquiries appear under **Inbox**, and you also get an email for each one. Opening a message marks it as read. **Reply by email** opens your mail app with the address filled in.

### Recovering the original content

If something gets muddled, whoever maintains the site can run `npm run db:seed` to reset everything back to the content it launched with. Your inbox messages and newsletter subscribers are never touched by this.

---

## Multi-language

The site ships in English only. `src/lib/i18n.ts` holds the locale table, text direction, `hreflang` helper and all UI chrome strings, so a second language can be added without restructuring components. Urdu and Pashto are declared but disabled.

They are disabled deliberately rather than half-built: both are right-to-left, and the numbered section rail, the timeline rails and the marquee all assume left-to-right flow. Enabling either means auditing those three, wrapping the public routes in an `app/[locale]/` segment, and adding a `locale` column to the content tables. Shipping an empty Urdu site would be worse than shipping one language well.

---

## Content that still needs your approval

The site is complete and launch-ready, but the following was written from the CV and the GFix Digital website rather than dictated by Abbas. **It publishes under his name, so it should be read before launch.**

### Needs a factual check

- **Founding date.** The site says GFix Digital was founded on **1 April 2021**. Confirm the year.
- **MEPA and BanoQabil start dates** are estimates (2023 and 2024). Correct them under *Experience*.
- **MP Network** is shown as running since 2019. Confirm.
- **Skill percentages** on `/skills` are an assessment made from the CV, not a self-rating. Adjust them under *Skills*, or ask for the bars to be removed entirely.
- **Metrics.** 500+ learners, 200+ projects, 50+ partnerships, 5 years, all taken from the live GFix site. Update if out of date.
- **Languages** on `/resume` are listed as Pashto native, Urdu fluent, English professional. Correct if wrong.

### Needs his voice

- **The four blog posts** in `/blog` are drafts written in his voice from real experience. They are seeded **unpublished** and will not appear until Visible is switched on. They should be read, rewritten where they do not sound right, and deleted if unwanted.
- **The founding story** on `/about` is drafted from what is publicly known. It will read better in his own words.
- **The five leadership convictions** on `/leadership` are inferred from how the agency operates. Confirm he actually holds them.
- **Speaking topics** on `/speaking` are proposed, not previously advertised.

### Other

- **Project cover images** point at the ImageKit assets already on gfixdigital.com. Check each one matches the right project, and replace any that do not from the editor.
- **Testimonials** are published verbatim from the GFix site, including original spellings. `Wohaib Wahab Kha` was corrected to `Wohaib Wahab Khan`, and `AD Collection` is used as the reviewer name because the live site shows the business rather than a person.
- **Deliberately excluded**, and should stay excluded: CNIC number, date of birth, home address, gender, nationality and work permit status.
- **`cv_url` is empty.** Upload a PDF under *Profile → CV file* to add a download button. Until then `/resume` offers print-to-PDF, styled for A4.

---

## Security notes

**Rotate the keys that were shared in plaintext.** The `SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY` currently in `.env.local` were transmitted over chat. The service-role key bypasses Row Level Security entirely, so treat it as compromised:

- Supabase → **Settings → API** → rotate the service role key.
- Resend → **API Keys** → revoke and reissue.

Then update `.env.local` and the Vercel environment variables.

**Other points:**

- `.env.local` is gitignored. Keep it that way, and never commit real keys.
- The service-role key is only ever read in server contexts (`src/app/contact/actions.ts`, `src/app/api/newsletter/route.ts`). It is never sent to the browser.
- Every admin server action re-checks the session independently. Middleware protects the routes, but a server action is its own entry point and does not trust that it was reached through a page.
- `/admin` and `/api/` are excluded in `robots.ts` and carry `noindex`.
- Login errors are deliberately generic and never reveal whether an email address has an account.
- The contact form has a honeypot field and server-side Zod validation. It is not rate-limited; if it attracts spam, add Vercel rate limiting or a Turnstile check.
