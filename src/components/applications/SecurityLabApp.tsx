"use client";

import { useState } from "react";
import { assessments } from "@/data/assessments";
import { statusLabels, testStatuses, type TestStatus } from "@/lib/security/assessment-schema";
import { ScanSimulation } from "./ScanSimulation";
import { Notice, SectionTitle } from "@/components/shared/ui";

type Tab = "dashboard" | "simulation" | "assessments";

const tabs: { id: Tab; label: string }[] = [
  { id: "dashboard", label: "Lab dashboard" },
  { id: "simulation", label: "Port-scan simulation" },
  { id: "assessments", label: "Assessments" },
];

const areas: { title: string; body: string; evidence: string }[] = [
  {
    title: "Web application security",
    body: "Header, cookie, session, access-control and input-handling reviews of sites I own or am authorized to test.",
    evidence: "No live assessment published yet. Source-level observations are on the AdepaMarket and Admunz project pages; the Assessments tab shows the record format.",
  },
  {
    title: "Network security",
    body: "TCP/IP fundamentals and subnetting, practiced through the Network Tools app.",
    evidence: "Working demo: subnet calculator and IPv4 classifier in Network Tools.",
  },
  {
    title: "Python security tools",
    body: "A Python TCP port scanner for authorized environments.",
    evidence: "Source is on GitHub (see the Python Network Port Scanner project, including its documented limitations). Redacted lab output is still to be added.",
  },
  {
    title: "Linux and command-line work",
    body: "Command-line workflows used when assessing and documenting.",
    evidence: "No linked evidence yet.",
  },
  {
    title: "Findings and remediation",
    body: "Each finding carries severity with rationale, redacted evidence, impact and a fix.",
    evidence: "Format is implemented and validated. Real findings: none published yet.",
  },
  {
    title: "Reports and retesting",
    body: "A 'retest passed' status requires documented retest evidence; the schema rejects it otherwise.",
    evidence: "Rule enforced in code and covered by a unit test.",
  },
];

export function SecurityLabApp() {
  const [tab, setTab] = useState<Tab>("dashboard");
  return (
    <div>
      <div role="tablist" aria-label="Security Lab sections" className="mb-4 flex flex-wrap gap-1 border-b border-line">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`lab-tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`lab-panel-${t.id}`}
            type="button"
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm ${tab === t.id ? "border-accent text-fg" : "border-transparent text-fg2 hover:text-fg"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`lab-panel-${tab}`} aria-labelledby={`lab-tab-${tab}`}>
        {tab === "dashboard" && (
          <div className="space-y-3">
            <Notice>
              This lab shows learning and method. It never scans third-party systems, and nothing here claims a site is &ldquo;secure&rdquo;.
              Every status says exactly what was and was not done.
            </Notice>
            <ul className="grid gap-3 sm:grid-cols-2">
              {areas.map((a) => (
                <li key={a.title} className="rounded-lg border border-line bg-white/[0.02] p-3">
                  <h4 className="font-display text-base text-fg">{a.title}</h4>
                  <p className="mt-1 text-sm text-fg2">{a.body}</p>
                  <p className="mt-2 font-mono text-[11px] text-accent">{a.evidence}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "simulation" && <ScanSimulation />}

        {tab === "assessments" && (
          <div>
            <SectionTitle>Status vocabulary</SectionTitle>
            <ul className="flex flex-wrap gap-2 text-xs">
              {testStatuses.map((s) => (
                <li key={s} className="rounded border border-line px-2 py-1 font-mono text-fg2">
                  {statusLabels[s]}
                </li>
              ))}
            </ul>

            {assessments.every((a) => a.sample) && (
              <div className="mt-4">
                <Notice tone="warn">
                  <strong className="text-fg">No real assessments are published yet.</strong> The record below is an illustrative sample that shows the format. It is
                  not the result of testing any real system.
                </Notice>
              </div>
            )}

            {assessments.map((a) => (
              <article key={a.id} className="mt-4 rounded-lg border border-line bg-white/[0.02] p-4 text-sm">
                <header className="mb-2 flex flex-wrap items-center gap-2">
                  <h4 className="font-mono text-accent">{a.id}</h4>
                  {a.sample && <span className="rounded border border-warn/50 px-1.5 py-0.5 font-mono text-[10px] uppercase text-warn">sample, not real</span>}
                </header>
                <dl className="grid gap-1 text-fg2 sm:grid-cols-[8rem_1fr]">
                  <dt className="text-fg">Target</dt><dd>{a.targetAsset}</dd>
                  <dt className="text-fg">Authorization</dt><dd>{a.authorization}</dd>
                  <dt className="text-fg">Scope</dt><dd>{a.scope}</dd>
                  <dt className="text-fg">Date</dt><dd>{a.date}</dd>
                  <dt className="text-fg">Method</dt><dd>{a.methodology}</dd>
                  <dt className="text-fg">Tools</dt><dd>{a.tools.map((t) => `${t.name} ${t.version}`).join(", ")}</dd>
                </dl>
                <ul className="mt-3 space-y-3">
                  {a.findings.map((f) => (
                    <li key={f.title} className="rounded border border-line p-3">
                      <p className="text-fg">{f.title}</p>
                      <p className="mt-1 font-mono text-[11px] text-accent">
                        {f.area} · {statusLabels[f.status as TestStatus]}
                        {f.severity ? ` · severity: ${f.severity}` : ""}
                      </p>
                      {f.severityRationale && <p className="mt-1 text-fg2"><strong className="text-fg">Rationale:</strong> {f.severityRationale}</p>}
                      {f.evidence.map((e) => (
                        <p key={e.description} className="mt-1 text-fg2">
                          <strong className="text-fg">Evidence (redacted):</strong> {e.description}
                          {e.excerpt && <code className="mt-1 block rounded bg-black/40 p-2 font-mono text-xs text-term">{e.excerpt}</code>}
                        </p>
                      ))}
                      {f.impact && <p className="mt-1 text-fg2"><strong className="text-fg">Impact:</strong> {f.impact}</p>}
                      {f.remediation && <p className="mt-1 text-fg2"><strong className="text-fg">Remediation:</strong> {f.remediation}</p>}
                      {f.remainingLimitations && <p className="mt-1 text-fg2"><strong className="text-fg">Limitations:</strong> {f.remainingLimitations}</p>}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
