import type { Post } from "./types";

/**
 * Draft editorial. Written from the same source material as the rest of the
 * site and in Abbas's stated voice, but every post here needs his review
 * before publication since it goes out under his name.
 */
export const posts: Post[] = [
  {
    title: "Why our agency trains its own talent",
    slug: "why-our-agency-trains-its-own-talent",
    excerpt:
      "Hiring in Swat is not a pipeline problem you can solve with a better job advert. We stopped trying and built the pipeline instead.",
    body: [
      "Every agency in a small market runs into the same wall. You win work you can deliver, then you win work that needs a second designer, and there is no second designer. Not one who is available, not one who has done the kind of work you need, and often not one within a hundred kilometres.",
      "The standard response is to post the role wider, pay above local rate, and wait. We tried that. What you get is candidates who can operate the software and have never had a brief rejected, which is a different skill entirely.",
      "So we changed the question. Instead of asking where we could find trained people, we asked what it would cost to train them ourselves. The answer turned out to be less than the cost of the delays we were already absorbing.",
      "The mechanism is simple. The same standards that govern client work govern the training. Real briefs, real deadlines, real quality reviews where work gets sent back. A student who has had three rounds of revisions on a logo understands something a certificate cannot convey.",
      "Over 500 people have now come through that work, between GFix Digital, MEPA and the BanoQabil programme. Some joined the team. Most did not, and that is fine. They went freelance, joined other studios, started their own things. The market we hire from got deeper either way.",
      "The part people miss is that it made the client work better, not worse. Teaching a thing forces you to know why you do it. Our review process is sharper because it has to be explainable to someone learning it for the first time.",
      "If you operate in a market where the talent does not exist yet, you have two options. Compete for the few people who do, or make more of them. The second one takes longer and compounds.",
    ],
    tags: ["Leadership", "Training", "Agency"],
    publishedAt: "2026-06-18",
    readingMinutes: 4,
  },
  {
    title: "Build the admin panel first",
    slug: "build-the-admin-panel-first",
    excerpt:
      "Most client sites die of neglect, not bad design. The fix is boring: make the client able to change things without calling you.",
    body: [
      "A pattern we saw repeatedly before we changed how we work: deliver a good site, client is happy, six months later the site is stale. Prices are wrong. The team page lists someone who left. The banner still advertises a campaign that ended in spring.",
      "It was never a design problem. It was that changing anything required an email to us, and an email to us felt like an imposition, so nobody sent it.",
      "Now we treat the admin panel as part of the deliverable rather than a technical afterthought. On the AD Collection Scents build, the storefront and the admin panel were scoped as two halves of one project. Inventory, orders, customer insight, content, all editable by the people who run the business.",
      "This costs more to build. It is worth it for a specific reason: it changes who owns the site. A client who can edit their own content treats the site as an operational tool. A client who cannot treats it as a brochure someone else made.",
      "There is a design discipline to it too. An admin panel for a non-technical owner cannot expose database column names, cannot show raw error strings, and cannot assume the person using it knows what a slug is. If your CMS needs a training session, you have built it for yourself and not for them.",
      "The test we use: can the owner change a price, swap a photo, and add a team member without opening a chat window. If not, the project is not finished.",
    ],
    tags: ["Web Development", "Client Work", "Craft"],
    publishedAt: "2026-05-02",
    readingMinutes: 3,
  },
  {
    title: "What international clients actually check",
    slug: "what-international-clients-actually-check",
    excerpt:
      "Working as media partner on a U.S. Mission supported initiative taught us which standards are real and which are local habit.",
    body: [
      "When GFix Digital was brought on as media and design partner for the Swat Investment Readiness Initiative, the work had to meet international branding standards. That phrase gets used loosely. In practice it meant a specific and useful set of constraints.",
      "Asset specification came first. Not one logo file, but the full set at the right formats and resolutions, with clear rules about minimum sizes and clear space. Locally you can usually get away with sending a PNG. At this level you cannot.",
      "Second, consistency across languages and contexts. The same identity had to hold on a standee, in a social creative, in a print programme, and in photographs taken by someone else under lighting nobody controlled.",
      "Third, documentation. Every deliverable traceable, every version labelled. When several organisations share credit on a project, ambiguity about which file is current costs real time.",
      "None of this is exotic. It is the difference between design as decoration and design as infrastructure. We had been doing most of it already, but informally, held together by the fact that the team was small enough to remember.",
      "The lesson we kept was to run local projects to the same standard. Not because clients demand it, but because the discipline is what lets you take the next larger project without changing how you work.",
    ],
    tags: ["Branding", "Standards", "Case Notes"],
    publishedAt: "2026-04-11",
    readingMinutes: 4,
  },
  {
    title: "Running a studio while finishing a degree",
    slug: "running-a-studio-while-finishing-a-degree",
    excerpt:
      "Two full commitments, one calendar. What actually made it work, and what I would not repeat.",
    body: [
      "I founded GFix Digital before I finished my Computer Science degree, and I am still doing both. People ask how, usually expecting a productivity answer. The honest answer is structural, not personal.",
      "The first thing that worked was refusing to treat them as separate. Coursework that could be pointed at a real problem got pointed at one. A database module became the schema for a client project. That is not a trick available in every subject, but it is available more often than students assume.",
      "The second was departments. For the first two years I was the studio, which meant every project waited on me. Splitting the team into technical, creative, media and training departments with actual ownership meant work could move without my attention. That was the change that made the degree survivable.",
      "The third was accepting slower growth. We turned down work in 2024 that we could technically have delivered. Taking it would have meant delivering it badly or dropping the degree, and both cost more than the invoice was worth.",
      "What I would not repeat: I spent the first year treating sleep as the flexible resource. It is not flexible. The work produced in those hours needed redoing often enough that the arithmetic never worked.",
      "The Talent Award from Iqra National University in 2025 came with a 4.0 GPA, and I mention it only because it is evidence for the specific claim that you do not have to pick. But you do have to build a team, and you do have to say no.",
    ],
    tags: ["Leadership", "Personal"],
    publishedAt: "2026-03-07",
    readingMinutes: 4,
  },
];
