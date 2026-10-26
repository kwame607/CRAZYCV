import type { Metadata } from "next";
import { PageShell } from "@/components/shared/PageShell";
import { SkillsContent } from "@/components/content/SkillsContent";

export const metadata: Metadata = { title: "Skills", description: "Technical skills with links to the work that demonstrates them." };

export default function SkillsPage() {
  return (
    <PageShell title="Skills">
      <SkillsContent />
    </PageShell>
  );
}
