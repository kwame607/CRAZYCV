import type { Metadata } from "next";
import { PageShell } from "@/components/shared/PageShell";
import { ProjectsApp } from "@/components/applications/ProjectsApp";

export const metadata: Metadata = { title: "Projects", description: "Case studies of web applications and security tools built by Kwame Emmanuel Adom." };

export default function ProjectsPage() {
  return (
    <PageShell title="Projects">
      <ProjectsApp />
    </PageShell>
  );
}
