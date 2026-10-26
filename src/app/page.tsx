import Link from "next/link";
import { DesktopShell } from "@/components/desktop/DesktopShell";
import { cvPdfAvailable } from "@/lib/server/cv-file";
import { profile } from "@/data/profile";

const sections: [string, string][] = [
  ["/projects", "Projects"],
  ["/skills", "Skills"],
  ["/security-lab", "Security Lab"],
  ["/network-tools", "Network Tools"],
  ["/about", "About"],
  ["/cv", "CV"],
  ["/contact", "Contact"],
];

export default function Home() {
  return (
    <>
      {/* Real content in the server HTML for crawlers and assistive tech; the desktop takes over after hydration. */}
      <section aria-label="Introduction" className="sr-only">
        <h1>{profile.name}: {profile.roles[0]} and cybersecurity learner</h1>
        <p>{profile.summary}</p>
        <nav aria-label="Sections">
          <ul>
            {sections.map(([href, label]) => (
              <li key={href}>
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>
      <div id="main">
        <DesktopShell pdfAvailable={cvPdfAvailable()} />
      </div>
      <noscript>
        <nav aria-label="Sections (no JavaScript)" className="fixed inset-0 z-[10000] overflow-auto bg-bg p-6">
          <p className="font-display text-3xl">Kwame Emmanuel Adom</p>
          <p className="mt-2 text-fg2">The interactive desktop needs JavaScript. These pages work without it:</p>
          <ul className="mt-4 list-disc space-y-1 pl-5">
            {["projects", "skills", "security-lab", "network-tools", "about", "cv", "contact"].map((p) => (
              <li key={p}>
                <Link href={`/${p}`} className="text-accent underline">
                  {p}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </noscript>
    </>
  );
}
