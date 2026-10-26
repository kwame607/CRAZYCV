import type { Metadata } from "next";
import { PageShell } from "@/components/shared/PageShell";
import { SecurityLabApp } from "@/components/applications/SecurityLabApp";

export const metadata: Metadata = {
  title: "Security Lab",
  description: "Safe, clearly labeled cybersecurity demonstrations and an evidence-based assessment format.",
};

export default function SecurityLabPage() {
  return (
    <PageShell title="Security Lab">
      <SecurityLabApp />
    </PageShell>
  );
}
