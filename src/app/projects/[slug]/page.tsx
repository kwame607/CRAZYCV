import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/shared/PageShell";
import { ProjectCaseStudy } from "@/components/content/ProjectCaseStudy";
import { getProject, projects } from "@/data/projects";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  return p ? { title: p.title, description: p.overview } : {};
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return (
    <PageShell title={project.title}>
      <ProjectCaseStudy project={project} />
      <p className="mt-14 border-t border-line pt-6">
        <Link href="/projects" className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent hover:underline">
          ← All projects
        </Link>
      </p>
    </PageShell>
  );
}
