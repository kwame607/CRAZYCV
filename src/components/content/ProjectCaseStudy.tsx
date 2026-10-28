import { ExternalLink } from "lucide-react";
import type { Project } from "@/types/portfolio";
import { Notice, SectionTitle } from "@/components/shared/ui";
import { withBase } from "@/lib/preview";

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-fg2">
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}

/** Renders a section only when it has real content: no "not yet written up" filler on a public page. */
function Block({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <>
      <SectionTitle>{title}</SectionTitle>
      <List items={items} />
    </>
  );
}

export function ProjectCaseStudy({ project: p }: { project: Project }) {
  return (
    <article className="max-w-3xl space-y-1">
      <header className="mb-6">
        <p className="text-lg leading-snug text-fg2">{p.tagline}</p>
        <p className="mt-4 inline-block rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{p.status}</p>
      </header>

      {p.links.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-3">
          {p.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-bg transition-[filter] duration-[var(--t-fast)] hover:brightness-110"
            >
              {l.label}
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ))}
        </div>
      )}

      {p.screenshots.length > 0 && (
        <div className="mb-10 grid gap-4 sm:grid-cols-2">
          {p.screenshots.map((s) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={s.src} src={withBase(s.src)} alt={s.alt} width={s.w} height={s.h} loading="lazy" decoding="async" className="h-auto w-full rounded-xl border border-line" />
          ))}
        </div>
      )}

      <SectionTitle>Overview</SectionTitle>
      <p className="text-[15px] leading-relaxed text-fg2">{p.overview}</p>

      <SectionTitle>Problem</SectionTitle>
      <p className="text-[15px] leading-relaxed text-fg2">{p.problem}</p>

      <SectionTitle>My role</SectionTitle>
      <p className="text-[15px] leading-relaxed text-fg2">{p.role}</p>

      <Block title="Features" items={p.featuresVerified} />
      <Block title="Technologies" items={p.technologiesVerified} />
      <Block title="Known limitations" items={p.limitations} />
      <Block title="Key engineering decisions" items={p.decisions} />
      <Block title="Challenges" items={p.challenges} />
      <Block title="What I learned" items={p.learned} />
      <Block title="Security considerations" items={p.security} />

      {p.evidenceNote && (
        <div className="pt-8">
          <Notice>
            <strong className="text-fg">Basis for these details:</strong> {p.evidenceNote}
          </Notice>
        </div>
      )}
    </article>
  );
}
