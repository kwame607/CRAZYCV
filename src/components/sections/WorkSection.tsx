import Link from "next/link";
import { projects } from "@/data/projects";
import { moreBuilds } from "@/data/more-builds";
import type { Project } from "@/types/portfolio";
import { withBase } from "@/lib/preview";
import { Reveal } from "@/components/experience/Reveal";
import { SectionHeader, container } from "@/components/experience/SectionHeader";

/**
 * Each featured project is shown in the colours of its own real interface
 * (taken from its screenshots), so AdepaMarket stays warm and editorial
 * instead of being forced into this site's dark theme. Accents are the brand
 * hue deepened (or lightened on the navy panel) until small text clears 4.5:1.
 */
const themes: Record<string, { bg: string; ink: string; soft: string; accent: string; onAccent: string }> = {
  adepamarket: { bg: "#f3e4cf", ink: "#2b1d14", soft: "#6f5646", accent: "#9a3b18", onAccent: "#fff7ee" },
  "admunz-data-hub": { bg: "#e7f0f5", ink: "#0e1f2b", soft: "#4c6272", accent: "#006a5a", onAccent: "#ffffff" },
  "city-beans": { bg: "#f1e6b0", ink: "#1b1a10", soft: "#5b5a3d", accent: "#476b14", onAccent: "#ffffff" },
  "momo-fraud-shield": { bg: "#17304f", ink: "#f4efe6", soft: "#b4c0d0", accent: "#f4977f", onAccent: "#17304f" },
};

const featured = ["adepamarket", "admunz-data-hub", "city-beans", "momo-fraud-shield"]
  .map((slug) => projects.find((p) => p.slug === slug))
  .filter((p): p is Project => !!p);

function host(href: string): string {
  try {
    return new URL(href).host;
  } catch {
    return "";
  }
}

function ProjectFeature({ project: p, index }: { project: Project; index: number }) {
  const th = themes[p.slug] ?? themes["momo-fraud-shield"]!;
  const live = p.links[0];
  const [main, second] = p.screenshots;
  return (
    <Reveal as="article" className="overflow-hidden rounded-[28px]">
      <div style={{ background: th.bg, color: th.ink }} className="grid gap-10 p-6 md:p-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: th.soft }}>
            <span style={{ color: th.accent }}>{String(index + 1).padStart(2, "0")}</span>
            <span aria-hidden="true">/</span>
            <span>{p.status}</span>
          </div>
          <h3 className="mt-5 font-display text-[clamp(2.6rem,5.2vw,4.6rem)] leading-[0.95]">{p.title}</h3>
          <p className="mt-4 text-lg leading-snug" style={{ color: th.soft }}>
            {p.tagline}
          </p>
          <p className="mt-6 text-[15px] leading-relaxed">{p.role}</p>

          <ul className="mt-6 space-y-2.5 text-[15px] leading-snug">
            {p.featuresVerified.slice(0, 4).map((f) => (
              <li key={f} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.6em] h-px w-4 shrink-0" style={{ background: th.accent }} />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {p.limitations?.[0] && (
            <p className="mt-6 border-l-2 pl-4 text-sm leading-relaxed" style={{ borderColor: th.accent, color: th.soft }}>
              <strong style={{ color: th.ink }}>Read with care: </strong>
              {p.limitations[0]}
            </p>
          )}

          <ul className="mt-7 flex flex-wrap gap-2" aria-label="Technologies">
            {p.technologiesVerified.slice(0, 6).map((t) => (
              <li key={t} className="rounded-full border px-3 py-1 font-mono text-[11px]" style={{ borderColor: `${th.ink}33`, color: th.soft }}>
                {t.split(",")[0]?.split(" (")[0]}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            {live && (
              <a
                href={live.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-[filter] duration-[var(--t-fast)] hover:brightness-110"
                style={{ background: th.accent, color: th.onAccent }}
              >
                {live.label} <span aria-hidden="true">↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
            <Link
              href={`/projects/${p.slug}`}
              className="inline-flex items-center gap-2 rounded-full border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-opacity duration-[var(--t-fast)] hover:opacity-70"
              style={{ borderColor: `${th.ink}44` }}
            >
              Case study <span aria-hidden="true">→</span>
              <span className="sr-only"> for {p.title}</span>
            </Link>
          </div>
        </div>

        <div className="relative lg:col-span-7">
          {main && (
            <figure className="reveal-img overflow-hidden rounded-xl border shadow-[0_30px_80px_-30px_rgba(0,0,0,.45)]" style={{ borderColor: `${th.ink}22`, background: "#fff" }}>
              <div className="flex items-center gap-1.5 border-b px-3 py-2" style={{ borderColor: `${th.ink}18`, background: "#f6f6f4" }} aria-hidden="true">
                <span className="h-2 w-2 rounded-full bg-[#e5736a]" />
                <span className="h-2 w-2 rounded-full bg-[#e6bf5a]" />
                <span className="h-2 w-2 rounded-full bg-[#6fcf7c]" />
                {live && <span className="ml-3 truncate font-mono text-[10px] text-[#4f5358]">{host(live.href)}</span>}
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={withBase(main.src)} alt={main.alt} width={main.w} height={main.h} loading="lazy" decoding="async" className="block h-auto w-full" />
            </figure>
          )}
          {second && (
            <figure
              className="reveal-img mt-5 w-[72%] overflow-hidden rounded-xl border shadow-[0_24px_60px_-28px_rgba(0,0,0,.5)] lg:absolute lg:-bottom-8 lg:right-[-1.5rem] lg:mt-0 lg:w-[46%]"
              style={{ borderColor: `${th.ink}22`, background: "#fff", ["--d" as string]: "200ms" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={withBase(second.src)} alt={second.alt} width={second.w} height={second.h} loading="lazy" decoding="async" className="block h-auto w-full" />
            </figure>
          )}
        </div>
      </div>
    </Reveal>
  );
}

export function WorkSection() {
  return (
    <section id="work" aria-labelledby="work-title" className="py-24 md:py-36">
      <div className={container}>
        <SectionHeader
          index="01"
          label="Selected work"
          lead="Four projects with real screenshots, what I built, and what I can and can't claim about each. Every detail here was read from the source or stated on my CV."
        >
          <span id="work-title">
            Things I&rsquo;ve built, <em className="text-accent">and how they work.</em>
          </span>
        </SectionHeader>

        <div className="mt-16 space-y-10 md:mt-24 md:space-y-16">
          {featured.map((p, i) => (
            <ProjectFeature key={p.slug} project={p} index={i} />
          ))}
        </div>

        <div className="mt-24 md:mt-32">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              Also built <span className="text-fg2">/ from my CV</span>
            </p>
          </Reveal>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {moreBuilds.map((b, i) => (
              <li key={b.title} className="bg-bg2 p-6 md:p-8">
                <Reveal delay={i * 60}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-term">{b.kind}</p>
                  <h3 className="mt-3 font-display text-3xl leading-tight text-fg">{b.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-fg2">{b.line}</p>
                  <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
                    {b.tech.map((t) => (
                      <li key={t} className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] text-fg2">
                        {t}
                      </li>
                    ))}
                  </ul>
                  {(b.slug || b.live) && (
                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em]">
                      {b.live && (
                        <a href={b.live.href} target="_blank" rel="noopener noreferrer" className="link-underline text-accent">
                          {b.live.label} ↗<span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      )}
                      {b.slug && (
                        <Link href={`/projects/${b.slug}`} className="link-underline text-fg">
                          Details →<span className="sr-only"> for {b.title}</span>
                        </Link>
                      )}
                    </div>
                  )}
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
