import type { Metadata } from "next";
import { PageShell } from "@/components/shared/PageShell";
import { NetworkToolsApp } from "@/components/applications/NetworkToolsApp";

export const metadata: Metadata = {
  title: "Network Tools",
  description: "Local subnet calculator, IPv4 classifier and networking references. No external scanning.",
};

export default function NetworkToolsPage() {
  return (
    <PageShell title="Network Tools">
      <NetworkToolsApp />
    </PageShell>
  );
}
