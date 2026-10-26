import { assessmentSchema, type Assessment } from "@/lib/security/assessment-schema";

/**
 * Assessment records. Add real, sanitized records here (or load them from
 * version-controlled JSON) and they appear in Security Lab automatically.
 * Records are validated against the schema at module load.
 *
 * The only entry today is a SAMPLE that shows the format. It is not the result
 * of a real assessment and is labeled that way in the UI.
 */
const raw: unknown[] = [
  {
    id: "SAMPLE-001",
    sample: true,
    targetAsset: "example.test (illustrative only, not a real asset)",
    authorization: "Illustrative record. A real record states who authorized the test and how.",
    scope: "Illustrative: HTTP response headers of one public page.",
    date: "Not applicable",
    methodology: "Illustrative: request the page once and inspect response headers against a checklist.",
    tools: [{ name: "Browser developer tools", version: "n/a" }],
    findings: [
      {
        title: "Missing Content-Security-Policy header (illustrative)",
        area: "HTTP security headers",
        status: "finding-identified",
        severity: "low",
        severityRationale:
          "A CSP is a defense-in-depth control; its absence does not itself allow an attack but removes a safety net against script injection.",
        evidence: [
          {
            description: "Redacted response header listing",
            redacted: true,
            excerpt: "(no content-security-policy header present in response)",
          },
        ],
        impact: "If an injection flaw existed elsewhere, nothing would limit which scripts the page may run.",
        remediation: "Add a restrictive Content-Security-Policy and verify it does not break the page.",
        remainingLimitations: "Only one page was inspected; other routes were not tested.",
      },
      {
        title: "TLS configuration (illustrative)",
        area: "TLS configuration",
        status: "not-tested",
        evidence: [],
        remainingLimitations: "Shown to demonstrate the 'not tested' status. Absence of a test is not a pass.",
      },
    ],
  },
];

export const assessments: Assessment[] = raw.map((r) => assessmentSchema.parse(r));
