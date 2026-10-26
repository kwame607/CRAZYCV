import type { Project } from "@/types/portfolio";

const placeholder = (what: string) => ({
  src: null,
  alt: `Placeholder: ${what} (real screenshot not yet supplied)`,
  neededNote: `Add a real screenshot of ${what} to /public/projects and set its path in src/data/projects.ts.`,
});

/**
 * Project data. "Verified" fields contain only facts supplied by the owner.
 * Anything else lives in "toDocument" or "technologiesToConfirm" until the
 * source code or live site has been checked.
 */
export const projects: Project[] = [
  {
    slug: "admunz-data-hub",
    title: "Admunz Data Hub",
    tagline: "Digital-services platform for automated data bundle sales",
    status: "Live (details being documented)",
    featured: true,
    overview:
      "An online digital-services platform focused on automated data bundle sales, customer onboarding, and digital transactions.",
    problem:
      "Selling data bundles manually is slow and error-prone. The platform automates ordering and onboarding so customers can transact online.",
    role: "Developer (role details to be confirmed by the owner).",
    technologiesVerified: [],
    technologiesToConfirm: ["Frontend framework", "API integrations", "Payment provider", "Hosting"],
    featuresVerified: ["Automated data bundle sales", "Customer onboarding", "Digital transactions"],
    toDocument: [
      "Frontend implementation",
      "API integrations",
      "Payment workflow",
      "Order management",
      "Customer and agent workflows",
      "Server-side configuration",
      "Deployment and maintenance",
      "Error handling and reliability",
    ],
    decisions: [],
    challenges: [],
    learned: [],
    security: [
      "No security assessment has been published for this project yet. See Security Lab for the assessment format.",
    ],
    links: [{ label: "Live site", href: "https://www.admunz.com/" }],
    screenshots: [placeholder("the Admunz Data Hub storefront")],
    ownerNotes: [
      "Confirm the technology stack and the features that are actually deployed.",
      "Confirm whether DataFlow Ghana is part of this product (see that entry).",
    ],
  },
  {
    slug: "adepamarket",
    title: "AdepaMarket",
    tagline: "Ghanaian multi-vendor marketplace for handmade fashion",
    status: "Live (details being documented)",
    featured: true,
    overview:
      "A Ghanaian multi-vendor marketplace focused on handmade fashion, including clothing, footwear, and accessories.",
    problem:
      "Local makers need a place to present and sell handmade fashion to customers online.",
    role: "Developer (role details to be confirmed by the owner).",
    technologiesVerified: [],
    technologiesToConfirm: [
      "Cloudflare Workers hosting (the live URL is on workers.dev; confirm)",
      "Storage and image delivery approach",
      "Database",
    ],
    featuresVerified: ["Multi-vendor marketplace", "Handmade clothing, footwear and accessories"],
    toDocument: [
      "Marketplace architecture",
      "Product presentation",
      "Seller-facing workflows",
      "Responsive user experience",
      "Image delivery",
      "Backend and storage decisions",
      "Security assessment and remediation",
    ],
    decisions: [],
    challenges: [],
    learned: [],
    security: [
      "A security assessment is planned. Findings, remediation and retest evidence will be published only when documented.",
    ],
    links: [{ label: "Live site", href: "https://adepamarket.admunz.workers.dev/" }],
    screenshots: [placeholder("the AdepaMarket home page")],
    ownerNotes: ["Confirm which seller features are deployed versus designed only."],
  },
  {
    slug: "dataflow-ghana",
    title: "DataFlow Ghana",
    tagline: "Data bundle reseller platform with agent and admin workflows",
    status: "Needs verification",
    overview:
      "A data bundle reseller platform with agent and administrative workflows.",
    problem: "Resellers and agents need a way to sell and manage data bundles with administrative oversight.",
    role: "Developer (role details to be confirmed by the owner).",
    technologiesVerified: [],
    technologiesToConfirm: [],
    featuresVerified: ["Agent workflows", "Administrative workflows"],
    toDocument: [
      "Whether this is a separate deployed product or part of Admunz Data Hub",
      "Agent and admin feature set",
      "Deployment status",
    ],
    decisions: [],
    challenges: [],
    learned: [],
    security: ["Not assessed."],
    links: [],
    screenshots: [placeholder("the DataFlow Ghana agent dashboard")],
    ownerNotes: [
      "Decide whether to keep this as its own entry or merge it into Admunz Data Hub to avoid presenting duplicate work as separate products.",
    ],
  },
  {
    slug: "python-port-scanner",
    title: "Python Network Port Scanner",
    tagline: "TCP port and service discovery for authorized environments",
    status: "Tool built; case study evidence pending",
    featured: true,
    overview:
      "A Python tool created to identify active TCP ports and services in authorized environments.",
    problem:
      "Learning how services are exposed on a network requires understanding how TCP connections succeed, fail or are filtered.",
    role: "Author.",
    technologiesVerified: ["Python"],
    technologiesToConfirm: ["Specific modules used (for example socket, concurrent.futures)"],
    featuresVerified: ["Identifies active TCP ports and services"],
    toDocument: [
      "Python networking concepts used",
      "How target authorization is established",
      "How results are represented",
      "Limitations and false positives",
      "Test methodology",
      "Sample output from a controlled lab (redacted)",
    ],
    decisions: [],
    challenges: [],
    learned: [],
    security: [
      "Intended only for systems the owner controls or is explicitly authorized to test.",
      "This portfolio never runs the scanner. The Security Lab demo is a fixed, simulated dataset against a documentation-range address.",
      "Real scan output must be redacted before publishing; no third-party addresses are included.",
    ],
    links: [],
    screenshots: [placeholder("redacted scanner output from a controlled lab")],
    ownerNotes: ["Add the repository link and a redacted sample run from your own lab."],
  },
  {
    slug: "other-projects",
    title: "Additional projects",
    tagline: "LAN chat, encryption simulation, student management system",
    status: "Needs verification",
    overview:
      "Further projects to include once verified: a LAN chat application, an educational encryption simulation, and a student management system.",
    problem: "Each project will state its own problem once details are supplied.",
    role: "To be confirmed.",
    technologiesVerified: [],
    technologiesToConfirm: [],
    featuresVerified: [],
    toDocument: ["LAN chat application", "Educational encryption simulation", "Student management system"],
    decisions: [],
    challenges: [],
    learned: [],
    security: ["Not assessed."],
    links: [],
    screenshots: [],
    ownerNotes: ["Split these into individual entries when source code or screenshots are available."],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
