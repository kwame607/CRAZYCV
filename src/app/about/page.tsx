import type { Metadata } from "next";
import { PageShell } from "@/components/shared/PageShell";
import { AboutContent } from "@/components/content/AboutContent";

export const metadata: Metadata = { title: "About", description: "Profile of Kwame Emmanuel Adom: full-stack developer and cybersecurity learner." };

export default function AboutPage() {
  return (
    <PageShell title="About">
      <AboutContent />
    </PageShell>
  );
}
