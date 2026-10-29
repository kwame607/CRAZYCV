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
    title: "Interactive Villa VR",
    kind: "Interactive 3D",
    line: "A furnished 3D villa you can walk through on desktop or phone.",
    tech: ["A-Frame", "GLB/GLTF", "JavaScript"],
    slug: "interactive-villa-vr",
    live: { label: "Open the demo", href: "https://kwame607.github.io/interactive-villa-vr/" },
    image: { src: "/projects/villa-vr-exterior.jpg", alt: "The villa demo at dusk: a two-storey modern house, a gym building, a pool and a vintage car on a lawn.", w: 1600, h: 783 },
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
  {
    title: "AdepaMarket",
    kind: "Web product · AI-assisted",
    line: "A Ghanaian multi-vendor marketplace for handmade fashion, with seller storefronts and admin tools. Built with AI assistance, and live.",
    tech: ["Next.js", "TypeScript", "Cloudflare Workers"],
    slug: "adepamarket",
    live: { label: "Open the site", href: "https://adepamarket.admunz.workers.dev/" },
    image: { src: "/projects/adepamarket-home.jpg", alt: "AdepaMarket home page with a search bar, category navigation and a hero banner reading Discover your next favourite look.", w: 1235, h: 783 },
  },
  {
    title: "Admunz Data Hub",
    kind: "Web product · AI-assisted",
    line: "A digital-services platform for automated data bundle sales, with agent accounts, a wallet and an admin back office. Built with AI assistance, and live.",
    tech: ["Next.js", "TypeScript", "Supabase"],
    slug: "admunz-data-hub",
    live: { label: "Open the site", href: "https://www.admunz.com/" },
    image: { src: "/projects/admunz-data-hub-storefront.jpg", alt: "Admunz Data Hub storefront showing MTN, AirtelTigo and Telecel data bundle options.", w: 725, h: 778 },
  },
  {
    title: "City Beans",
    kind: "Client website · AI-assisted",
    line: "A restaurant ordering site with online payment, delivery zones and an admin panel. Built with AI assistance.",
    tech: ["React", "JavaScript", "Supabase"],
    slug: "city-beans",
    image: { src: "/projects/city-beans-home.jpg", alt: "City Beans home page with a hero banner reading Your favourite Ghanaian meals made fresh.", w: 1036, h: 778 },
  },
];
