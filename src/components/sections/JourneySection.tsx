import { education, experience, certifications } from "@/data/profile";
import { profile } from "@/data/profile";
import { withBase } from "@/lib/preview";
import type { TimelineEntry } from "@/types/portfolio";
import { Reveal } from "@/components/experience/Reveal";
import { SectionHeader, container } from "@/components/experience/SectionHeader";

function Row({ e, i }: { e: TimelineEntry; i: number }) {
  return (
    <Reveal as="li" delay={(i % 4) * 70} className="relative grid gap-2 border-t border-line py-8 md:grid-cols-[11rem_1fr] md:gap-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{e.period ?? "Education"}</p>
      <div>
        <h3 className="font-display text-3xl leading-tight text-fg md:text-4xl">{e.title}</h3>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-fg2">{e.org}</p>
        <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-fg2">{e.detail}</p>
      </div>
    </Reveal>
  );
}

export function JourneySection({ cvAvailable }: { cvAvailable: boolean }) {
  return (
    <section id="journey" aria-labelledby="journey-title" className="border-t border-line bg-bg2 py-24 md:py-36">
      <div className={container}>
        <SectionHeader index="07" label="Journey" lead="Roles and dates are as written on my CV.">
          <span id="journey-title">
            Where I&rsquo;ve worked, <em className="text-accent">and what I&rsquo;ve studied.</em>
          </span>
        </SectionHeader>

        {cvAvailable && (
          <Reveal className="mt-10">
            <a
              href={withBase(profile.cvPdfPath)}
              download
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-bg transition-[filter] duration-[var(--t-fast)] hover:brightness-110"
            >
              Download my CV (PDF) <span aria-hidden="true">↓</span>
            </a>
          </Reveal>
        )}

        <div className="mt-16">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.28em] text-fg2">Experience</h3>
          <ol className="mt-4">
            {experience.map((e, i) => (
              <Row key={`${e.org}-${e.title}`} e={e} i={i} />
            ))}
          </ol>
        </div>

        <div className="mt-14">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.28em] text-fg2">Education and training</h3>
          <ol className="mt-4">
            {education.map((e, i) => (
              <Row key={e.title} e={e} i={i} />
            ))}
            {certifications.map((c, i) => (
              <Row key={c.title} i={i} e={{ ...c, period: "Certificate", detail: "Earned and listed on my CV." }} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
