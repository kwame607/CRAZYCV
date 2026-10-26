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
    <PageShell title="Project case study">
      <Link href="/projects" className="mb-4 inline-block text-sm text-accent hover:underline">
        ← All projects
      </Link>
      <ProjectCaseStudy project={project} />
    </PageShell>
  );
}
