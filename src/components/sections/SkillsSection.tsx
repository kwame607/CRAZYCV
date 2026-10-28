import Link from "next/link";
import { skillGroups, skillLevel, levelLabels, type SkillLevel } from "@/data/skills";
import { Reveal } from "@/components/experience/Reveal";
import { SectionHeader, container } from "@/components/experience/SectionHeader";

const dot: Record<SkillLevel, string> = {
  shipped: "bg-accent",
  lab: "bg-term",
  learning: "border border-fg2 bg-transparent",
};

export function SkillsSection() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="py-24 md:py-36">
      <div className={container}>
        <SectionHeader
          index="03"
          label="Skills"
          lead="No percentage bars. Each skill says how I've used it, and links to the work that shows it where there is some."
        >
          <span id="skills-title">
            What I use, <em className="text-accent">and how far I&rsquo;ve taken it.</em>
          </span>
        </SectionHeader>

        <Reveal className="mt-12">
          <ul className="flex flex-wrap gap-x-8 gap-y-3" aria-label="Legend">
            {(Object.keys(levelLabels) as SkillLevel[]).map((k) => (
              <li key={k} className="flex items-center gap-3 text-sm text-fg2">
                <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${dot[k]}`} />
                <span>
                  <strong className="font-medium text-fg">{levelLabels[k].label}.</strong> {levelLabels[k].meaning}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 xl:grid-cols-3">
          {skillGroups.map((g, gi) => (
            <Reveal key={g.title} delay={(gi % 3) * 80} className="bg-bg p-7 md:p-9">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">{g.title}</h3>
              <ul className="mt-6 space-y-4">
                {g.skills.map((s) => {
                  const level = skillLevel(s);
                  const ev = s.evidence[0];
                  return (
                    <li key={s.name} className="flex items-start gap-3">
                      <span aria-hidden="true" className={`mt-[0.45em] h-2.5 w-2.5 shrink-0 rounded-full ${dot[level]}`} />
                      <div className="min-w-0">
                        <p className="text-[15px] leading-snug text-fg">
                          {s.name} <span className="sr-only">({levelLabels[level].label})</span>
                        </p>
                        {ev &&
                          (ev.href.startsWith("http") ? (
                            <a href={ev.href} target="_blank" rel="noopener noreferrer" className="link-underline mt-1 inline-block font-mono text-[11px] text-fg2 hover:text-accent">
                              {ev.label} ↗<span className="sr-only"> (opens in a new tab)</span>
                            </a>
                          ) : (
                            <Link href={ev.href} className="link-underline mt-1 inline-block font-mono text-[11px] text-fg2 hover:text-accent">
                              {ev.label}
                            </Link>
                          ))}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
