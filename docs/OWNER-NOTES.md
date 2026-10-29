# Owner notes (private)

These notes used to live inside `src/data/projects.ts`, which is bundled into the public site. They are for you, not for visitors.

Contents: open questions, to-do items for case-study write-ups, and things worth fixing in the source projects.

## adepamarket

**To document next**

- Architecture diagram (storefront, seller portal, admin, D1, payments, images)
- End-to-end payment and order flow
- Image delivery: both a Cloudinary dependency and uploaded product images exist in the repository, so the actual approach needs a short write-up
- Seller onboarding and moderation workflow
- A documented, authorized security assessment of the live site

**Notes**

- Confirm you are happy listing this stack summary publicly.

## admunz-data-hub

**Technologies to confirm**

- Hosting platform for the live site

**To document next**

- Architecture diagram (agents, wallet, Paystack, upstream providers, cron jobs)
- Payment and fulfilment flow, including failure and reconciliation handling
- Deployment and maintenance
- A documented, authorized security assessment of the live site

**Notes**

- The repository README is a patch note ('Three Fixes'), not project documentation. A real README would strengthen this entry.
- The repository contains two stray files that look like accidental shell output: app/store/[slug]/dataflow-gh@0.1.0 and app/store/[slug]/next.
- Zod validation appears in only 2 files; worth checking that the other API routes validate input some other way.

## city-beans

**To document next**

- Architecture diagram (React client, Supabase tables and functions, Paystack)
- Order and payment flow, including the failure and 'still confirming' paths
- How admin access is enforced on the database side

**Notes**

- The live link uses the address you confirmed (with the hyphen). I could not load it from my environment, so please click it once to check.

## momo-fraud-shield

**To document next**

- How the dataset was built and labelled, and what share is synthetic
- The full list of engineered features and why each was added
- Testing on messages collected independently of the training data
- A public demo, if you want one

**Notes**

- The project's README still describes an earlier SVM version (1,448 messages, recall 0.95). The code and CV describe the current Logistic Regression version. Updating the README would avoid confusion.
- Compiled .pyc files are committed in the repository.
- If this is deployed anywhere, add the link so visitors can try it.

## python-port-scanner

**To document next**

- How the connect-scan technique works and why a completed handshake means 'open'
- Test methodology and a redacted sample run against your own lab host
- Planned improvements (concurrency, closed versus filtered, banner grabbing)

**Notes**

- The README says to run menu.py, but the repository contains main.py (and a simpler nocopyrightport_scanner.py).
- Add a redacted sample run from your own lab to replace the placeholder.

## pentest-home-lab

**Technologies to confirm**

- Kali Linux
- Nmap
- Metasploit Framework
- Metasploitable 2
- Burp Suite (listed in CV skills)

**To document next**

- Lab network diagram
- A sanitized walkthrough of one assessment: scope, method, findings, severity and what was learned
- Redacted tool output in the Security Lab assessment format

**Notes**

- Send me lab notes or sanitized screenshots and I will turn them into a proper Security Lab record.

## other-projects

**To document next**

- LAN chat application (Python, socket programming)
- Interactive 3D villa experience (A-Frame, GLB/GLTF)
- Wisewave Enterprise website
- Educational encryption simulation
- Student management system (Python, SQLite)

**Notes**

- Tell me which of these should be featured and I will review and write them up.

## Items that were removed from the site because they were stubs

- "More projects" (LAN chat application, educational encryption simulation, student management system, Wisewave website) is now the "More builds" list in `src/data/more-builds.ts`, using only what the CV says about each.

## To confirm (added with the scanme, Solar System, LAN chat and Wisewave evidence)

- Solar System: the stack is listed as "A-Frame" because you called it "a frame work". Confirm, and say what it actually shows.
- Wisewave: the live URL is spelled "wiseewave". Its pages show tech gadgets and education consulting, while the CV lists travel, imports, fashion, MoMo and education. The "Professional Accessories" card shows sewing machines. Decide which is accurate and fix the site or the CV.
- Port scan capture has no date, so none is stated. Re-run it and screenshot the terminal with the date visible if you want one.
- LAN chat screenshots show the name "Enimah". Check that person is fine with being shown.
- Your WhatsApp number is now public on the site (it is also in the CV PDF).
- The solar-system site could not be opened from the build environment, so nothing on it was inspected.

## Security-first repositioning (to confirm)

- AdepaMarket, Admunz Data Hub and City Beans are labelled "AI-assisted" and say you don't claim to have hand-written all the code. That was inferred from your description of Node.js, TypeScript and modern-framework apps. Confirm which projects it applies to, and whether MoMo Fraud Shield, the port scanner and LAN chat were AI-assisted too (their text says nothing either way).
- "Authorised website security assessments": none exist yet, and the site says so. Add a real one in `src/data/assessments.ts` once you have written permission, evidence, a fix and a retest.
- The port scanner now leads the Cybersecurity section (first on the page after the hero) rather than appearing as a project card.
