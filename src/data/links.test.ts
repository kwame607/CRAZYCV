import { describe, expect, it } from "vitest";
import { projects } from "./projects";
import { skillGroups } from "./skills";

describe("no source-code links on the public site", () => {
  it("project pages link only to live sites", () => {
    for (const p of projects) for (const l of p.links) expect(l.href).not.toMatch(/github\.com/i);
  });
  it("project text does not name source repositories", () => {
    const text = JSON.stringify(projects);
    expect(text).not.toMatch(/github\.com\/kwame607\/|kwame607\/[A-Za-z-]+/);
  });
  it("skill evidence never points at a repository", () => {
    for (const g of skillGroups) for (const s of g.skills) for (const e of s.evidence) expect(e.href).not.toMatch(/github\.com\/kwame607\/[^/?#]/i);
  });
  it("DataFlow Ghana is not listed separately", () => {
    expect(projects.some((p) => /dataflow/i.test(p.slug))).toBe(false);
  });
});
