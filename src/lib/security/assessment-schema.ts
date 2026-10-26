import { z } from "zod";

/**
 * Status vocabulary for every checked area. Never collapse these into a
 * generic "secure": "no-issue-observed" is not a claim that the target is safe.
 */
export const testStatuses = [
  "not-tested",
  "no-issue-observed",
  "finding-identified",
  "remediation-applied",
  "retest-passed",
  "inconclusive",
] as const;
export type TestStatus = (typeof testStatuses)[number];

export const statusLabels: Record<TestStatus, string> = {
  "not-tested": "Not tested",
  "no-issue-observed": "Tested, no issue observed",
  "finding-identified": "Finding identified",
  "remediation-applied": "Remediation applied",
  "retest-passed": "Retest passed",
  "inconclusive": "Inconclusive",
};

export const severities = ["informational", "low", "medium", "high", "critical"] as const;

const evidenceSchema = z.object({
  description: z.string().min(1),
  /** Evidence must be redacted before it is published. */
  redacted: z.literal(true),
  /** Sanitized text only: no tokens, cookies, customer data or private addresses. */
  excerpt: z.string().optional(),
});

const findingSchema = z.object({
  title: z.string().min(1),
  area: z.string().min(1),
  status: z.enum(testStatuses),
  severity: z.enum(severities).optional(),
  severityRationale: z.string().optional(),
  evidence: z.array(evidenceSchema),
  impact: z.string().optional(),
  remediation: z.string().optional(),
  /** A retest-passed status requires documented retest evidence. */
  retest: z
    .object({ date: z.string(), result: z.string(), evidence: z.array(evidenceSchema).min(1) })
    .optional(),
  remainingLimitations: z.string().optional(),
});

export const assessmentSchema = z
  .object({
    id: z.string().min(1),
    /** True for illustrative templates that are not real assessments. */
    sample: z.boolean(),
    targetAsset: z.string().min(1),
    authorization: z.string().min(1),
    scope: z.string().min(1),
    date: z.string().min(1),
    methodology: z.string().min(1),
    tools: z.array(z.object({ name: z.string(), version: z.string() })),
    findings: z.array(findingSchema),
  })
  .superRefine((a, ctx) => {
    a.findings.forEach((f, i) => {
      if (f.status === "retest-passed" && !f.retest) {
        ctx.addIssue({
          code: "custom",
          path: ["findings", i, "retest"],
          message: "retest-passed requires documented retest evidence",
        });
      }
      if (f.status === "finding-identified" && !f.severity) {
        ctx.addIssue({
          code: "custom",
          path: ["findings", i, "severity"],
          message: "a finding needs a severity",
        });
      }
    });
  });

export type Assessment = z.infer<typeof assessmentSchema>;
