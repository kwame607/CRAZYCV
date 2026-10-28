export interface MoreBuild {
  title: string;
  kind: string;
  /** One line, taken from the CV. Nothing is added beyond what the CV says. */
  line: string;
  tech: string[];
  /** Internal case-study slug, when a fuller write-up exists. */
  slug?: string;
  live?: { label: string; href: string };
}

/**
 * Secondary work. These are listed from the CV only. A project moves out of
 * this list and into `projects.ts` once it has screenshots and a reviewed
 * write-up.
 */
export const moreBuilds: MoreBuild[] = [
  {
    title: "Python Network Port Scanner",
    kind: "Security tool",
    line: "A TCP connect scanner for hosts you own or are authorised to test, with a validated port range and two scan modes. Its known limitations are documented.",
    tech: ["Python", "socket"],
    slug: "python-port-scanner",
  },
  {
    title: "Interactive Villa VR",
    kind: "Interactive 3D",
    line: "A furnished 3D villa you can walk through on desktop or phone.",
    tech: ["A-Frame", "GLB/GLTF", "JavaScript"],
    slug: "interactive-villa-vr",
    live: { label: "Open the demo", href: "https://kwame607.github.io/interactive-villa-vr/" },
  },
  {
    title: "LAN Chat Application",
    kind: "Networking",
    line: "Real-time messaging over a local network using a client-server design.",
    tech: ["Python", "Socket programming"],
  },
  {
    title: "File Encryption and Security Simulation",
    kind: "Education",
    line: "An educational simulation for studying defensive security concepts and threat mitigation. A teaching exercise, not a tool for protecting real data.",
    tech: ["Cybersecurity"],
  },
  {
    title: "Student Management System",
    kind: "Database",
    line: "A CRUD-based management system with database integration and a modular structure.",
    tech: ["Python", "SQLite"],
  },
  {
    title: "Wisewave Enterprise website",
    kind: "Client website",
    line: "A business website with responsive layouts and interactive components, covering the company's travel, imports, fashion, money-transfer and consultancy services.",
    tech: ["HTML", "CSS", "JavaScript"],
  },
];
