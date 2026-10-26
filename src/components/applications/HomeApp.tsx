"use client";

import { FileText, FolderOpen, Mail, SquareTerminal } from "lucide-react";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { useDesktop } from "@/components/desktop/DesktopProvider";
import { PrimaryButton, GhostButton, SectionTitle } from "@/components/shared/ui";

export function HomeApp() {
  const { openApp } = useDesktop();
  const featured = projects.filter((p) => p.featured);
  return (
    <div>
      <p className="font-mono text-xs text-term">welcome to ADOM // OS</p>
      <h2 className="mt-2 font-display text-4xl leading-tight text-fg">{profile.name}</h2>
      <p className="mt-2 text-sm text-accent">{profile.roles.join(" · ")}</p>
      <p className="mt-3 max-w-prose text-sm leading-relaxed text-fg2">{profile.summary}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        <PrimaryButton onClick={() => openApp("projects")}>
          <FolderOpen className="h-4 w-4" aria-hidden /> View projects
        </PrimaryButton>
        <GhostButton onClick={() => openApp("terminal")}>
          <SquareTerminal className="h-4 w-4" aria-hidden /> Open terminal
        </GhostButton>
        <GhostButton onClick={() => openApp("cv")}>
          <FileText className="h-4 w-4" aria-hidden /> CV
        </GhostButton>
        <GhostButton onClick={() => openApp("contact")}>
          <Mail className="h-4 w-4" aria-hidden /> Contact
        </GhostButton>
      </div>

      <SectionTitle>Featured projects</SectionTitle>
      <ul className="grid gap-3 sm:grid-cols-2">
        {featured.map((p) => (
          <li key={p.slug}>
            <button
              type="button"
              onClick={() => openApp("projects", { slug: p.slug })}
              className="h-full w-full rounded-lg border border-line bg-white/[0.02] p-3 text-left hover:border-accent/50"
            >
              <span className="block font-display text-base text-fg">{p.title}</span>
              <span className="mt-0.5 block text-xs text-fg2">{p.tagline}</span>
              <span className="mt-2 block font-mono text-[11px] text-accent">{p.status}</span>
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-xs text-fg2">
        Tip: the System Overview window shows what your browser reports. It is read locally and nothing is scanned.
      </p>
    </div>
  );
}
