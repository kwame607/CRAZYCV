import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/security-lab", label: "Security Lab" },
  { href: "/network-tools", label: "Network Tools" },
  { href: "/about", label: "About" },
  { href: "/cv", label: "CV" },
  { href: "/contact", label: "Contact" },
];

/** Plain, server-rendered page frame so every section is reachable by direct URL. */
export function PageShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="desk-bg min-h-dvh">
      <header className="border-b border-line bg-bg2/90">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3">
          <Link href="/" className="inline-flex items-center gap-2 font-mono text-sm font-semibold text-fg">
            <ArrowLeft className="h-4 w-4 text-accent" aria-hidden />
            ADOM <span className="text-accent">{"//"}</span> OS
          </Link>
          <nav aria-label="Sections" className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="text-fg2 hover:text-fg">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 font-display text-3xl text-fg">{title}</h1>
        {children}
      </main>
    </div>
  );
}
