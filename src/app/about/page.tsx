import type { Metadata } from "next";
import { PageShell } from "@/components/shared/PageShell";
import { AboutContent } from "@/components/content/AboutContent";

export const metadata: Metadata = { title: "About", description: "Profile of Kwame Emmanuel Adom: aspiring cybersecurity professional with a Computer Science degree." };

export default function AboutPage() {
  return (
    <PageShell title="About">
      <AboutContent />
    </PageShell>
  );
}
