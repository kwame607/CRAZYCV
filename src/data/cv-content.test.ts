import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { certifications, education, experience, profile } from "./profile";
import { projects } from "./projects";
import { skillGroups } from "./skills";

describe("CV-backed content", () => {
  it("ships the real CV PDF at the configured path", () => {
    const file = path.join(process.cwd(), "public", profile.cvPdfPath);
    expect(existsSync(file)).toBe(true);
    expect(readFileSync(file).subarray(0, 5).toString()).toBe("%PDF-");
  });
  it("education and experience come from the CV and are not placeholders", () => {
    const text = JSON.stringify([education, experience, certifications]);
    expect(text).toContain("University of Cape Coast");
    expect(text).toContain("Aslin Fashion School");
    expect(text).not.toMatch(/not yet supplied|needs confirmation|Institution not/i);
    for (const e of [...education, ...experience, ...certifications]) expect(e.status).toBe("verified");
  });
  it("lists only the certification the CV consistently supports", () => {
    expect(certifications.map((c) => c.title)).toEqual(["Introduction to Cybersecurity"]);
  });
  it("no project still carries the old role placeholder", () => {
    expect(JSON.stringify(projects)).not.toMatch(/specific responsibilities to be added/);
  });
  it("MoMo Fraud Shield states limitations alongside its results", () => {
    const m = projects.find((p) => p.slug === "momo-fraud-shield");
    expect(m?.limitations?.length).toBeGreaterThanOrEqual(2);
    expect(JSON.stringify(m)).toMatch(/98\.3% recall/);
  });
  it("every skill either links evidence or is flagged as pending", () => {
    for (const g of skillGroups) for (const s of g.skills) expect(s.evidence.length > 0 || s.needsEvidence === true).toBe(true);
  });
  it("skill evidence links point at pages that exist", () => {
    const slugs = new Set(projects.map((p) => p.slug));
    for (const g of skillGroups) for (const s of g.skills) for (const e of s.evidence) {
      const m = /^\/projects\/(.+)$/.exec(e.href);
      if (m) expect(slugs.has(m[1] as string)).toBe(true);
    }
  });
});
