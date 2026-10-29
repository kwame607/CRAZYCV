import type { Project } from "@/types/portfolio";

/** A real screenshot supplied by the owner, stored under /public/projects. */
const dims: Record<string, [number, number]> = {
  "adepamarket-home.jpg": [1235, 783],
  "adepamarket-stores-new-arrivals.jpg": [1230, 782],
  "admunz-data-hub-storefront.jpg": [725, 778],
  "admunz-data-hub-agent-dashboard.jpg": [1280, 632],
  "city-beans-home.jpg": [1036, 778],
  "city-beans-menu.jpg": [1036, 778],
  "momo-fraud-shield-home.jpg": [1280, 633],
  "momo-fraud-shield-result.jpg": [711, 775],
  "port-scanner-scanme-run.jpg": [1600, 871],
  "villa-vr-exterior.jpg": [1600, 783],
  "solar-system-orbits.jpg": [1600, 783],
  "wisewave-home.jpg": [1600, 871],
  "wisewave-portfolio.jpg": [1600, 871],
  "lan-chat-client.jpg": [827, 779],
  "lan-chat-server.jpg": [854, 722],
};
const shot = (file: string, alt: string) => {
  const [w, h] = dims[file] ?? [1200, 800];
  return { src: `/projects/${file}`, alt, w, h };
};

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
    status: "Live",
    featured: true,
    overview:
      "A Ghanaian multi-vendor marketplace focused on handmade fashion, including clothing, footwear, and accessories. Each seller gets their own storefront, and sellers and administrators have separate management areas.",
    problem:
      "Local makers need a place to present and sell handmade fashion online, and the marketplace needs tools to onboard sellers, take orders and moderate the catalogue.",
    role: "Web developer, 2026 to present (per CV). Built the responsive marketplace interfaces and deployed it on Cloudflare Workers. Built with AI assistance; I do not claim to have hand-written all of the code.",
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
    featuresVerified: [
      "Public shop, stores directory, per-seller storefront and product pages, and a wishlist",
      "Per-store checkout and order pages",
      "Seller portal: sign-up with email verification, login, password reset, dashboard, products, orders, earnings, reviews and settings",
      "Admin area: dashboard, orders, products, reviews, sellers and earnings",
      "Review page reachable by a tokenised link",
      "Seller terms, terms and privacy pages",
    ],
    evidenceNote:
      "Read from the project's source code (dependency list, route and page names, deployment configuration). Not tested against the live site.",
    decisions: [],
    challenges: [],
    learned: [],
    security: [
      "Observations from reading the source, not a security assessment: passwords are hashed with bcryptjs; sessions use signed JWTs (jose); httpOnly and sameSite appear in cookie-setting code (2 files); a rate-limiting helper is referenced in 13 source files; 20 automated test files exist.",
      "Nothing has been tested against the live site. No finding, fix or retest is claimed.",
    ],
    links: [{ label: "Live site", href: "https://adepamarket.admunz.workers.dev/" }],
    screenshots: [
      shot("adepamarket-home.jpg", "AdepaMarket home page: search bar, category navigation and a hero banner reading \"Discover your next favourite look\"."),
      shot("adepamarket-stores-new-arrivals.jpg", "AdepaMarket home page further down: a Stores to Explore row and a New Arrivals grid of accessories with prices in Ghana cedis."),
    ],
  },
  {
    slug: "admunz-data-hub",
    title: "Admunz Data Hub",
    tagline: "Digital-services platform for automated data bundle sales",
    status: "Live",
    featured: true,
    overview:
      "An online digital-services platform focused on automated data bundle sales, customer onboarding, and digital transactions. It includes agent accounts with their own storefronts, a wallet, order tracking and an administrative back office.",
    problem:
      "Selling data bundles by hand is slow and error-prone. The platform automates ordering, payment and fulfilment, and lets resellers (agents) run their own stores on top of it.",
    role: "Founder and full-stack web developer, 2026 to present (per CV). Built the platform and handles APIs, payment integrations, backend services, deployment and ongoing improvements. Built with AI assistance; I do not claim to have hand-written all of the code.",
    technologiesVerified: [
      "Next.js 14, React 18 and TypeScript",
      "Supabase (database and auth client libraries)",
      "Paystack (API routes and a webhook handler)",
      "Resend (email)",
      "Zod (input validation), Chart.js and qrcode",
      "Tailwind CSS 3",
      "Integrations with three upstream data-bundle providers (separate route groups)",
    ],
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
      "Read from the project's source code (dependency list, routes, components). DataFlow Ghana is the working name of this same product, confirmed by the owner, so it is not listed separately. Not tested against the live site.",
    decisions: [],
    challenges: [],
    learned: [],
    security: [
      "Observations from reading the source, not a security assessment: the Paystack webhook handler contains signature-verification code (HMAC and timing-safe comparison); Zod validation is imported in 2 files; rate limiting is referenced in 12 files; no .env file is committed and a simple pattern search found no obvious keys (a quick search, not a secret-scanning audit).",
      "Nothing has been tested against the live site. No finding, fix or retest is claimed.",
    ],
    links: [{ label: "Live site", href: "https://www.admunz.com/" }],
    screenshots: [
      shot("admunz-data-hub-storefront.jpg", "Admunz Data Hub storefront: MTN, AirtelTigo and Telecel data bundle options and a Become a Reseller Agent button."),
      shot("admunz-data-hub-agent-dashboard.jpg", "Admunz Data Hub agent dashboard overview showing order and earnings totals, an AI performance coach and a WhatsApp message generator."),
    ],
  },
  {
    slug: "city-beans",
    title: "City Beans",
    tagline: "Restaurant ordering site with online payment, delivery zones and an admin panel",
    status: "Live",
    featured: true,
    overview:
      "A restaurant website where customers browse the menu, order online, pay, and follow their order, backed by an admin area for running orders, products, riders and delivery.",
    problem:
      "A restaurant needs a simple way to take and track orders online, accept payment, and manage delivery without handling everything by hand.",
    role: "Website developer and graphic designer on a freelance, project basis, 2026 to present (per CV). Designed and built the restaurant's website and created branding and promotional graphics. Built with AI assistance; I do not claim to have hand-written all of the code.",
    technologiesVerified: [
      "React, built with Vite (JavaScript/JSX)",
      "Tailwind CSS and Lucide icons",
      "React Router",
      "Supabase (JavaScript client; database functions and an Edge Function)",
      "Paystack (payment hook and public key usage in the client)",
      "GitHub Actions deployment to GitHub Pages",
    ],
    featuresVerified: [
      "Menu loaded from a database: products, categories, extras and per-product extras",
      "Cart and checkout, with delivery zones",
      "Order creation, payment initialisation and order-status lookup through database functions",
      "Payment verification through a server-side Supabase Edge Function",
      "Order tracking for customers, and payment result screens (not completed, still confirming, error)",
      "Admin area with login: orders, products, riders and delivery management",
    ],
    evidenceNote:
      "Read from the project's source code (dependency list, source files, database table and function names). Not tested against the live site.",
    decisions: [],
    challenges: [],
    learned: [],
    security: [
      "Observations from reading the source, not a security assessment: payment verification runs in a server-side function rather than in the browser, and order creation and lookup go through database functions. The admin route has a client-side guard, so real protection depends on the database access rules, which have not been reviewed here.",
      "Nothing has been tested against a live site. No finding, fix or retest is claimed.",
    ],
    links: [{ label: "Live site", href: "https://kwame607.github.io/city-beans/" }],
    screenshots: [
      shot("city-beans-home.jpg", "City Beans home page: hero banner reading \"Your favourite Ghanaian meals made fresh\" with Order Now and Explore Menu buttons."),
      shot("city-beans-menu.jpg", "City Beans menu: meal category filters, a search box and meal cards with prices in Ghana cedis and Add and Customize buttons."),
    ],
  },
  {
    slug: "momo-fraud-shield",
    title: "MoMo Fraud Shield",
    tagline: "Machine-learning web app that flags likely mobile money fraud and explains why",
    status: "Prototype · final-year project",
    featured: true,
    overview:
      "A Flask web application where a user pastes a message (an SMS, a summary of a call, or a social-media message) and gets an estimated fraud probability, a Low, Medium or High risk level, the suspicious wording it found, the words that most influenced the result, and a plain-language safety recommendation. It was my final-year project: an AI-based system for detecting impersonation and mobile money-related social engineering fraud.",
    problem:
      "Mobile money scams rely on impersonation, urgency and requests for a PIN or OTP. People need a fast check that also explains itself, so they can learn the warning signs rather than just trust a score.",
    role: "Author of my final-year project (per CV).",
    technologiesVerified: [
      "Python and Flask (served with gunicorn)",
      "scikit-learn: TF-IDF text features, Logistic Regression, Support Vector Machine and Random Forest",
      "pandas, NumPy and SciPy",
      "LIME for word-level explanations",
      "HTML, CSS and JavaScript front end",
    ],
    featuresVerified: [
      "Estimated fraud probability and a Low, Medium or High risk category, with thresholds calibrated by cross-validation",
      "Detection of linguistic indicators such as urgency, requests for a PIN or OTP, authority claims and reward framing",
      "LIME explanation showing which words pushed the prediction",
      "Plain-language recommendation for what to do next",
      "Three models trained and compared on a 9,447-message dataset, with Logistic Regression deployed",
      "Held-out test results: 98.3% recall (475 of 483 frauds caught), 99.2% precision and 99.0% accuracy on 1,165 test messages, with 8 missed frauds and 4 false alarms",
    ],
    evidenceNote:
      "Read from the project's source code and README. The test results above were reproduced by re-running the project's training script on its dataset (the project pins scikit-learn 1.8.0; the re-run used a newer release), and they match the figures on the CV.",
    limitations: [
      "The scores come from a held-out split of the same dataset. They say nothing yet about messages from other sources or new scam styles, so they are prototype results, not real-world performance.",
      "The dataset is built from message templates, and the project does not document how much of it is synthetic versus real, so it should not be read as a measure of performance on live traffic.",
      "A high-risk result is an estimate, not proof. It is meant to support a person's judgement, not replace it.",
    ],
    decisions: [
      "Chose the deployed model by recall, because a missed fraud costs more than an unnecessary warning.",
      "Split train, validation and test sets by message template, so near-duplicate messages cannot leak between them and inflate the scores.",
      "Removed a feature (double-space count) after investigating it, because it could dominate a decision on its own.",
    ],
    challenges: [],
    learned: [],
    security: [
      "The app processes message text pasted by users on a Flask server. Input handling, rate limiting and data retention have not been reviewed here.",
    ],
    links: [],
    screenshots: [
      shot("momo-fraud-shield-home.jpg", "MoMo Fraud Shield home screen: a box to paste a message, example buttons and a three-step explanation."),
      shot("momo-fraud-shield-result.jpg", "MoMo Fraud Shield result for one message: a Low risk label, an estimated fraud likelihood of 12.4 percent, reasons, and the words that most influenced the result."),
    ],
  },
  {
    slug: "python-port-scanner",
    title: "Python Network Port Scanner",
    tagline: "Interactive TCP connect scanner for authorized targets",
    status: "Built · tested on a permitted target",
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
    featuresVerified: [
      "Accepts a hostname (resolved with socket.gethostbyname) or an IPv4 address (validated with socket.inet_pton)",
      "Validated port range between 1 and 65535",
      "Two modes: a built-in list of 14 common ports, or every port in the chosen range",
      "TCP connect scan using socket.connect_ex, with a 1 second timeout in common-ports mode and 0.1 second in full-range mode",
      "README includes a disclaimer to scan only systems you own or have permission to test",
    ],
    evidenceNote:
      "Read from the tool's source code and README. The terminal capture is a real run against scanme.nmap.org, supplied by the owner.",
    limitations: [
      "Ports are scanned one at a time, so large ranges are slow.",
      "Any failed connection is reported as 'closed', so it cannot tell a refused connection from a filtered port or a timeout.",
      "It does not identify services: output shows port numbers only, and a port number is just a convention.",
      "Full-range mode prints only open ports, and its 0.1 second timeout can miss slow hosts (false negatives).",
      "Authorization is not enforced in code. It relies on the user and the README disclaimer.",
      "It prints a 'checking if the host is up' message, but no host-discovery step follows in the code reviewed.",
    ],
    decisions: [],
    challenges: [],
    learned: [],
    security: [
      "Meant only for systems you own or are authorized to test. Nothing on this website runs the scanner.",
      "The Security Lab demo is a fixed, simulated dataset against reserved documentation addresses.",
    ],
    links: [],
    screenshots: [
      shot("port-scanner-scanme-run.jpg", "Terminal capture of the scanner running against scanme.nmap.org, ports 1 to 100 in common-ports mode: ports 21, 22 and 80 reported open and 20, 23, 25 and 53 reported closed."),
    ],
    run: {
      target: "scanme.nmap.org (45.33.32.156)",
      authorization:
        "scanme.nmap.org is published by the Nmap project as a host people may practise scanning against, and asks users to keep it light. A short port range was used.",
      mode: "Host name mode, ports 1 to 100, common-ports mode. Seven of the built-in common ports fall in that range, so seven ports were tried.",
      observed: ["Reported open: 21, 22 and 80", "Reported closed: 20, 23, 25 and 53"],
      limits: [
        "Only seven ports were tried, so this says nothing about the rest of the host.",
        "The tool prints 'closed' for any failed connection, so closed, filtered and timed-out ports look the same.",
        "Open means a TCP connection completed. The services behind 21, 22 and 80 (FTP, SSH and HTTP by convention) were not identified.",
        "The capture carries no date, so none is stated.",
      ],
      screenshot: 0,
    },
  },
  {
    slug: "pentest-home-lab",
    title: "Penetration Testing Home Lab",
    tagline: "Isolated Kali Linux lab for practicing reconnaissance and vulnerability assessment",
    status: "Isolated home lab",
    overview:
      "An isolated home lab built with Kali Linux and deliberately vulnerable targets (Metasploitable 2) to practice network reconnaissance, service enumeration and vulnerability assessment aligned with OWASP Top 10 categories, in preparation for web application security and bug bounty work.",
    problem: "Security skills need a safe, legal place to practice, so the lab is isolated and uses targets that are meant to be attacked.",
    role: "Builder and sole user (per CV).",
    technologiesVerified: [],
    featuresVerified: [],
    evidenceNote:
      "From the owner's CV. No lab notes, screenshots or reports have been published yet, so nothing on this page is evidence of specific results.",
    decisions: [],
    challenges: [],
    learned: [],
    security: [
      "Lab-only. All targets are deliberately vulnerable machines in an isolated environment. Nothing here was run against a third-party system.",
    ],
    links: [],
    screenshots: [],
  },
  {
    slug: "interactive-villa-vr",
    title: "Interactive Villa VR",
    tagline: "A walk-through 3D villa that runs in the browser, built with A-Frame",
    status: "Live demo",
    overview:
      "An interactive 3D villa environment with a modern house, swimming pool, gym, garden, vehicle and furniture, explorable on desktop and on a phone.",
    problem:
      "A hands-on exercise in interactive 3D on the web: composing a scene, bringing in GLB/GLTF assets, and making movement and camera control work for both mouse-and-keyboard and touch.",
    role: "Author. Developed and deployed the experience (per CV).",
    technologiesVerified: ["A-Frame", "HTML5, CSS and JavaScript", "GLB/GLTF 3D assets"],
    featuresVerified: [
      "Desktop movement and camera-look controls",
      "Mobile touch controls for navigation and camera movement",
      "A furnished scene: modern house, swimming pool, gym, garden, vehicle and furniture",
    ],
    evidenceNote: "From the CV. The source code was not reviewed for this page.",
    decisions: [],
    challenges: [],
    learned: [],
    security: ["A static front-end scene with no accounts or user data. Not assessed."],
    links: [{ label: "Live demo", href: "https://kwame607.github.io/interactive-villa-vr/" }],
    screenshots: [shot("villa-vr-exterior.jpg", "The villa demo in a browser at dusk: a two-storey modern house with a glass front, a gym building on the left, a swimming pool behind and a vintage car on a grass lawn.")],
  },
  {
    slug: "lan-chat",
    title: "LAN Chat Application",
    tagline: "A two-party terminal chat over TCP sockets, written in Python",
    status: "Built · Python",
    overview:
      "A terminal chat where a server waits for a connection, a client connects, each side enters a name, and messages appear on the other side with a timestamp until someone types exit.",
    problem:
      "A hands-on way to learn how two programs find each other and exchange data over a network: opening sockets, connecting, and sending and receiving messages.",
    role: "Author (per CV). Built the real-time messaging application using a client-server design.",
    technologiesVerified: ["Python", "Socket programming (TCP)"],
    featuresVerified: [
      "Client-server architecture over sockets (per CV)",
      "A server that waits for a connection and reports who connected",
      "Each side enters a display name; messages show the sender and a timestamp",
      "Typing exit ends the session",
      "Coloured status messages and a banner in the terminal",
    ],
    limitations: [
      "The captured session runs on loopback (127.0.0.1), with both programs on one machine. Running it across two machines on a network is what it is built for, but that is not shown here.",
      "The capture shows one client talking to the server. Handling several clients at once is not shown and is not claimed.",
      "No encryption or authentication is described or shown, so treat the conversation as plain text.",
    ],
    evidenceNote: "From the CV and two terminal captures supplied by the owner (the client and the server). The source code was not reviewed.",
    decisions: [],
    challenges: [],
    learned: [],
    security: ["Not assessed. Nothing about authentication or encryption is claimed."],
    links: [],
    screenshots: [
      shot("lan-chat-client.jpg", "The chat client in a terminal: a banner, a connected message, a name prompt, and a short timestamped conversation that ends with the exit command."),
      shot("lan-chat-server.jpg", "The chat server in a terminal: a server-on message, a connection from 127.0.0.1, the same short conversation seen from the other side, and the exit command."),
    ],
  },
  {
    slug: "wisewave-enterprise",
    title: "Wisewave Enterprise",
    tagline: "A responsive business website for a technology and education services company",
    status: "Live",
    overview:
      "A business website with Home, Services, About and Reviews sections. Its landing page introduces the company and presents an Enterprise Solutions Portfolio of three service cards: Enterprise Computing Solutions, Professional Accessories and Smart Technology Solutions.",
    problem:
      "A company needs a website that explains what it offers clearly and works on any screen.",
    role: "Web developer, 2025 to present (per CV). Developed the website, organised its content to present the company's offerings, and implemented responsive layouts and interactive components.",
    technologiesVerified: ["Responsive front-end website", "Hosted on GitHub Pages"],
    featuresVerified: [
      "Navigation across Home, Services, About and Reviews",
      "A full-width hero with the company introduction",
      "An Enterprise Solutions Portfolio of three service cards with feature tags",
    ],
    evidenceNote: "From the CV and two screenshots of the live site supplied by the owner. The source code was not reviewed.",
    decisions: [],
    challenges: [],
    learned: [],
    security: ["A static content website with no accounts. Not assessed."],
    links: [{ label: "Live site", href: "https://kwame607.github.io/wiseewave/" }],
    screenshots: [
      shot("wisewave-home.jpg", "Wisewave Enterprise home page: a blue navigation bar with Home, Services, About and Reviews, and a hero reading Empowering Your Digital Future over a blurred photo of electronics."),
      shot("wisewave-portfolio.jpg", "Wisewave Enterprise Enterprise Solutions Portfolio: three cards for Enterprise Computing Solutions, Professional Accessories and Smart Technology Solutions, each with tags."),
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
