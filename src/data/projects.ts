import type { Project } from "@/types/portfolio";

const placeholder = (what: string) => ({
  src: null,
  alt: `Placeholder: ${what} (real screenshot not yet supplied)`,
  neededNote: `Add a real screenshot of ${what} to /public/projects and set its path in src/data/projects.ts.`,
});

/**
 * Project data. Details were read from the owner's source repositories and
 * package manifests (named in each "evidenceNote"). "Present in source" means
 * the route, page or dependency exists; it is not a claim about production
 * behavior. No security testing has been done against any live site.
 */
export const projects: Project[] = [
  {
    slug: "adepamarket",
    title: "AdepaMarket",
    tagline: "Ghanaian multi-vendor marketplace for handmade fashion",
    status: "Live (owner-reported); source reviewed",
    featured: true,
    overview:
      "A Ghanaian multi-vendor marketplace focused on handmade fashion, including clothing, footwear, and accessories. Each seller gets their own storefront, and sellers and administrators have separate management areas.",
    problem:
      "Local makers need a place to present and sell handmade fashion online, and the marketplace needs tools to onboard sellers, take orders and moderate the catalogue.",
    role: "Developer and repository owner (specific responsibilities to be added by the owner).",
    technologiesVerified: [
      "Next.js, React and TypeScript",
      "Tailwind CSS",
      "Cloudflare Workers, deployed with the OpenNext adapter and Wrangler",
      "Cloudflare D1 database (binding in the Wrangler config) with Drizzle ORM",
      "Paystack (payment provider referenced throughout checkout and seller code)",
      "Cloudinary SDK (image handling dependency)",
      "jose (JWT sessions) and bcryptjs (password hashing)",
      "Resend (email), Sentry (error monitoring), Framer Motion",
      "Vitest (20 test files)",
    ],
    technologiesToConfirm: [],
    featuresVerified: [
      "Public shop, stores directory, per-seller storefront and product pages, and a wishlist",
      "Per-store checkout and order pages",
      "Seller portal: sign-up with email verification, login, password reset, dashboard, products, orders, earnings, reviews and settings",
      "Admin area: dashboard, orders, products, reviews, sellers and earnings",
      "Review page reachable by a tokenised link",
      "Seller terms, terms and privacy pages",
    ],
    evidenceNote:
      "Read from the private repository kwame607/adepamarket (package.json, route and page names, Wrangler binding types). Not tested against the live site.",
    toDocument: [
      "Architecture diagram (storefront, seller portal, admin, D1, payments, images)",
      "End-to-end payment and order flow",
      "Image delivery: both a Cloudinary dependency and uploaded product images exist in the repository, so the actual approach needs a short write-up",
      "Seller onboarding and moderation workflow",
      "Real screenshots",
      "A documented, authorized security assessment of the live site",
    ],
    decisions: [],
    challenges: [],
    learned: [],
    security: [
      "Observations from reading the source, not a security assessment: passwords are hashed with bcryptjs; sessions use signed JWTs (jose); httpOnly and sameSite appear in cookie-setting code (2 files); a rate-limiting helper is referenced in 13 source files; 20 automated test files exist.",
      "Nothing has been tested against the live site. No finding, fix or retest is claimed.",
    ],
    links: [{ label: "Live site", href: "https://adepamarket.admunz.workers.dev/" }],
    screenshots: [placeholder("the AdepaMarket home page")],
    ownerNotes: [
      "The repository is private, so no source link is shown. Add one here if you make it public.",
      "Confirm you are happy listing this stack summary publicly.",
      "Real screenshots are needed; I could not capture any from this environment.",
    ],
  },
  {
    slug: "admunz-data-hub",
    title: "Admunz Data Hub",
    tagline: "Digital-services platform for automated data bundle sales",
    status: "Live (owner-reported); source reviewed",
    featured: true,
    overview:
      "An online digital-services platform focused on automated data bundle sales, customer onboarding, and digital transactions. It includes agent accounts with their own storefronts, a wallet, order tracking and an administrative back office.",
    problem:
      "Selling data bundles by hand is slow and error-prone. The platform automates ordering, payment and fulfilment, and lets resellers (agents) run their own stores on top of it.",
    role: "Developer and repository owner (specific responsibilities to be added by the owner).",
    technologiesVerified: [
      "Next.js 14, React 18 and TypeScript",
      "Supabase (database and auth client libraries)",
      "Paystack (API routes and a webhook handler)",
      "Resend (email)",
      "Zod (input validation), Chart.js and qrcode",
      "Tailwind CSS 3",
      "Integrations with three upstream data-bundle providers (separate route groups)",
    ],
    technologiesToConfirm: ["Hosting platform for the live site"],
    featuresVerified: [
      "Agent accounts: registration, login, password change, profile and logo upload",
      "Agent storefronts at /store/[slug] with agent-set prices and sub-agent pricing",
      "Agent dashboard with wallet, withdrawals, referrals and support",
      "Order tracking by reference or phone number, and receipt pages",
      "Admin area: price management and recommendations, provider selection, broadcast messages, Paystack reconciliation, bulk order retry and referral settings",
      "Scheduled jobs: daily and weekly summaries, reconciliation, wallet checks and provider polling",
      "Networks referenced in code: MTN, Telecel and AirtelTigo",
    ],
    evidenceNote:
      "Read from the public repository kwame607/AM-Dataflow (package name dataflow-gh). Its README and logo component are titled ADMUNZ, so DataFlow Ghana is shown here as the same product rather than a separate one. Not tested against the live site.",
    toDocument: [
      "Architecture diagram (agents, wallet, Paystack, upstream providers, cron jobs)",
      "Payment and fulfilment flow, including failure and reconciliation handling",
      "Deployment and maintenance",
      "Real screenshots",
      "A documented, authorized security assessment of the live site",
    ],
    decisions: [],
    challenges: [],
    learned: [],
    security: [
      "Observations from reading the source, not a security assessment: the Paystack webhook handler contains signature-verification code (HMAC and timing-safe comparison); Zod validation is imported in 2 files; rate limiting is referenced in 12 files; no .env file is committed and a simple pattern search found no obvious keys (a quick search, not a secret-scanning audit).",
      "Nothing has been tested against the live site. No finding, fix or retest is claimed.",
    ],
    links: [
      { label: "Live site", href: "https://www.admunz.com/" },
      { label: "Source on GitHub", href: "https://github.com/kwame607/AM-Dataflow" },
    ],
    screenshots: [placeholder("the Admunz Data Hub storefront and agent dashboard")],
    ownerNotes: [
      "Please confirm DataFlow Ghana and Admunz are the same product (inferred from the repository). If DataFlow Ghana is separately deployed, say so and it can get its own entry.",
      "The repository README is a patch note ('Three Fixes'), not project documentation. A real README would strengthen this entry.",
      "The repository contains two stray files that look like accidental shell output: app/store/[slug]/dataflow-gh@0.1.0 and app/store/[slug]/next.",
      "Zod validation appears in only 2 files; worth checking that the other API routes validate input some other way.",
      "Real screenshots are needed; I could not capture any from this environment.",
    ],
  },
  {
    slug: "python-port-scanner",
    title: "Python Network Port Scanner",
    tagline: "Interactive TCP connect scanner for authorized targets",
    status: "Source on GitHub; sample output pending",
    featured: true,
    overview:
      "A Python command-line tool that checks which TCP ports accept connections on a host the user chooses. It prompts for a hostname or IPv4 address, a port range, and a scan mode, then reports open ports.",
    problem:
      "Learning how services are exposed on a network means understanding how TCP connections succeed or fail. This tool is a hands-on way to explore that on systems you own or are authorized to test.",
    role: "Author (the README credits Kwame Emmanuel Adom).",
    technologiesVerified: [
      "Python 3 (README states 3.6 or newer)",
      "socket module from the standard library",
      "pyfiglet (banner) and ANSI colors for output",
      "colorama is listed in requirements.txt",
    ],
    technologiesToConfirm: [],
    featuresVerified: [
      "Accepts a hostname (resolved with socket.gethostbyname) or an IPv4 address (validated with socket.inet_pton)",
      "Validated port range between 1 and 65535",
      "Two modes: a built-in list of 14 common ports, or every port in the chosen range",
      "TCP connect scan using socket.connect_ex, with a 1 second timeout in common-ports mode and 0.1 second in full-range mode",
      "README includes a disclaimer to scan only systems you own or have permission to test",
    ],
    evidenceNote:
      "Read from the public repository kwame607/python-port-scanner (README, main.py, nocopyrightport_scanner.py, requirements.txt). The tool was read, not run, for this page.",
    limitations: [
      "Ports are scanned one at a time, so large ranges are slow.",
      "Any failed connection is reported as 'closed', so it cannot tell a refused connection from a filtered port or a timeout.",
      "It does not identify services: output shows port numbers only, and a port number is just a convention.",
      "Full-range mode prints only open ports, and its 0.1 second timeout can miss slow hosts (false negatives).",
      "Authorization is not enforced in code. It relies on the user and the README disclaimer.",
      "It prints a 'checking if the host is up' message, but no host-discovery step follows in the code I read.",
    ],
    toDocument: [
      "How the connect-scan technique works and why a completed handshake means 'open'",
      "Test methodology and a redacted sample run against your own lab host",
      "Planned improvements (concurrency, closed versus filtered, banner grabbing)",
    ],
    decisions: [],
    challenges: [],
    learned: [],
    security: [
      "Meant only for systems you own or are authorized to test. Nothing on this website runs the scanner.",
      "The Security Lab demo is a fixed, simulated dataset against reserved documentation addresses.",
    ],
    links: [{ label: "Source on GitHub", href: "https://github.com/kwame607/python-port-scanner" }],
    screenshots: [placeholder("redacted scanner output from a controlled lab")],
    ownerNotes: [
      "The README says to run menu.py, but the repository contains main.py (and a simpler nocopyrightport_scanner.py).",
      "Add a redacted sample run from your own lab to replace the placeholder.",
    ],
  },
  {
    slug: "other-projects",
    title: "More on GitHub",
    tagline: "Other repositories, not yet written up",
    status: "Not yet reviewed",
    overview:
      "Other repositories exist on the GitHub account, including a Python LAN chat application. They have not been reviewed for this site yet, so no features or technologies are claimed for them.",
    problem: "Each project will state its own problem once reviewed.",
    role: "To be confirmed.",
    technologiesVerified: [],
    technologiesToConfirm: [],
    featuresVerified: [],
    toDocument: ["LAN chat application", "Educational encryption simulation", "Student management system"],
    decisions: [],
    challenges: [],
    learned: [],
    security: ["Not assessed."],
    links: [
      { label: "python-lan-chat on GitHub", href: "https://github.com/kwame607/python-lan-chat" },
      { label: "All repositories", href: "https://github.com/kwame607?tab=repositories" },
    ],
    screenshots: [],
    ownerNotes: ["Tell me which of the other repositories should be featured and I will review and write them up."],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
