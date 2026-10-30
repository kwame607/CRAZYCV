import type { SkillGroup } from "@/types/portfolio";

const proj = (slug: string, label: string) => ({
  kind: "project" as const,
  label,
  href: `/projects/${slug}`,
});

/**
 * No proficiency percentages, years or certifications are listed. Skills link
 * to evidence; entries without evidence are flagged until some is supplied.
 */
export const skillGroups: SkillGroup[] = [
  {
    title: "Cybersecurity",
    skills: [
      {
        name: "Security fundamentals",
        evidence: [
          { kind: "demo", label: "Cisco Networking Academy certificates: Introduction to Cybersecurity and Ethical Hacking (see About)", href: "/about" },
          { kind: "demo", label: "Security Tools: link checker, hashing and salting, security headers", href: "/security-tools" },
        ],
      },
      {
        name: "Evidence-based assessment reporting",
        evidence: [{ kind: "demo", label: "Security Lab: assessment format", href: "/security-lab" }],
      },
      { name: "Authorized vulnerability assessment (lab practice, OWASP Top 10)", evidence: [proj("pentest-home-lab", "Penetration Testing Home Lab (CV)")] },
      { name: "Remediation and retesting", evidence: [], needsEvidence: true },
    ],
  },
  {
    title: "Systems and Networking",
    skills: [
      { name: "Linux and command-line workflows", evidence: [proj("pentest-home-lab", "Penetration Testing Home Lab (CV)")] },
      { name: "TCP/IP and socket programming", evidence: [proj("python-port-scanner", "Python Network Port Scanner"), proj("lan-chat", "LAN Chat Application")] },
      { name: "Subnetting and CIDR", evidence: [{ kind: "demo", label: "Network Tools: subnet calculator", href: "/network-tools" }] },
      { name: "DNS and HTTP/HTTPS", evidence: [], needsEvidence: true },
    ],
  },
  {
    title: "Tools",
    skills: [
      { name: "Git and GitHub", evidence: [{ kind: "repository", label: "GitHub profile", href: "https://github.com/kwame607" }] },
      { name: "Kali Linux, Nmap and Metasploit", evidence: [proj("pentest-home-lab", "Penetration Testing Home Lab (CV)")] },
      { name: "Burp Suite", evidence: [], needsEvidence: true },
      { name: "Browser developer tools", evidence: [], needsEvidence: true },
    ],
  },
  {
    title: "Programming",
    skills: [
      { name: "Python", evidence: [proj("python-port-scanner", "Python Network Port Scanner"), proj("momo-fraud-shield", "MoMo Fraud Shield"), proj("lan-chat", "LAN Chat Application")] },
      { name: "JavaScript (basic) and TypeScript (in AI-assisted projects)", evidence: [proj("adepamarket", "AdepaMarket (TypeScript)"), proj("admunz-data-hub", "Admunz Data Hub (TypeScript)"), proj("city-beans", "City Beans (JavaScript)")] },
      { name: "HTML and CSS", evidence: [proj("adepamarket", "AdepaMarket")] },
      { name: "SQL", evidence: [proj("admunz-data-hub", "Admunz Data Hub (Supabase, SQL scripts)")] },
      { name: "C++", evidence: [], needsEvidence: true },
    ],
  },
  {
    title: "AI and Machine Learning",
    skills: [
      { name: "Text classification with scikit-learn (TF-IDF, Logistic Regression, SVM, Random Forest)", evidence: [proj("momo-fraud-shield", "MoMo Fraud Shield")] },
      { name: "Model evaluation and explainability (LIME)", evidence: [proj("momo-fraud-shield", "MoMo Fraud Shield")] },
    ],
  },
  {
    title: "Web Development",
    skills: [
      { name: "Full-stack web applications (AI-assisted builds)", evidence: [proj("admunz-data-hub", "Admunz Data Hub"), proj("adepamarket", "AdepaMarket")] },
      { name: "Responsive design", evidence: [proj("adepamarket", "AdepaMarket")] },
      { name: "API integration", evidence: [proj("admunz-data-hub", "Admunz Data Hub (Paystack, upstream providers)"), proj("adepamarket", "AdepaMarket (Paystack)"), proj("city-beans", "City Beans (Paystack, Supabase)")] },
      { name: "React and Next.js (AI-assisted builds)", evidence: [proj("city-beans", "City Beans (React, Vite)"), { kind: "demo", label: "This portfolio (ADOM // OS)", href: "/" }, proj("adepamarket", "AdepaMarket"), proj("admunz-data-hub", "Admunz Data Hub")] },
      { name: "Flask", evidence: [proj("momo-fraud-shield", "MoMo Fraud Shield (Flask)")] },
      { name: "Django and FastAPI", evidence: [], needsEvidence: true },
      { name: "Database integration", evidence: [proj("adepamarket", "AdepaMarket (D1 with Drizzle)"), proj("admunz-data-hub", "Admunz Data Hub (Supabase)"), proj("city-beans", "City Beans (Supabase)")] },
    ],
  },
  {
    title: "Interactive 3D",
    skills: [
      {
        name: "A-Frame scenes",
        evidence: [
          proj("interactive-villa-vr", "Interactive Villa VR"),
          { kind: "demo", label: "Solar System demo", href: "https://kwame607.github.io/solar-system/" },
        ],
      },
      { name: "GLB/GLTF asset integration", evidence: [proj("interactive-villa-vr", "Interactive Villa VR")] },
      { name: "Camera and movement controls (desktop and touch)", evidence: [proj("interactive-villa-vr", "Interactive Villa VR")] },
    ],
  },
];

export type SkillLevel = "shipped" | "lab" | "learning";

export const levelLabels: Record<SkillLevel, { label: string; meaning: string }> = {
  shipped: { label: "In shipped work", meaning: "Used in a project with a case study on this site." },
  lab: { label: "Lab practice", meaning: "Practised in my own isolated lab or coursework. Not used on a client or production system." },
  learning: { label: "Learning", meaning: "Familiar, and actively learning. No project here demonstrates it yet." },
};

/**
 * Derived, never hand-typed per skill, so the label can't drift from the evidence:
 *  - no evidence at all            -> learning
 *  - evidence only from the home lab or a demo page -> lab practice
 *  - any real project evidence      -> shipped
 */
export function skillLevel(skill: { evidence: { kind: string; href: string }[]; needsEvidence?: boolean }): SkillLevel {
  if (skill.needsEvidence || skill.evidence.length === 0) return "learning";
  const real = skill.evidence.some((e) => e.kind === "project" && !e.href.endsWith("/pentest-home-lab"));
  return real ? "shipped" : "lab";
}
