import type { Metadata } from "next";
import { PageShell } from "@/components/shared/PageShell";
import { CVContent } from "@/components/content/CVContent";
import { cvPdfAvailable } from "@/lib/server/cv-file";

export const metadata: Metadata = { title: "CV", description: "Curriculum vitae of Kwame Emmanuel Adom (HTML version with PDF download when available)." };

export default function CVPage() {
  return (
    <PageShell title="CV">
      <CVContent pdfAvailable={cvPdfAvailable()} />
    </PageShell>
  );
}
