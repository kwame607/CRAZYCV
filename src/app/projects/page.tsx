import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/shared/PageShell";
import { projects } from "@/data/projects";

export const metadata: Metadata = { title: "Projects", description: "Case studies of web applications and security tools built by Kwame Emmanuel Adom." };

export default function ProjectsPage() {
  return (
    <PageShell title="Projects">
      <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line">
        {projects.map((p) => (
          <li key={p.slug} className="bg-bg2">
            <Link href={`/projects/${p.slug}`} className="block p-6 transition-colors duration-[var(--t-fast)] hover:bg-bg3 md:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">{p.status}</p>
              <h2 className="mt-2 font-display text-4xl text-fg">{p.title}</h2>
              <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-fg2">{p.tagline}</p>
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
