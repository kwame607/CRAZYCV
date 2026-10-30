import type { Metadata } from "next";
import { PageShell } from "@/components/shared/PageShell";
import { SecurityToolsApp } from "@/components/applications/SecurityToolsApp";

export const metadata: Metadata = {
  title: "Security Tools",
  description: "Three small browser-only teaching tools: a link checker, a hashing and salting demo, and a security headers checker. Nothing is sent anywhere.",
};

export default function SecurityToolsPage() {
  return (
    <PageShell title="Security Tools">
      <SecurityToolsApp />
    </PageShell>
  );
}
