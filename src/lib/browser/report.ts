import type { InfoSection } from "@/types/browser-info";

/** Flatten selected sections into plain-text lines (used by the terminal). */
export function sectionLines(sections: InfoSection[], id: InfoSection["id"], skipLabels: string[] = []): string[] {
  const section = sections.find((s) => s.id === id);
  if (!section) return ["Not available."];
  return section.items
    .filter((i) => !skipLabels.includes(i.label))
    .map((i) => `${i.label.padEnd(26)} ${i.value}  [${i.status}]`);
}
