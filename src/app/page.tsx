import Link from "next/link";
import { DesktopShell } from "@/components/desktop/DesktopShell";
import { cvPdfAvailable } from "@/lib/server/cv-file";

export default function Home() {
  return (
    <>
      <div id="main">
        <DesktopShell pdfAvailable={cvPdfAvailable()} />
      </div>
      <noscript>
        <nav aria-label="Sections (no JavaScript)" className="fixed inset-0 z-[10000] overflow-auto bg-bg p-6">
          <h1 className="font-display text-3xl">Kwame Emmanuel Adom</h1>
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
