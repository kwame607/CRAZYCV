# Inside Kwame's Mind

Portfolio of **Kwame Emmanuel Adom**: full-stack developer, cybersecurity learner, Kumasi, Ghana.

It opens with a scroll-driven "Welcome to my mind" sequence: a procedural neural brain you travel *through*, then a normal, fast portfolio. Design notes and what was (and wasn't) learned from the reference are in [`docs/INTERACTION-DESIGN.md`](docs/INTERACTION-DESIGN.md).

Stack: Next.js 16 (App Router, static export for GitHub Pages), React 19, TypeScript (strict), Tailwind CSS 4, Zod, Vitest, Playwright. **No animation or 3D library**: the intro is Canvas 2D with a hand-written projection.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run check` | typecheck + lint + unit tests + production build |
| `npm test` | Vitest unit and component tests |
| `npm run test:e2e` | Playwright + axe (needs `npx playwright install chromium`) |

## Deploy (GitHub Pages)

`.github/workflows/pages.yml` runs typecheck, lint and tests, removes `src/app/api` for that build only (Pages has no server), then exports with `GITHUB_PAGES=true` and base path `/CRAZYCV`. Enable it once under *Settings → Pages → Source: GitHub Actions*. Every asset URL goes through `withBase()` or Next's `Link`, so nothing breaks under `/CRAZYCV/`.

To run the Pages build locally:

```bash
mv src/app/api /tmp/api-bak
GITHUB_PAGES=true NEXT_PUBLIC_STATIC_PREVIEW=true NEXT_PUBLIC_BASE_PATH=/CRAZYCV npx next build
mv /tmp/api-bak src/app/api
npx serve out -l 4173   # then serve it under a /CRAZYCV/ prefix to match Pages
```

On a Node host (Vercel, Cloudflare via OpenNext) the `/api/ip`, `/api/system` and `/api/health` routes and the security headers in `next.config.ts` apply. On Pages they don't, and the UI says so.

## How the intro works

* `src/lib/experience/timeline.ts`: pure functions mapping scroll progress to camera, caption opacity and ignition. Unit-tested.
* `src/lib/experience/mind.ts`: builds the brain once (about 1,350 points, k-nearest links, deterministic seed) and draws a frame with no per-frame allocation. Unit-tested.
* `src/components/experience/IntroStage.tsx`: a 420vh runway with a sticky stage. **Scrolling stays native**; the loop reads progress and draws. It runs only while on screen, writes straight to canvas/DOM (no React re-render per frame), and **steps its own quality down** (no additive blending or pulses, lower pixel ratio, half frame rate) if real frame times are poor.
* **Skip intro** is the second tab stop. **Scroll to enter / Tap to enter** plays the journey automatically; any wheel, touch or key press hands control back. Esc skips.
* The intro is remembered (`localStorage`, set before first paint, so no flash). Returning visitors and deep links (`/#work`) never replay it. **Replay intro** is in the nav, footer and terminal (`replay`).
* `prefers-reduced-motion`: the runway is one still screen, no animation loop, all content unchanged.
* No JavaScript: the runway is hidden and the whole portfolio is plain server-rendered HTML. If hydration stalls for 6 s, hidden reveal content is forced visible.
* Canvas unavailable: a CSS glow replaces the brain; captions and controls still work.

## Content rules

The old site's honesty rules are kept and enforced by tests:

* Project data is in `src/data/projects.ts`: features and technologies only once confirmed from source or the CV. Screenshots are real files in `public/projects/`. No placeholder images, no fabricated metrics.
* Skills (`src/data/skills.ts`) carry an evidence level **derived from their links**: *In shipped work*, *Lab practice*, or *Learning*. C++, Django, FastAPI, Burp Suite, DNS/HTTP, remediation and retesting currently have no linked evidence and show as **Learning**.
* Security: real vs simulated is explicit. **Published real assessments: 0.** The assessment record is a labelled sample; the port-scan replay is a simulation against RFC 5737 addresses. Nothing on the site scans a third party.
* Certifications: only *Introduction to Cybersecurity* is shown as earned. *Ethical Hacking* is shown as continuing study, because the CV states only the former as completed.
* Open questions and to-dos that used to sit inside the public data bundle now live in [`docs/OWNER-NOTES.md`](docs/OWNER-NOTES.md).

## Terminal and system overview

The terminal is a fixed registry (`src/lib/terminal/command-registry.ts`): `help about whoami projects [name] skills experience education security network [ip] system browser cv [download] contact github open <section> replay clear`. Input is sanitised and used only as a lookup key. There is no shell, file, env or network access; only `network ip` can call this site's own `/api/ip`, and only when typed.

The system overview shows only what the visitor's browser exposes, each value labelled *detected*, *inferred* or *unavailable*. Nothing is sent or stored. The public-IP lookup is opt-in and disabled on the static build. No WebRTC/LAN probing.

## Routes

`/` (the experience) · `/projects` · `/projects/[slug]` · `/skills` · `/security-lab` · `/network-tools` · `/about` · `/cv` · `/contact`. The deep pages are plain server-rendered HTML, reachable directly and with JavaScript off.

## Configuration

All optional (`.env.example`). `NEXT_PUBLIC_CONTACT_EMAIL` defaults to the address in `src/data/profile.ts`.
