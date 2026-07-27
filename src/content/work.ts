import type { CaseStudy, Service, Testimonial } from "./types";

const IK = "https://ik.imagekit.io/9ajcnnodl/gfix-digital/projects";

/**
 * Case studies, clients and copy are taken from gfixdigital.com/projects.
 * Cover images point at the live ImageKit CDN assets already used by the
 * agency site. Abbas can replace any of them from /admin.
 */
export const caseStudies: CaseStudy[] = [
  {
    title: "AD Collection Scents",
    slug: "ad-collection-scents",
    client: "AD Collection Scents",
    category: "Web & Design",
    eyebrow: "E-commerce store",
    year: "2026",
    summary:
      "A custom fragrance storefront with a bespoke admin panel, built so the brand can run its own operations without technical help.",
    brief:
      "AD Collection Scents is a premium fragrance brand that needed a high-converting digital storefront paired with an intuitive backend management ecosystem. Off-the-shelf platforms could not carry the visual weight the brand wanted, and the team had no appetite for developer dependency on day-to-day operations.",
    solution:
      "We designed and engineered a custom e-commerce platform tailored to showcase luxury scents, with high-contrast visuals, responsive product showcases, and a seamless cart and checkout flow. Behind it sits a fully bespoke admin dashboard: real-time inventory tracking, order status updates, customer insight, and complete content control. The architecture was built to scalable database standards with security handled properly rather than bolted on.",
    result:
      "The brand now runs its entire commercial operation in-house. Order processing, inventory and content updates happen without developer involvement, and the mobile-first build holds its conversion performance across every screen size.",
    coverImageUrl: `${IK}/1784961735080_cropped_image.jpg`,
    gallery: [],
    techUsed: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Custom Admin Panel",
      "Order Management",
      "Inventory Management",
    ],
    liveUrl: "https://www.adcollectionscents.store/",
    featured: true,
    track: "studio",
  },
  {
    title: "FYP Projects Exhibition & Open House 2026",
    slug: "fyp-exhibition-open-house-2026",
    client: "School of Computer Science, Iqra National University",
    category: "Media & Design",
    eyebrow: "Media, design & management partner",
    year: "2026",
    summary:
      "Official media, design and event management partner for a university-wide final year project exhibition.",
    brief:
      "The School of Computer Science at Iqra National University, Swat Campus needed a partner to carry the entire creative and event operation for its Final Year Projects Exhibition and Open House, bringing together students, faculty, industry professionals and technology experts.",
    solution:
      "GFix Digital handled visual branding, graphic design, photography, videography, media coverage and on-site event management, working directly with the organising committee from concept through execution. The exhibition covered artificial intelligence, software engineering, web development, robotics and automation, cybersecurity, and data science.",
    result:
      "The event ran as a professionally branded, fully documented showcase, and the university has continued the partnership for subsequent initiatives.",
    coverImageUrl: `${IK}/1783106746593_cropped_image.jpg`,
    gallery: [],
    techUsed: [
      "Event Branding",
      "Print Design",
      "Photography",
      "Videography",
      "Event Management",
    ],
    liveUrl: "https://www.facebook.com/departmentofCSINU",
    featured: true,
    track: "studio",
  },
  {
    title: "Swat Investment Readiness Initiative",
    slug: "swat-investment-readiness-initiative",
    client: "Pakistan-U.S. Alumni Network",
    category: "Media & Design",
    eyebrow: "Official media & design partner",
    year: "2026",
    summary:
      "Creative direction and event identity for an international investment initiative supported by the U.S. Mission to Pakistan.",
    brief:
      "The Swat Investment Readiness Initiative is an international programme supported by the U.S. Mission to Pakistan in partnership with the Pakistan-U.S. Alumni Network. It required branding and communication that would meet international standards while clearly carrying its vision of transparent trade, investment readiness, and stronger U.S. and Pakistan commercial linkages.",
    solution:
      "GFix Digital delivered creative direction, event branding and visual identity, standee and print design, social media creatives, event photography and full media documentation. Every design element was developed against international brand standards rather than local convention.",
    result:
      "The initiative launched with a coherent visual identity and complete media documentation, and GFix Digital was credited as official media and design partner on an internationally supported programme.",
    coverImageUrl: `${IK}/1783535466703_cropped_image.jpg`,
    gallery: [],
    techUsed: [
      "Creative Direction",
      "Visual Identity",
      "Print Design",
      "Social Creatives",
      "Event Photography",
    ],
    liveUrl: "https://puan.pk/",
    featured: true,
    track: "studio",
  },
  {
    title: "Youth Peace Leadership Summit 2026",
    slug: "youth-peace-leadership-summit-2026",
    client: "Hawks Youth Vision Foundation",
    category: "Event Management",
    eyebrow: "Media & management partner",
    year: "2026",
    summary:
      "End-to-end event management and media production for a youth leadership summit run with District Youth Affairs Swat.",
    brief:
      "Under the theme \"Youth, Women and the Future of Pakistan\", the summit brought together young leaders, students and changemakers to discuss youth empowerment, women's inclusion and community development. Hawks Youth Vision Foundation needed both operational event support and a media operation that would carry the message beyond the room.",
    solution:
      "The team provided event management support, media coverage, photography and videography, content creation, editing, and digital promotion across the summit's channels.",
    result:
      "The summit executed on schedule with full media documentation, and the promotional campaign extended its reach well past the attending audience.",
    coverImageUrl: `${IK}/1782417616954_cropped_image.jpg`,
    gallery: [],
    techUsed: [
      "Event Management",
      "Media Coverage",
      "Photography",
      "Videography",
      "Content Creation",
      "Social Promotion",
    ],
    liveUrl: "https://www.facebook.com/hawksyouthvision",
    featured: false,
    track: "studio",
  },
  {
    title: "BanoQabil Digital Skills Training",
    slug: "banoqabil-digital-skills-training",
    client: "BanoQabil IT Program",
    category: "Training",
    eyebrow: "Training & educational partnership",
    year: "2026",
    summary:
      "Trainer selection and programme coordination for digital marketing and graphic design cohorts on one of Pakistan's largest IT training initiatives.",
    brief:
      "BanoQabil runs IT training at national scale. The Swat programmes needed professional trainers selected and coordinated for digital marketing and graphic design, with course content that would actually convert into employment or freelance income rather than certificates.",
    solution:
      "Abbas collaborated directly with the BanoQabil initiative to select and coordinate professional trainers, and shaped the programmes around practical digital skills, creative learning and industry-relevant briefs.",
    result:
      "Students finished the cohorts with portfolio work rather than notes, positioned for career growth and freelancing opportunities.",
    coverImageUrl: `${IK}/1779705921056_cropped_image.jpg`,
    gallery: [],
    techUsed: [
      "ICT Training",
      "Digital Skills",
      "Programme Coordination",
      "Trainer Selection",
    ],
    liveUrl: "https://banoqabil.org/",
    featured: true,
    track: "academy",
  },
  {
    title: "Ayaan Design Studio & Associates",
    slug: "ayaan-design-studio",
    client: "Ayaan Design Studio",
    category: "Branding",
    eyebrow: "Branding & retained marketing",
    year: "2025",
    summary:
      "Complete brand identity built from scratch, followed by ongoing management of the studio's entire digital marketing operation.",
    brief:
      "Ayaan Design Studio & Associates needed a brand identity from nothing, and then needed someone to actually run the digital presence rather than hand over files and leave.",
    solution:
      "We built the identity from logo creation through to full brand system, then took over social media management, content creation and digital marketing strategy as a retained engagement.",
    result:
      "GFix Digital now actively manages the studio's entire digital marketing strategy, making this the agency's longest-running retained client relationship.",
    coverImageUrl: "https://ik.imagekit.io/vveiuli91/GFix%20Website%20Pictures/project1.jpeg?updatedAt=1784137960349",
    gallery: [],
    techUsed: [
      "Logo Design",
      "Brand Identity",
      "Social Media Management",
      "Content Creation",
      "Digital Marketing",
    ],
    liveUrl: null,
    featured: false,
    track: "studio",
  },
  {
    title: "United Youth Parliament",
    slug: "united-youth-parliament",
    client: "United Youth Parliament",
    category: "Training & Events",
    eyebrow: "Strategic collaboration",
    year: "2026",
    summary:
      "A standing partnership delivering leadership development, digital skills and AI workshops, and career seminars for Pakistani youth.",
    brief:
      "United Youth Parliament is a non-political, non-profit youth leadership organisation working on leadership development, parliamentary education, civic engagement and public speaking. It needed a digital partner to bring technology capability into that programme.",
    solution:
      "GFix Digital entered a strategic collaboration covering leadership development programmes, digital skills and AI workshops, career development seminars, youth conferences, entrepreneurship and freelancing awareness sessions, and public speaking training.",
    result:
      "The partnership bridges leadership and digital transformation, giving participants practical skills and professional guidance alongside civic education.",
    coverImageUrl: `${IK}/1784056217399_cropped_image.jpg`,
    gallery: [],
    techUsed: [
      "Soft Skills Training",
      "Digital Literacy",
      "AI Education",
      "Seminars & Events",
      "Career Guidance",
    ],
    liveUrl: "https://unitedyouthparliament.com/",
    featured: false,
    track: "academy",
  },
  {
    title: "Asma's Salon",
    slug: "asmas-salon",
    client: "Asma's Salon",
    category: "Branding",
    eyebrow: "Brand identity & creative design",
    year: "2025",
    summary:
      "A complete visual identity for a beauty salon, built to work equally well in print and on social.",
    brief:
      "Asma's Salon needed a professional logo and a complete brand identity that would communicate elegance and professionalism across both digital and print media.",
    solution:
      "The design team produced a modern visual identity covering logo, colour palette, typography styling and supporting brand elements, specified for both digital and print application.",
    result:
      "The salon has a consistent identity it can apply itself across signage, print collateral and social channels without redesigning each time.",
    coverImageUrl: `${IK}/1779706341400_cropped_image.jpg`,
    gallery: [],
    techUsed: ["Logo Design", "Brand Identity", "Colour Palette", "Typography"],
    liveUrl: "https://www.tiktok.com/@asmas.salon",
    featured: false,
    track: "studio",
  },
  {
    title: "MA'ANA Brand Activators",
    slug: "maana-brand-activators",
    client: "MA'ANA Brand Activators",
    category: "Branding",
    eyebrow: "Identity branding",
    year: "2025",
    summary:
      "Full identity and collateral system for a brand activation agency, including print, video and photography.",
    brief:
      "MA'ANA Brand Activators needed a complete identity and the full collateral set that a brand activation business has to put in front of its own clients.",
    solution:
      "The team delivered logo design, business cards, social media assets, print media, videography and photography as a single coordinated identity system.",
    result:
      "MA'ANA launched with a consistent identity across every touchpoint its own clients would encounter.",
    coverImageUrl: `${IK}/1779704668049_cropped_image.jpg`,
    gallery: [],
    techUsed: [
      "Logo Design",
      "Business Cards",
      "Social Media",
      "Print Media",
      "Videography",
      "Photography",
    ],
    liveUrl: "https://www.facebook.com/maanabrandactivators",
    featured: false,
    track: "studio",
  },
];

export const services: Service[] = [
  {
    title: "Brand & Graphic Design",
    slug: "brand-graphic-design",
    description:
      "Identity systems built to survive contact with the real world, specified for print and digital from the start.",
    iconName: "Palette",
    features: [
      "Logo design and identity systems",
      "Colour palette and typography specification",
      "Print collateral and stationery",
      "Social media asset systems",
      "Brand guideline documentation",
    ],
    track: "studio",
  },
  {
    title: "Web Development",
    slug: "web-development",
    description:
      "Custom sites and storefronts on a modern stack, with an admin panel so you are not paying a developer to change a price.",
    iconName: "Code2",
    features: [
      "Custom marketing sites and e-commerce",
      "Bespoke admin panels and dashboards",
      "Performance and mobile optimisation",
      "Scalable, secure database architecture",
      "Documentation and team handover",
    ],
    track: "studio",
  },
  {
    title: "Digital Marketing",
    slug: "digital-marketing",
    description:
      "Campaigns with a number attached to them. Strategy, execution and honest reporting on what moved.",
    iconName: "TrendingUp",
    features: [
      "Social media strategy and management",
      "Paid campaign planning and execution",
      "Content strategy and calendars",
      "Analytics and performance reporting",
      "Retained marketing engagements",
    ],
    track: "studio",
  },
  {
    title: "Video & Media Production",
    slug: "video-media-production",
    description:
      "Photography, videography and editing for commercial work, events and campaigns.",
    iconName: "Clapperboard",
    features: [
      "Commercial and promotional video",
      "Event photography and videography",
      "Post-production and editing",
      "Media documentation and coverage",
      "Short-form social content",
    ],
    track: "studio",
  },
  {
    title: "ICT & Digital Skills Training",
    slug: "ict-digital-skills-training",
    description:
      "Project-based training that ends with portfolio work, not a certificate. Delivered to cohorts, institutions and teams.",
    iconName: "GraduationCap",
    features: [
      "ICT and MS Office fundamentals",
      "Graphic design and video editing cohorts",
      "Digital marketing and freelancing tracks",
      "Institutional and school programmes",
      "Structured feedback and portfolio review",
    ],
    track: "academy",
  },
  {
    title: "Event Branding & Management",
    slug: "event-branding-management",
    description:
      "Media and design partnership for summits, exhibitions and initiatives, including on-site operational support.",
    iconName: "CalendarCheck",
    features: [
      "Event visual identity and print",
      "On-site event management support",
      "Media coverage and documentation",
      "Speaker and programme collateral",
      "Post-event content and promotion",
    ],
    track: "studio",
  },
];

/**
 * Testimonials as published on gfixdigital.com. Quotes are verbatim, including
 * the original spelling of author names and roles.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Great experience! Very professional and cooperative team. They built my website exactly the way I wanted. I'm genuinely happy with their work. Thank you for the great service highly recommended!",
    authorName: "AD Collection",
    authorTitle: "Client",
    authorCompany: "AD Collection Scents",
    authorPhotoUrl: null,
  },
  {
    quote:
      "GFix Digital is a platform of digital solutions and IT training skills. They provide services such as graphic design, digital marketing, and software solutions. GFix also offering educational programs like Python for AI, digital marketing, and video editing services. Our experience with GFix is outstanding, they provide us great services, in promoting academic activities.",
    authorName: "Dr. Gulzar Mehmood",
    authorTitle: "University Professor",
    authorCompany: null,
    authorPhotoUrl: null,
  },
  {
    quote:
      "The session was conducted extremely perfect covering all the aspects of the Management and Leadership Skills. I learned a lot and hoping for many other fruitful sessions like this.",
    authorName: "Wohaib Wahab Khan",
    authorTitle: "Intern",
    authorCompany: "GFix Digital",
    authorPhotoUrl: null,
  },
  {
    quote:
      "Sir bohot kuch seka. Team work, soft skill, management skill. Zbrddast.",
    authorName: "Rafi Ullah",
    authorTitle: "Digital Marketing Student",
    authorCompany: "BanoQabil",
    authorPhotoUrl: null,
  },
  {
    quote: "Zabardast.",
    authorName: "Muhammad Dawood",
    authorTitle: "Student",
    authorCompany: null,
    authorPhotoUrl: null,
  },
];
