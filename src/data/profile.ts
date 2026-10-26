import type { Profile, TimelineEntry } from "@/types/portfolio";

/** Empty or whitespace env values count as "not configured". */
function envOrNull(value: string | undefined): string | null {
  const v = value?.trim();
  return v ? v : null;
}

export const profile: Profile = {
  name: "Kwame Emmanuel Adom",
  handle: "adom",
  roles: [
    "Full-stack web developer",
    "Computer Science graduate",
    "Cybersecurity learner",
    "Python programmer",
  ],
  location: "Ghana",
  focus: "Practical cybersecurity and secure application development",
  summary:
    "Computer Science graduate (University of Cape Coast) and full-stack developer, founder of Admunz Data Hub. I build and deploy real web applications, and I am developing practical cybersecurity skills through authorized, documented lab work: investigate, document evidence, fix, and retest.",
  email: envOrNull(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  // The account owns the repositories this portfolio documents; override with the env var if needed.
  github: envOrNull(process.env.NEXT_PUBLIC_GITHUB_URL) ?? "https://github.com/kwame607",
  linkedin: envOrNull(process.env.NEXT_PUBLIC_LINKEDIN_URL),
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
    title: "Founder and Full-Stack Web Developer",
    org: "Admunz Data Hub",
    period: "2026 to present",
    detail: "Founded and built an online platform for data bundle sales and digital services; works on APIs, payment integrations, backend services, deployment and ongoing improvements.",
    status: "verified",
  },
  {
    title: "Web Developer",
    org: "AdepaMarket",
    period: "2026 to present",
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
