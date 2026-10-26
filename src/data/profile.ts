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
    "I build functional web applications and I am developing practical cybersecurity skills through authorized, documented laboratory assessments: investigate, document evidence, fix, and retest.",
  email: envOrNull(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  github: envOrNull(process.env.NEXT_PUBLIC_GITHUB_URL),
  linkedin: envOrNull(process.env.NEXT_PUBLIC_LINKEDIN_URL),
  cvPdfPath: "/documents/Kwame-Emmanuel-Adom-CV.pdf",
  learningGoals: [
    "Authorized web-application assessments with documented evidence and retesting",
    "Network security fundamentals and Linux command-line workflows",
    "Secure application development practices",
  ],
};

/**
 * Education and experience are intentionally minimal. Only facts stated by the
 * owner are marked "verified"; everything else needs to be supplied from the
 * current CV before publishing.
 */
export const education: TimelineEntry[] = [
  {
    title: "Computer Science (degree)",
    org: "Institution not yet supplied",
    period: "Dates not yet supplied",
    detail:
      "Graduate status is stated by the owner. Institution, degree title and dates must be taken from the current CV.",
    status: "unverified",
  },
];

export const experience: TimelineEntry[] = [
  {
    title: "Independent full-stack developer",
    org: "Self-directed projects",
    period: "Dates not yet supplied",
    detail:
      "Builds and deploys real-world web applications (see Projects). Employer history is not listed because none has been supplied.",
    status: "unverified",
  },
];
