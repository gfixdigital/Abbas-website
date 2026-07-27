import type {
  Award,
  Certification,
  Client,
  Education,
  Experience,
  Metric,
  Partner,
  Profile,
  ProcessStep,
  SkillGroup,
  SocialLink,
  Speaking,
  Tool,
  ValuePillar,
} from "./types";

/**
 * Every value below is traceable to either the CV or gfixdigital.com
 * (team page, about page, projects page, footer). Nothing is invented.
 *
 * Deliberately excluded, per the source brief: CNIC, date of birth, home
 * address, gender, nationality, work permit status.
 */

export const profile: Profile = {
  name: "Muhammad Abbas",
  title: "Founder & CEO",
  fullTitle:
    "Founder & CEO | Digital Ecosystem Builder | Technology & Workforce Development Leader",
  tagline: "I build brands, and I train the people who build them.",
  shortBio:
    "Muhammad Abbas leads GFix Digital, a digital solutions agency and training hub based in Swat, Pakistan. He started in graphic design and video editing, and now runs a team delivering branding, web development, and digital marketing for clients across Pakistan. Alongside the client work, he has trained over 500 students in ICT and digital skills.",
  longBio: [
    "Muhammad Abbas is the Founder and CEO of GFix Digital, a digital solutions platform focused on bridging the gap between businesses and skilled digital talent, operating out of Mingora, Swat.",
    "His route into the work was practical rather than academic. He started with graphic design and video editing, taking on client projects while completing a Diploma in Information Technology and, later, a Computer Science degree at Iqra National University. He certified in graphic design and digital marketing through DigiSkills.pk, and spent his early career doing the work directly: brand identities, promotional campaigns, social media content, video production.",
    "That period shaped how GFix Digital operates now. The agency delivers graphic design, web development, digital marketing, video editing, and branding, and the same standards that govern client work also shape how the team teaches.",
    "The training side is not a sideline. He serves as Administrator and IT Trainer at Modern Educational Proficiency Academy, and as a Digital Skills Trainer with the BanoQabil IT Program, one of the largest IT training initiatives in Pakistan. More than 500 learners have come through that work. In a region where digital skills are still scarce, an agency that trains its own pipeline solves two problems at once.",
    "To date the agency has delivered more than 200 projects across fragrance e-commerce, university programmes, international investment initiatives, youth leadership summits, and local brand identities.",
    "Outside the business, he has worked with MP Network on community initiatives across Swat, covering environmental work, food distribution, and child rights advocacy. He was recognised with a Talent Award from Iqra National University in 2025 for academic performance alongside that work.",
  ],
  foundingStory: [
    "Abbas grew up in Swat with a pull toward visual craft. Drawing, design, anything that produced something you could look at when you were finished. Long before he had the tools, he knew that was the work he wanted.",
    "When digital tools became accessible he taught himself graphic design and video editing, took on his first client projects, and noticed something: the skills gap in his region was as real as the demand. Businesses needed work done. Nobody local could do it.",
    "He founded GFix Digital to solve both at once. Build a studio that produces serious commercial work, and use that same studio to train the next generation of digital professionals from Swat.",
  ],
  location: "Mingora, Swat, Khyber Pakhtunkhwa, Pakistan",
  email: "abbas@gfixdigital.com",
  phone: "+92 336 5842012",
  headshotUrl:
    "https://ik.imagekit.io/9ajcnnodl/gfix-digital/team/1779988571199_cropped_image.jpg?tr=w-400,h-400,fo-auto",
  portraitUrl:
    "https://ik.imagekit.io/9ajcnnodl/gfix-digital/team/1779988571199_cropped_image.jpg?tr=w-900,h-1200,fo-auto",
  cvUrl: null,
  company: "GFix Digital",
  companyUrl: "https://gfixdigital.com",
  companyTagline: "The Digital Hub",
  availability: "Open to client work, partnerships, and speaking",
};

export const metrics: Metric[] = [
  {
    label: "Projects delivered",
    value: 200,
    suffix: "+",
    track: "studio",
    note: "Branding, web, media and event work shipped through GFix Digital.",
  },
  {
    label: "Client partnerships",
    value: 50,
    suffix: "+",
    track: "studio",
    note: "Businesses, universities and institutions across Pakistan.",
  },
  {
    label: "Learners trained",
    value: 500,
    suffix: "+",
    track: "academy",
    note: "ICT, digital marketing, design and video through GFix and BanoQabil.",
  },
  {
    label: "Years building",
    value: 5,
    suffix: "",
    track: "academy",
    note: "From first freelance brief to running a multi-department studio.",
  },
];

export const experience: Experience[] = [
  {
    organisation: "GFix Digital",
    role: "Founder & Chief Executive Officer",
    startDate: "2021-04-01",
    endDate: null,
    isCurrent: true,
    location: "Mingora, Swat",
    description:
      "Founded and leads a digital solutions agency and IT training hub, structured into technical, creative, media production, training and management departments.",
    bullets: [
      "Built the agency from solo freelance practice into a departmental studio with dedicated technical, creative, media and training teams.",
      "Delivered 200+ projects spanning e-commerce development, brand identity, event branding and media production.",
      "Set up the training arm so the studio trains its own talent pipeline rather than competing for scarce local hires.",
      "Serves as media and design partner on national and international initiatives, including a U.S. Mission to Pakistan supported programme.",
    ],
    track: "studio",
  },
  {
    organisation: "Modern Educational Proficiency Academy (MEPA)",
    role: "Administrator & IT Trainer",
    startDate: "2023-01-01",
    endDate: null,
    isCurrent: true,
    location: "Swat",
    description:
      "Runs academy administration while teaching ICT, MS Office and design fundamentals.",
    bullets: [
      "Manages academic administration and operational scheduling.",
      "Teaches ICT, MS Office and design fundamentals to school and college level students.",
      "Built structured, project-based course material rather than lecture-only delivery.",
    ],
    track: "academy",
  },
  {
    organisation: "BanoQabil IT Program",
    role: "Digital Skills Trainer",
    startDate: "2024-01-01",
    endDate: null,
    isCurrent: true,
    location: "Swat",
    description:
      "Trainer and coordinator on one of Pakistan's largest IT training initiatives.",
    bullets: [
      "Selected and coordinated professional trainers for digital marketing and graphic design programmes.",
      "Delivered practical, industry-relevant training aimed at employment and freelancing outcomes.",
      "Focused course design on portfolio output so graduates finish with work they can show.",
    ],
    track: "academy",
  },
  {
    organisation: "MP Network",
    role: "Community Volunteer & Coordinator",
    startDate: "2019-01-01",
    endDate: null,
    isCurrent: true,
    location: "Swat",
    description:
      "Long-running volunteer work on community initiatives across the Swat district.",
    bullets: [
      "Environmental initiatives including tree planting and clean-up drives.",
      "Food distribution programmes for families in need.",
      "Child rights advocacy and awareness sessions.",
    ],
    track: "community",
  },
  {
    organisation: "Freelance Practice",
    role: "Graphic Designer & Video Editor",
    startDate: "2020-01-01",
    endDate: "2021-04-01",
    isCurrent: false,
    location: "Swat",
    description:
      "Independent design and video work for local businesses, which became the foundation of GFix Digital.",
    bullets: [
      "Brand identities, promotional campaigns and social media content for local businesses.",
      "Video production and editing for commercial and event clients.",
      "Certified in graphic design and digital marketing through DigiSkills.pk during this period.",
    ],
    track: "studio",
  },
];

export const education: Education[] = [
  {
    institution: "Iqra National University, Swat Campus",
    qualification: "BS Computer Science",
    startYear: "2023",
    endYear: "Present",
    isCurrent: true,
    note: "Recipient of the university Talent Award in 2025 for a 4.0 GPA.",
  },
  {
    institution: "Government Technical College Panr",
    qualification: "Diploma in Information Technology",
    startYear: "2023",
    endYear: "2024",
    isCurrent: false,
    note: null,
  },
];

export const certifications: Certification[] = [
  {
    title: "Graphic Design",
    issuer: "DigiSkills.pk",
    year: "2020",
    description:
      "National digital skills programme covering design principles, typography, layout and industry tooling.",
    credentialUrl: "https://digiskills.pk",
  },
  {
    title: "Digital Marketing",
    issuer: "DigiSkills.pk",
    year: "2020 – 2021",
    description:
      "Search, social and content marketing fundamentals, campaign planning and analytics.",
    credentialUrl: "https://digiskills.pk",
  },
];

export const awards: Award[] = [
  {
    title: "Talent Award",
    issuer: "Iqra National University, Swat",
    year: "2025",
    description:
      "Awarded for academic performance, achieved alongside running GFix Digital and active community work. 4.0 GPA.",
  },
  {
    title: "Commendation Certificate",
    issuer: "PTS Swat",
    year: "2016",
    description:
      "Early recognition for academic and extracurricular contribution.",
  },
];

export const skillGroups: SkillGroup[] = [
  {
    group: "Design & Brand",
    iconName: "Palette",
    skills: [
      { name: "Graphic Design", level: 95 },
      { name: "Brand Identity", level: 92 },
      { name: "Print & Editorial", level: 85 },
      { name: "Visual Direction", level: 88 },
    ],
  },
  {
    group: "Media Production",
    iconName: "Clapperboard",
    skills: [
      { name: "Video Editing", level: 93 },
      { name: "Videography", level: 85 },
      { name: "Photography", level: 82 },
      { name: "Motion Content", level: 78 },
    ],
  },
  {
    group: "Growth & Marketing",
    iconName: "TrendingUp",
    skills: [
      { name: "Digital Marketing", level: 90 },
      { name: "Social Media Strategy", level: 88 },
      { name: "Content Strategy", level: 85 },
      { name: "Campaign Management", level: 82 },
    ],
  },
  {
    group: "Leadership & Training",
    iconName: "Users",
    skills: [
      { name: "Team Leadership", level: 92 },
      { name: "ICT Training", level: 95 },
      { name: "Programme Coordination", level: 88 },
      { name: "Client Relationships", level: 90 },
    ],
  },
];

export const tools: Tool[] = [
  { name: "Adobe Photoshop", category: "Design" },
  { name: "Adobe Illustrator", category: "Design" },
  { name: "Adobe Premiere Pro", category: "Video" },
  { name: "Canva", category: "Design" },
  { name: "KineMaster", category: "Video" },
  { name: "Figma", category: "Design" },
  { name: "Next.js", category: "Web" },
  { name: "React", category: "Web" },
  { name: "Tailwind CSS", category: "Web" },
  { name: "TypeScript", category: "Web" },
  { name: "Supabase", category: "Web" },
  { name: "Meta Business Suite", category: "Growth" },
  { name: "Google Analytics", category: "Growth" },
  { name: "MS Office", category: "Training" },
];

export const clients: Client[] = [
  {
    name: "AD Collection Scents",
    context: "Fragrance e-commerce",
    url: "https://www.adcollectionscents.store/",
  },
  {
    name: "Iqra National University",
    context: "School of Computer Science, Swat",
    url: "https://www.facebook.com/departmentofCSINU",
  },
  {
    name: "Pakistan-U.S. Alumni Network",
    context: "SIRI investment initiative",
    url: "https://puan.pk/",
  },
  {
    name: "Hawks Youth Vision",
    context: "Youth leadership summit",
    url: "https://www.facebook.com/hawksyouthvision",
  },
  { name: "BanoQabil", context: "National IT training", url: "https://banoqabil.org/" },
  {
    name: "United Youth Parliament",
    context: "Youth leadership organisation",
    url: "https://unitedyouthparliament.com/",
  },
  {
    name: "Ayaan Design Studio",
    context: "Brand identity & social",
    url: null,
  },
  {
    name: "Asma's Salon",
    context: "Brand identity",
    url: "https://www.tiktok.com/@asmas.salon",
  },
  {
    name: "MA'ANA Brand Activators",
    context: "Identity & media",
    url: "https://www.facebook.com/maanabrandactivators",
  },
  {
    name: "District Youth Affairs Swat",
    context: "Government collaboration",
    url: null,
  },
];

/**
 * Partners as published on gfixdigital.com/partners, with the agency's own
 * ImageKit logo assets. These are standing collaborations rather than clients.
 */
const IK_PARTNER = "https://ik.imagekit.io/vveiuli91/GFix%20Website%20Pictures";

export const partners: Partner[] = [
  {
    name: "Meher",
    category: "Business",
    description:
      "A long-standing commercial collaboration covering brand and digital work.",
    logoUrl: `${IK_PARTNER}/meherlogo.jpeg?updatedAt=1784137960332`,
    url: "https://www.facebook.com/share/1D7JwAQKrp/",
  },
  {
    name: "MEPA",
    category: "Education",
    description:
      "Modern Educational Proficiency Academy, where Abbas serves as Administrator and IT Trainer. The academy is both a partner and part of the training pipeline.",
    logoUrl: `${IK_PARTNER}/mepa.jpeg?updatedAt=1784137960354`,
    url: "https://www.facebook.com/share/18U9DkX5F2/",
  },
  {
    name: "Computer Shop",
    category: "Hardware & Supply",
    description:
      "Hardware and equipment partner supporting the training programmes and studio operations.",
    logoUrl: `${IK_PARTNER}/Computer%20Shop.jpeg?updatedAt=1784137960298`,
    url: "https://www.facebook.com/share/1A9t24N6Rz/",
  },
  {
    name: "Dejavu",
    category: "Creative",
    description:
      "Creative collaboration based in Peshawar, extending the studio's reach beyond Swat.",
    logoUrl: `${IK_PARTNER}/2.png?updatedAt=1784137960284`,
    url: "https://www.instagram.com/dejavu.peshawar",
  },
];

export const socialLinks: SocialLink[] = [
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/in/muhammad-abbas-gfix",
    iconName: "Linkedin",
    handle: "muhammad-abbas-gfix",
  },
  {
    platform: "WhatsApp",
    url: "https://wa.me/923365842012",
    iconName: "MessageCircle",
    handle: "+92 336 5842012",
  },
  {
    platform: "Facebook",
    url: "https://facebook.com/gfixdigital",
    iconName: "Facebook",
    handle: "gfixdigital",
  },
  {
    platform: "Instagram",
    url: "https://instagram.com/gfixdigital",
    iconName: "Instagram",
    handle: "gfixdigital",
  },
  {
    platform: "X",
    url: "https://x.com/GFixDigital",
    iconName: "Twitter",
    handle: "GFixDigital",
  },
  {
    platform: "TikTok",
    url: "https://www.tiktok.com/@gfix.digital",
    iconName: "Music2",
    handle: "gfix.digital",
  },
  {
    platform: "Pinterest",
    url: "https://www.pinterest.com/gfixdigital",
    iconName: "Image",
    handle: "gfixdigital",
  },
];

export const valuePillars: ValuePillar[] = [
  {
    title: "Partnership",
    description:
      "Listen first, propose clearly, stay accountable from kickoff through delivery. No disappearing between invoices.",
    iconName: "Handshake",
  },
  {
    title: "Craft",
    description:
      "Polished visuals, solid code, considered UX. Nothing leaves the studio half-finished, including the parts nobody will notice.",
    iconName: "Gem",
  },
  {
    title: "Growth",
    description:
      "Invest in learners with structured feedback so skills compound with every project rather than plateau after a course.",
    iconName: "Sprout",
  },
  {
    title: "Momentum",
    description:
      "Fast iteration where it matters, without cutting corners on quality, performance or accessibility.",
    iconName: "Zap",
  },
];

export const processSteps: ProcessStep[] = [
  {
    index: "01",
    title: "Fix",
    description:
      "Analyse the challenge, understand the goal, and agree what success actually looks like before any work starts.",
  },
  {
    index: "02",
    title: "Build",
    description:
      "Design and develop the solution with the same review standards the training programme teaches.",
  },
  {
    index: "03",
    title: "Grow",
    description:
      "Put the work in front of the right audience and measure whether it moved anything.",
  },
  {
    index: "04",
    title: "Scale",
    description:
      "Expand sustainably, with documentation and handover so the client's team can carry it forward.",
  },
];

export const speaking: Speaking[] = [
  {
    title: "Management & Leadership Skills",
    event: "Internship Training Session",
    organiser: "GFix Digital",
    year: "2026",
    type: "Workshop",
    description:
      "A session on management and leadership skills for interns, covering delegation, accountability and team communication.",
    url: null,
  },
  {
    title: "Digital Skills & Freelancing Awareness",
    event: "BanoQabil IT Program",
    organiser: "BanoQabil",
    year: "2026",
    type: "Training Programme",
    description:
      "Trainer and coordinator for digital marketing and graphic design cohorts, focused on employability and freelancing routes.",
    url: "https://banoqabil.org/",
  },
  {
    title: "Youth, Women and the Future of Pakistan",
    event: "Youth Peace Leadership Summit 2026",
    organiser: "Hawks Youth Vision Foundation",
    year: "2026",
    type: "Summit",
    description:
      "Media and management partner for a summit on youth empowerment, women's inclusion and community development, with District Youth Affairs Swat.",
    url: "https://www.facebook.com/hawksyouthvision",
  },
  {
    title: "Leadership & Digital Transformation",
    event: "United Youth Parliament Partnership",
    organiser: "United Youth Parliament",
    year: "2026",
    type: "Seminar Series",
    description:
      "Ongoing collaboration delivering leadership development, digital skills and AI workshops, and career development seminars.",
    url: "https://unitedyouthparliament.com/",
  },
  {
    title: "Investment Readiness & Digital Presence",
    event: "Swat Investment Readiness Initiative",
    organiser: "Pakistan-U.S. Alumni Network",
    year: "2026",
    type: "Initiative",
    description:
      "Media and design partner for an initiative supported by the U.S. Mission to Pakistan, promoting transparent trade and investment readiness.",
    url: "https://puan.pk/",
  },
  {
    title: "Digital Awareness in Schools",
    event: "Institutional Sessions Programme",
    organiser: "GFix Digital",
    year: "Ongoing",
    type: "Outreach",
    description:
      "Sessions in schools and institutions across Swat promoting digital awareness and career development.",
    url: null,
  },
];
