import Link from "next/link";
import { skillGroups } from "@/data/skills";
import { Notice } from "@/components/shared/ui";

export function SkillsContent() {
  return (
    <div className="space-y-6">
      <Notice>
        No proficiency percentages, years of experience or certifications are claimed. Each skill links to evidence you can check.
        Skills marked &ldquo;evidence pending&rdquo; are not yet backed by a linked project.
      </Notice>
      {skillGroups.map((g) => (
        <section key={g.title} aria-labelledby={`skills-${g.title}`}>
          <h3 id={`skills-${g.title}`} className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            {g.title}
          </h3>
          <ul className="space-y-2">
            {g.skills.map((s) => (
              <li key={s.name} className="rounded-lg border border-line bg-white/[0.02] p-3">
                <p className="text-sm font-medium text-fg">{s.name}</p>
                {s.evidence.length > 0 ? (
                  <ul className="mt-1.5 flex flex-wrap gap-2">
                    {s.evidence.map((e) => (
                      <li key={e.href + e.label}>
                        {e.href.startsWith("http") ? (
                          <a href={e.href} target="_blank" rel="noopener noreferrer" className="text-xs text-accent underline-offset-2 hover:underline">
                            {e.label}
                          </a>
                        ) : (
                          <Link href={e.href} className="text-xs text-accent underline-offset-2 hover:underline">
                            {e.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-xs italic text-fg2">Evidence pending: link a project, repository or report.</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
