import { Download, FileWarning } from "lucide-react";
import { profile, education, experience, certifications } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { Notice, SectionTitle } from "@/components/shared/ui";
import { withBase } from "@/lib/preview";

export function CVContent({ pdfAvailable }: { pdfAvailable: boolean }) {
  return (
    <div>
      <div className="mb-4">
        {pdfAvailable ? (
          <a
            href={withBase(profile.cvPdfPath)}
            download
            className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-bg hover:brightness-110"
          >
            <Download className="h-4 w-4" aria-hidden /> Download CV (PDF)
          </a>
        ) : (
          <Notice tone="warn">
            <span className="flex items-center gap-2 font-medium text-fg">
              <FileWarning className="h-4 w-4" aria-hidden /> PDF not yet supplied
            </span>
            <span className="mt-1 block">
              Add your CV as <code className="font-mono text-xs text-fg">public{profile.cvPdfPath}</code> and redeploy; this button
              then becomes a real download. The HTML CV below is the fallback.
            </span>
          </Notice>
        )}
      </div>

      <h2 className="font-display text-3xl text-fg">{profile.name}</h2>
      <p className="mt-1 text-sm text-accent">{profile.roles.join(" · ")}</p>
      <p className="mt-2 text-sm text-fg2">{profile.summary}</p>
      <p className="mt-2 text-sm text-fg2">
        {profile.location} · {profile.email ?? "email not configured"} · {profile.github ?? "GitHub not configured"}
      </p>

      <SectionTitle>Education</SectionTitle>
      {education.map((e) => (
        <p key={e.title} className="text-sm text-fg2">
          <span className="text-fg">{e.title}</span>, {e.org}
          {e.period ? ` (${e.period})` : ""}
        </p>
      ))}

      <SectionTitle>Experience</SectionTitle>
      {experience.map((e) => (
        <p key={e.title} className="text-sm text-fg2">
          <span className="text-fg">{e.title}</span>, {e.org}
          {e.period ? ` (${e.period})` : ""}
        </p>
      ))}

      <SectionTitle>Certifications</SectionTitle>
      {certifications.map((e) => (
        <p key={e.title} className="text-sm text-fg2">
          <span className="text-fg">{e.title}</span>, {e.org}
        </p>
      ))}

      <SectionTitle>Projects</SectionTitle>
      <ul className="list-disc space-y-1 pl-5 text-sm text-fg2">
        {projects.map((p) => (
          <li key={p.slug}>
            <span className="text-fg">{p.title}</span>: {p.tagline}
          </li>
        ))}
      </ul>

      <SectionTitle>Skills</SectionTitle>
      {skillGroups.map((g) => (
        <p key={g.title} className="text-sm text-fg2">
          <span className="text-fg">{g.title}:</span> {g.skills.map((s) => s.name).join(", ")}
        </p>
      ))}

    </div>
  );
}
