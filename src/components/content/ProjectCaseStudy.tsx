import { ExternalLink, ImageOff } from "lucide-react";
import type { Project } from "@/types/portfolio";
import { Notice, SectionTitle } from "@/components/shared/ui";

function List({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) return <p className="text-sm italic text-fg2">{empty}</p>;
  return (
    <ul className="list-disc space-y-1 pl-5 text-sm text-fg2">
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}

export function ProjectCaseStudy({ project: p }: { project: Project }) {
  return (
    <article className="space-y-1">
      <header className="mb-4">
        <h2 className="font-display text-2xl text-fg">{p.title}</h2>
        <p className="mt-1 text-sm text-fg2">{p.tagline}</p>
        <p className="mt-2 inline-block rounded border border-line px-2 py-0.5 font-mono text-xs text-accent">Status: {p.status}</p>
      </header>

      {p.links.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {p.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-bg hover:brightness-110"
            >
              {l.label}
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ))}
        </div>
      )}

      <SectionTitle>Overview</SectionTitle>
      <p className="text-sm text-fg2">{p.overview}</p>

      <SectionTitle>Problem</SectionTitle>
      <p className="text-sm text-fg2">{p.problem}</p>

      <SectionTitle>My role</SectionTitle>
      <p className="text-sm text-fg2">{p.role}</p>

      <SectionTitle>Confirmed features</SectionTitle>
      <List items={p.featuresVerified} empty="None confirmed yet." />

      <SectionTitle>Technologies (verified)</SectionTitle>
      <List items={p.technologiesVerified} empty="None verified yet. Only confirmed technologies are listed here." />
      {p.technologiesToConfirm.length > 0 && (
        <>
          <SectionTitle>Technologies (to confirm)</SectionTitle>
          <List items={p.technologiesToConfirm} empty="" />
        </>
      )}

      <SectionTitle>Still to document</SectionTitle>
      <List items={p.toDocument} empty="Nothing outstanding." />

      <SectionTitle>Key engineering decisions</SectionTitle>
      <List items={p.decisions} empty="Not yet written up." />
      <SectionTitle>Challenges</SectionTitle>
      <List items={p.challenges} empty="Not yet written up." />
      <SectionTitle>What I learned</SectionTitle>
      <List items={p.learned} empty="Not yet written up." />
      <SectionTitle>Security considerations</SectionTitle>
      <List items={p.security} empty="Not assessed." />

      <SectionTitle>Screenshots</SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2">
        {p.screenshots.length === 0 && <p className="text-sm italic text-fg2">No screenshots supplied.</p>}
        {p.screenshots.map((s) =>
          s.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={s.src} src={s.src} alt={s.alt} loading="lazy" className="rounded-lg border border-line" />
          ) : (
            <figure key={s.alt} className="flex aspect-video flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line bg-white/[0.02] p-4 text-center">
              <ImageOff className="h-6 w-6 text-fg2" aria-hidden />
              <figcaption className="text-xs text-fg2">
                <strong className="text-fg">Placeholder, not a real screenshot.</strong>
                <br />
                {s.neededNote}
              </figcaption>
            </figure>
          ),
        )}
      </div>

      {p.ownerNotes.length > 0 && (
        <div className="pt-5">
          <Notice tone="warn">
            <p className="mb-1 font-medium text-fg">Open items for the site owner</p>
            <ul className="list-disc pl-5">
              {p.ownerNotes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </Notice>
        </div>
      )}
    </article>
  );
}
