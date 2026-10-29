import type { Profile, StudyEntry, TimelineEntry } from "@/types/portfolio";

/** Empty or whitespace env values count as "not configured". */
function envOrNull(value: string | undefined): string | null {
  const v = value?.trim();
  return v ? v : null;
}

export const profile: Profile = {
  name: "Kwame Emmanuel Adom",
  handle: "adom",
  roles: [
    "Aspiring cybersecurity professional",
    "Computer Science graduate",
    "Python programmer",
    "Web developer (HTML, CSS, basic JavaScript)",
  ],
  location: "Kumasi, Ghana",
  focus: "Practical cybersecurity and secure application development",
  summary:
    "Aspiring cybersecurity professional with a BSc in Computer Science (University of Cape Coast). I am building security skills through practical projects and authorized, documented lab work: investigate, document evidence, fix, and retest. My strongest web fundamentals are HTML, CSS and basic JavaScript. I have also built AI-assisted web applications with Node.js, TypeScript and modern frameworks, and I do not claim to have written all of that code myself.",
  // Public contact address supplied by the owner; the env var can override it.
  email: envOrNull(process.env.NEXT_PUBLIC_CONTACT_EMAIL) ?? "kwameadom607@gmail.com",
  // The account owns the repositories this portfolio documents; override with the env var if needed.
  github: envOrNull(process.env.NEXT_PUBLIC_GITHUB_URL) ?? "https://github.com/kwame607",
  linkedin: envOrNull(process.env.NEXT_PUBLIC_LINKEDIN_URL) ?? "https://www.linkedin.com/in/kwame-adom-957b58277",
  // Number supplied by the owner for the portfolio; it matches the CV. Ghana country code 233, leading 0 dropped.
  whatsapp: { display: "+233 53 275 9082", href: "https://wa.me/233532759082" },
  website: "https://www.admunz.com/",
  cvPdfPath: "/documents/Kwame-Emmanuel-Adom-CV.pdf",
  learningGoals: [
    "Authorized web-application assessments with documented evidence and retesting",
    "Network security fundamentals and Linux command-line workflows",
    "Secure application development practices",
  ],
};

/**
 * Education, experience and certifications are taken from the owner's CV
 * (Kwame_Emmanuel_Adom_CV.pdf). "verified" here means stated by the owner on
 * the CV; no dates or credentials have been added beyond what it says.
 */
export const education: TimelineEntry[] = [
  {
    title: "BSc Computer Science",
    org: "University of Cape Coast",
    detail: "Final-year project: an AI-based system for detecting impersonation and mobile money-related social engineering fraud (MoMo Fraud Shield).",
    status: "verified",
  },
  {
    title: "General Science",
    org: "Osei Tutu High School",
    detail: "Secondary education.",
    status: "verified",
  },
];

export const experience: TimelineEntry[] = [
  {
    title: "Founder and Web Developer",
    org: "Admunz Data Hub",
    period: "2026 to present",
    detail: "Founded and built an online platform for data bundle sales and digital services; works on APIs, payment integrations, backend services, deployment and ongoing improvements.",
    status: "verified",
  },
  {
    title: "Founder and Web Developer",
    org: "AdepaMarket",
    period: "2026 to present",
    // The CV summary calls the owner founder and developer of AdepaMarket; the CV experience entry says Web Developer.
    detail: "Built an e-commerce marketplace connecting Ghanaian fashion sellers with customers, with responsive interfaces; deployed on Cloudflare Workers.",
    status: "verified",
  },
  {
    title: "Website Developer and Graphic Designer",
    org: "Citybeans Restaurant (freelance, project-based)",
    period: "2026 to present",
    detail: "Designed and developed the restaurant's website and created graphic design material for its branding and promotion.",
    status: "verified",
  },
  {
    title: "Web Developer",
    org: "Wisewave Enterprise",
    period: "2025 to present",
    detail: "Developed a business website presenting travel and tours, automobile imports, fashion designing, mobile money transfers and education consultancy services.",
    status: "verified",
  },
  {
    title: "IT Support and Website Administrator",
    org: "Aslin Fashion School",
    period: "2024 to 2026",
    detail: "Provided IT support for the organisation's website and online systems, including updates, routine maintenance and troubleshooting.",
    status: "verified",
  },
];

export const certifications: TimelineEntry[] = [
  {
    title: "Introduction to Cybersecurity",
    org: "Cisco Networking Academy",
    detail: "Certificate listed on the CV. No credential ID or issue date is shown here because the CV does not give one.",
    status: "verified",
  },
];

/**
 * The CV lists Ethical Hacking under certifications but states only the
 * Introduction certificate as earned ("continued professional development in
 * ethical hacking"). It is therefore shown as continuing study, not as a
 * credential. Confirm completion status before moving it to `certifications`.
 */
export const studying: StudyEntry[] = [
  {
    title: "Ethical Hacking",
    org: "Cisco Networking Academy",
    note: "Continuing study. Listed on the CV; no completion is claimed here.",
  },
];
