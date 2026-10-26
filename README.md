# ADOM // OS

Interactive portfolio of **Kwame Emmanuel Adom**, built as a small desktop environment in the browser: windows, a dock, a controlled terminal, a browser/system overview, a safe security lab and network tools.

Stack: Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS 4, Zod, Lucide, Vitest + Testing Library, Playwright.

## Quick start

```bash
npm install
cp .env.example .env.local     # fill in contact details (see below)
npm run dev                    # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | Unit and component tests (Vitest) |
| `npm run test:e2e` | Playwright end-to-end and accessibility tests (needs `npx playwright install chromium` first) |
| `npm run check` | typecheck + lint + tests + build |

## Configuration

All variables are optional. Nothing here is a secret: `NEXT_PUBLIC_*` values are shipped to every visitor.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for sitemap, robots and Open Graph |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Shown in Contact/CV and used for the `mailto:` link. Empty means "not configured" is shown |
| `NEXT_PUBLIC_GITHUB_URL`, `NEXT_PUBLIC_LINKEDIN_URL` | Profile links. Empty means hidden |
| `NEXT_PUBLIC_STATIC_PREVIEW`, `NEXT_PUBLIC_BASE_PATH`, `NEXT_PUBLIC_BUILD_ID`, `NEXT_PUBLIC_APP_VERSION` | Set only by the GitHub Pages workflow (static preview). Leave unset everywhere else |
| `APP_VERSION` | Version shown in System Overview. Falls back to `package.json` |
| `BUILD_ID` | Build identifier (commit SHA). Falls back to `VERCEL_GIT_COMMIT_SHA`, `CF_PAGES_COMMIT_SHA`, `GITHUB_SHA`, else "not configured" |
| `DEPLOY_ENV` | Environment label. Falls back to `NODE_ENV` |

## Adding your content

- **CV PDF:** put it at `public/documents/Kwame-Emmanuel-Adom-CV.pdf`. The download button only appears when this file exists; otherwise the CV page says the PDF has not been supplied. The HTML CV is always available.
- **Projects:** edit `src/data/projects.ts`. Keep facts in `featuresVerified` / `technologiesVerified` only once confirmed; anything unconfirmed goes in `toDocument` / `technologiesToConfirm`. Add screenshots to `public/projects/` and set `src` on the screenshot entry (until then a labeled placeholder is shown, never a fake screenshot).
- **Education and experience:** edit `src/data/profile.ts` from your current CV and set `status: "verified"`.
- **Skills:** edit `src/data/skills.ts`. Each skill links to evidence; skills without evidence are flagged "evidence pending".
- **Security assessments:** add a record to `src/data/assessments/index.ts` (see the `SAMPLE-001` entry). Records are validated by `src/lib/security/assessment-schema.ts` when the app loads:
  - evidence must be `redacted: true`;
  - `retest-passed` requires documented retest evidence;
  - a `finding-identified` status requires a severity.
  Mark nothing "secure". Use the status vocabulary: not tested, tested with no issue observed, finding identified, remediation applied, retest passed, inconclusive. Keep full private reports out of the repo and publish a sanitized summary.

## Routes

`/` desktop · `/projects` · `/projects/[slug]` · `/skills` · `/security-lab` · `/network-tools` · `/about` · `/cv` · `/contact` · `/api/health` · `/api/system` · `/api/ip` · `/robots.txt` · `/sitemap.xml`

Every section also exists as a normal server-rendered page, so recruiters can reach it without the desktop, and the site works with JavaScript disabled (the intro overlay is hidden and a link list is shown).

## System Overview: what is and is not collected

Everything is read from the visitor's own browser using feature detection and standard APIs, shown to the visitor, and **not sent anywhere or stored**. Each value is labeled detected, inferred, unavailable or not requested.

- Browser and OS are **best-effort** (user-agent and Client Hints can be reduced or spoofed). Only a browser-reported platform is shown, never a claimed OS version unless Client Hints expose one.
- Screen size (the display) and viewport size (the page area) are shown separately.
- `navigator.onLine` is described as a browser flag, not proof of internet access.
- The **public IP lookup is opt-in** (button). It calls this site's own `/api/ip`, which reads the address from the request headers set by the hosting proxy. No third-party service is contacted, nothing is stored or logged by the app, responses are `no-store`, loopback/private addresses are never presented as a public IP, and the value is strictly validated as an IP before being echoed. It is not re-requested automatically.
- The **local (LAN) IP is not collected**. The site does not use WebRTC to gather addresses and does not scan or enumerate any network.
- `/api/system` exposes only: app name, version, build id, environment label, health, timestamp.

Hosting providers keep their own access logs; check your provider's retention settings and privacy policy.

## Security boundaries

- **Terminal:** a fixed registry of named commands (`src/lib/terminal/command-registry.ts`). Input is sanitized and used only as a lookup key. There is no endpoint that runs commands and no shell, file or env access. Unknown input returns "command not found".
- **Security Lab:** the port-scan demo replays a fixed dataset against reserved documentation addresses (RFC 5737) and is labeled SIMULATION. There is no real scanning code and no way to target a third-party host. If you build a real scanner for your own lab, keep it out of this deployment and enforce a target allowlist.
- **Network Tools:** local calculations only. No DNS, port, or TLS probing of arbitrary targets.
- **Headers:** CSP, `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy` (camera, microphone, geolocation, etc. disabled), COOP, and HSTS in production (`next.config.ts`). The CSP allows `'unsafe-inline'` scripts because Next.js inlines bootstrap scripts; tightening this needs a per-request nonce via middleware.
- **No contact form:** none is shown because no message-handling backend is configured. Contact is via `mailto:` and profile links.

## GitHub Pages preview

`.github/workflows/pages.yml` publishes a static preview to `https://kwame607.github.io/CRAZYCV/` on every push to `main` (enable it once under Settings → Pages → Source: GitHub Actions). The workflow runs typecheck, lint and tests, removes `src/app/api` for that build only, and builds with `GITHUB_PAGES=true`. In the preview:

- there is no server, so System Overview labels the server rows "Not available in this static preview" and the public-IP button is disabled (version and build id are baked in at build time);
- security headers cannot be set, so the CSP and related headers in `next.config.ts` only apply on a real Next.js host;
- owner-facing notes on project pages are visible; they are hidden in production builds.

## Deployment

The app is a standard Next.js server app with route handlers, so use a host that runs Next.js (for example Vercel, or Cloudflare via the OpenNext adapter). Set the environment variables above, run `npm run build`, and verify `/api/health` returns `{"status":"ok"}`. Check the provider's current free-tier limits. On hosts that do not forward the client address, `/api/ip` returns "could not be determined" and the UI shows "Not retrieved".

## Known gaps

See the summary in the project hand-off: missing real assets and unverified facts are listed there and flagged inside the app.
