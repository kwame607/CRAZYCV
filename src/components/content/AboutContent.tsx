import { profile, education, experience } from "@/data/profile";
import type { TimelineEntry } from "@/types/portfolio";
import { SectionTitle } from "@/components/shared/ui";

function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ul className="space-y-3">
      {entries.map((e) => (
        <li key={e.title} className="rounded-lg border border-line bg-white/[0.02] p-3">
          <p className="text-sm font-medium text-fg">{e.title}</p>
          <p className="text-xs text-fg2">
            {e.org} · {e.period}
          </p>
          <p className="mt-1 text-sm text-fg2">{e.detail}</p>
          {e.status !== "verified" && <p className="mt-1 font-mono text-[11px] text-warn">Needs confirmation from the current CV before publishing.</p>}
        </li>
      ))}
    </ul>
  );
}

export function AboutContent() {
  return (
    <div>
      <h2 className="font-display text-3xl text-fg">{profile.name}</h2>
      <p className="mt-1 text-sm text-accent">{profile.roles.join(" · ")}</p>
      <p className="mt-3 text-sm leading-relaxed text-fg2">{profile.summary}</p>
      <p className="mt-2 text-sm text-fg2">
        <span className="text-fg">Focus:</span> {profile.focus}. <span className="text-fg">Based in:</span> {profile.location}.
      </p>

      <SectionTitle>Education</SectionTitle>
      <Timeline entries={education} />
      <SectionTitle>Experience</SectionTitle>
      <Timeline entries={experience} />

      <SectionTitle>Current learning goals</SectionTitle>
      <ul className="list-disc space-y-1 pl-5 text-sm text-fg2">
        {profile.learningGoals.map((g) => (
          <li key={g}>{g}</li>
        ))}
      </ul>
    </div>
  );
}
