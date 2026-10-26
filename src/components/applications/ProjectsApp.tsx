"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { projects, getProject } from "@/data/projects";
import { ProjectCaseStudy } from "@/components/content/ProjectCaseStudy";
import { useDesktopOptional } from "@/components/desktop/DesktopProvider";
import { GhostButton } from "@/components/shared/ui";

export function ProjectsApp() {
  const desktop = useDesktopOptional();
  const request = desktop?.params.projects;
  const requested = request?.slug ?? null;
  const token = request?.n ?? 0;
  // A visitor's own navigation overrides the last request until a new request arrives.
  const [override, setOverride] = useState<{ slug: string | null; token: number } | null>(null);
  const slug = override && override.token === token ? override.slug : requested;
  const selected = slug ? getProject(slug) : undefined;
  const select = (s: string | null) => setOverride({ slug: s, token });

  if (selected) {
    return (
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <GhostButton onClick={() => select(null)}>
            <ArrowLeft className="h-4 w-4" aria-hidden /> All projects
          </GhostButton>
          <Link href={`/projects/${selected.slug}`} className="text-xs text-accent hover:underline">
            Open full page
          </Link>
        </div>
        <ProjectCaseStudy project={selected} />
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-fg2">
        Case studies list only what has been verified. Gaps are marked, not filled in.
      </p>
      <ul className="space-y-3">
        {projects.map((p) => (
          <li key={p.slug}>
            <button
              type="button"
              onClick={() => select(p.slug)}
              className="group flex w-full items-center gap-3 rounded-lg border border-line bg-white/[0.02] p-4 text-left hover:border-accent/50 hover:bg-white/[0.04]"
            >
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg text-fg">{p.title}</span>
                <span className="block text-sm text-fg2">{p.tagline}</span>
                <span className="mt-1 block font-mono text-[11px] text-accent">{p.status}</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-fg2 group-hover:text-accent" aria-hidden />
              <span className="sr-only">Open case study for {p.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
