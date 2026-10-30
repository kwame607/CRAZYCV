import Link from "next/link";
import type { ReactNode } from "react";

const nav = [
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/security-lab", label: "Security Lab" },
  { href: "/network-tools", label: "Network Tools" },
  { href: "/security-tools", label: "Security Tools" },
  { href: "/about", label: "About" },
  { href: "/cv", label: "CV" },
  { href: "/contact", label: "Contact" },
];

/** Plain, server-rendered frame for the deep pages, so every one is reachable by direct URL. */
export function PageShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="desk-bg min-h-dvh">
      <header className="border-b border-line bg-bg/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-7 gap-y-2 px-5 py-4 md:px-10">
          <Link href="/" className="font-mono text-sm tracking-[0.18em] text-fg">
            KA<span className="text-accent">.</span>
            <span className="sr-only"> Kwame Adom, back to the portfolio</span>
          </Link>
          <nav aria-label="Sections" className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.16em]">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="text-fg2 transition-colors duration-[var(--t-fast)] hover:text-fg">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-5xl px-5 py-12 md:px-10 md:py-16">
        <Link href="/" className="mb-8 inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-accent hover:underline">
          ← Back to the portfolio
        </Link>
        <h1 className="mb-10 font-display text-[clamp(2.6rem,6vw,4.6rem)] leading-none text-fg">{title}</h1>
        {children}
      </main>
    </div>
  );
}
