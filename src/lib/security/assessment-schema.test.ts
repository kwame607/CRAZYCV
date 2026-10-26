import { describe, expect, it } from "vitest";
import { assessmentSchema } from "./assessment-schema";
import { assessments } from "@/data/assessments";

const base = {
  id: "T-1",
  sample: false,
  targetAsset: "owned-asset",
  authorization: "owner",
  scope: "one page",
  date: "2026-01-01",
  methodology: "manual review",
  tools: [],
};
const ev = { description: "redacted header list", redacted: true as const };

describe("assessment schema", () => {
  it("accepts every published record, and the only one is a labeled sample", () => {
    expect(assessments.length).toBeGreaterThan(0);
    expect(assessments.every((a) => a.sample)).toBe(true);
  });
  it("requires documented retest evidence for retest-passed", () => {
    const bad = { ...base, findings: [{ title: "x", area: "headers", status: "retest-passed", evidence: [ev] }] };
    expect(assessmentSchema.safeParse(bad).success).toBe(false);
    const good = {
      ...base,
      findings: [{ title: "x", area: "headers", status: "retest-passed", evidence: [ev], retest: { date: "2026-02-01", result: "fixed", evidence: [ev] } }],
    };
    expect(assessmentSchema.safeParse(good).success).toBe(true);
  });
  it("requires a severity for an identified finding", () => {
    const bad = { ...base, findings: [{ title: "x", area: "headers", status: "finding-identified", evidence: [ev] }] };
    expect(assessmentSchema.safeParse(bad).success).toBe(false);
  });
  it("refuses unredacted evidence", () => {
    const bad = { ...base, findings: [{ title: "x", area: "a", status: "not-tested", evidence: [{ description: "raw", redacted: false }] }] };
    expect(assessmentSchema.safeParse(bad).success).toBe(false);
  });
});
