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
  it("lists the two Cisco Networking Academy certificates the owner has earned, and no others", () => {
    expect(certifications.map((c) => c.title)).toEqual(["Introduction to Cybersecurity", "Ethical Hacking"]);
  });
  it("uses the contact details given by the owner", () => {
    expect(profile.email).toBe("kwameadom607@gmail.com");
    expect(profile.linkedin).toBe("https://www.linkedin.com/in/kwame-adom-957b58277");
    expect(profile.whatsapp.href).toBe("https://wa.me/233532759082");
    expect(profile.whatsapp.display).toBe("+233 53 275 9082");
    expect(profile.location).toBe("Kumasi, Ghana");
    expect(profile.website).toBe("https://www.admunz.com/");
  });
  it("does not claim a degree class the CV does not state", () => {
    expect(JSON.stringify([profile, education])).not.toMatch(/second class|2:1|upper/i);
  });
  it("ships no owner-only notes or TODO lists in the public data", () => {
    expect(JSON.stringify(projects)).not.toMatch(/ownerNotes|toDocument|technologiesToConfirm|stray files|Placeholder/);
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
