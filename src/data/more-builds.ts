export interface MoreBuild {
  title: string;
  kind: string;
  /** One line. Only what the CV, the owner or a real screenshot supports. */
  line: string;
  tech: string[];
  /** Internal case-study slug, when a fuller write-up exists. */
  slug?: string;
  live?: { label: string; href: string };
  /** A real screenshot under /public/projects. */
  image?: { src: string; alt: string; w: number; h: number };
}

/**
 * Secondary work. A project here has a smaller card; one with a `slug` also has
 * its own case-study page in `projects.ts`.
 */
export const moreBuilds: MoreBuild[] = [
  {
    title: "Student Management System",
    kind: "Database",
    line: "A CRUD-based management system with database integration and a modular structure.",
    tech: ["Python", "SQLite"],
  },
  {
    title: "Solar System",
    kind: "Interactive 3D",
    line: "A 3D solar-system scene in the browser: a labelled Sun and planets on orbit paths against a starfield.",
    tech: ["A-Frame"],
    live: { label: "Open the demo", href: "https://kwame607.github.io/solar-system/" },
    image: { src: "/projects/solar-system-orbits.jpg", alt: "The solar-system demo: a glowing Sun and a row of labelled planets from Mercury to Neptune on curved orbit lines in space.", w: 1600, h: 783 },
  },
  {
    title: "Wisewave Enterprise website",
    kind: "Client website",
    line: "A responsive business website with Home, Services, About and Reviews, and a portfolio of three service cards.",
    tech: ["Responsive front end", "GitHub Pages"],
    slug: "wisewave-enterprise",
    live: { label: "Open the site", href: "https://kwame607.github.io/wiseewave/" },
    image: { src: "/projects/wisewave-home.jpg", alt: "Wisewave Enterprise home page with the hero Empowering Your Digital Future.", w: 1600, h: 871 },
  },
];
