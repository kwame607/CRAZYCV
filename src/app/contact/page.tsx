import type { Metadata } from "next";
import { PageShell } from "@/components/shared/PageShell";
import { ContactContent } from "@/components/content/ContactContent";

export const metadata: Metadata = { title: "Contact", description: "How to contact Kwame Emmanuel Adom." };

export default function ContactPage() {
  return (
    <PageShell title="Contact">
      <ContactContent />
    </PageShell>
  );
}
