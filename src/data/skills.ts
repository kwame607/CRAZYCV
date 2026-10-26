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
    title: "Programming",
    skills: [
      { name: "Python", evidence: [proj("python-port-scanner", "Python Network Port Scanner")] },
      { name: "JavaScript and TypeScript", evidence: [], needsEvidence: true },
      { name: "HTML and CSS", evidence: [proj("adepamarket", "AdepaMarket")] },
      { name: "SQL", evidence: [], needsEvidence: true },
      { name: "C++", evidence: [], needsEvidence: true },
    ],
  },
  {
    title: "Web Development",
    skills: [
      { name: "Full-stack web applications", evidence: [proj("admunz-data-hub", "Admunz Data Hub"), proj("adepamarket", "AdepaMarket")] },
      { name: "Responsive design", evidence: [proj("adepamarket", "AdepaMarket")] },
      { name: "API integration", evidence: [proj("admunz-data-hub", "Admunz Data Hub")] },
      { name: "React and Next.js", evidence: [{ kind: "demo", label: "This portfolio (ADOM // OS)", href: "/" }] },
      { name: "Database integration", evidence: [], needsEvidence: true },
    ],
  },
  {
    title: "Systems and Networking",
    skills: [
      { name: "Linux and command-line workflows", evidence: [], needsEvidence: true },
      { name: "TCP/IP and socket programming", evidence: [proj("python-port-scanner", "Python Network Port Scanner")] },
      { name: "Subnetting and CIDR", evidence: [{ kind: "demo", label: "Network Tools: subnet calculator", href: "/network-tools" }] },
      { name: "DNS and HTTP/HTTPS", evidence: [], needsEvidence: true },
    ],
  },
  {
    title: "Cybersecurity",
    skills: [
      { name: "Security fundamentals", evidence: [], needsEvidence: true },
      {
        name: "Evidence-based assessment reporting",
        evidence: [{ kind: "demo", label: "Security Lab: assessment format", href: "/security-lab" }],
      },
      { name: "Authorized vulnerability assessment", evidence: [], needsEvidence: true },
      { name: "Remediation and retesting", evidence: [], needsEvidence: true },
    ],
  },
  {
    title: "Tools",
    skills: [
      { name: "Git and GitHub", evidence: [], needsEvidence: true },
      { name: "Kali Linux", evidence: [], needsEvidence: true },
      { name: "Browser developer tools", evidence: [], needsEvidence: true },
    ],
  },
];
