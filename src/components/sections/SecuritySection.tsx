import Link from "next/link";
import { assessments } from "@/data/assessments";
import { getProject } from "@/data/projects";
import { withBase } from "@/lib/preview";
import { certifications, studying } from "@/data/profile";
import { ScanSimulation } from "@/components/applications/ScanSimulation";
import { Reveal } from "@/components/experience/Reveal";
import { SectionHeader, container } from "@/components/experience/SectionHeader";

const steps: [string, string][] = [
  ["Scope", "Write down exactly what is in and out of bounds."],
  ["Authorize", "Only my own systems, or written permission."],
  ["Observe", "Test with the smallest tool that answers the question."],
  ["Evidence", "Keep proof. Redact anything sensitive."],
  ["Fix", "Say how to remove the cause, not just the symptom."],
  ["Retest", "Confirm the fix actually worked."],
];

export function SecuritySection() {
  const published = assessments.filter((a) => !a.sample).length;
  const scanner = getProject("python-port-scanner");
  const run = scanner?.run;
  const shot = run ? scanner?.screenshots[run.screenshot] : undefined;
  return (
    <section id="security" aria-labelledby="security-title" className="relative border-t border-line py-24 md:py-36">
      <div className={container}>
        <SectionHeader
          index="01"
          label="Cybersecurity"
          lead="I'm an aspiring cybersecurity professional with a Computer Science degree, learning in public. This section is strict about the difference between what I've done and what I'm demonstrating."
        >
          <span id="security-title">
            Curiosity is good. <em className="text-term">Evidence is better.</em>
          </span>
        </SectionHeader>

        {/* Where I am: the facts, most relevant first */}
        <Reveal className="mt-14">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.28em] text-fg2">Where I am today</h3>
          <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                ["Hands-on tools", "A Python port scanner, run once against scanme.nmap.org, a host published for scanning practice."],
                ["Lab work", "An isolated Kali Linux home lab with Metasploitable 2, as described on my CV. No lab notes or reports are published yet."],
                ["Authorised website assessments", "None published yet. I will not show one until it has scope, written permission, evidence, a fix and a retest."],
                ["Training", `${certifications.map((c) => `${c.title}, ${c.org}`).join("; ")} (certificate). ${studying.map((s) => `${s.title}, ${s.org}`).join("; ")}: continuing study, not completed.`],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="bg-bg2 p-6">
                <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-term">{k}</dt>
                <dd className="mt-3 text-[14px] leading-relaxed text-fg2">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* Method */}
        <div className="mt-16">
          <Reveal>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.28em] text-fg2">The method I follow</h3>
          </Reveal>
          <ol className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-6">
            {steps.map(([name, body], i) => (
              <Reveal as="li" key={name} delay={i * 70} className="bg-bg p-6">
                <span className="font-mono text-[11px] tracking-[0.2em] text-term">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-3 font-display text-3xl text-fg">{name}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-fg2">{body}</p>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* Real vs simulated */}
        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <Reveal className="rounded-2xl border border-term/30 bg-term/[0.04] p-7 md:p-9">
            <p className="inline-flex items-center gap-2 rounded-full border border-term/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-term">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-term" /> Real
            </p>
            <h3 className="mt-5 font-display text-4xl text-fg">What actually exists</h3>
            <ul className="mt-6 space-y-5 text-[15px] leading-relaxed text-fg2">
              <li>
                <strong className="font-medium text-fg">A Python port scanner.</strong> A TCP connect scanner I wrote for authorised targets. I have run it against a host published for scanning practice (below). Its limitations are documented, and nothing on this site runs it.{" "}
                <Link href="/projects/python-port-scanner" className="link-underline text-term">
                  Read the write-up
                </Link>
              </li>
              <li>
                <strong className="font-medium text-fg">An isolated home lab.</strong> Kali Linux against deliberately vulnerable machines (Metasploitable 2), as described on my CV.{" "}
                <Link href="/projects/pentest-home-lab" className="link-underline text-term">
                  Details
                </Link>
              </li>
              <li>
                <strong className="font-medium text-fg">An encryption and recovery simulation.</strong> A Python exercise run on a test folder of throwaway files, labelled a simulation in its own output.{" "}
                <Link href="/projects/file-encryption-simulation" className="link-underline text-term">
                  Details
                </Link>
              </li>
              <li>
                <strong className="font-medium text-fg">Three small browser tools.</strong> A link checker, a hashing and salting demo and a security headers checker. They run in your browser and send nothing anywhere.{" "}
                <Link href="/security-tools" className="link-underline text-term">
                  Try them
                </Link>
              </li>
              <li>
                <strong className="font-medium text-fg">Published assessments: {published}.</strong>{" "}
                {published === 0
                  ? "A port-scan run is not an assessment, and I haven't published a full one yet. When I do it will state scope, authorisation, tools, redacted evidence, the fix and the retest. Until then, this site claims no findings."
                  : "See the Security Lab for the records."}
              </li>
            </ul>
          </Reveal>

          <Reveal delay={100} className="rounded-2xl border border-accent/30 bg-accent/[0.04] p-7 md:p-9">
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full border border-accent" /> Simulated
            </p>
            <h3 className="mt-5 font-display text-4xl text-fg">What is a demonstration</h3>
            <ul className="mt-6 space-y-5 text-[15px] leading-relaxed text-fg2">
              <li>
                <strong className="font-medium text-fg">Two of the port-scan scenarios below.</strong> Fixed, pre-written datasets against reserved documentation addresses. The first scenario is different: a replay of my real scanme.nmap.org run. No packets leave your browser in any of them.
              </li>
              <li>
                <strong className="font-medium text-fg">The sample assessment record.</strong> It shows the format I&rsquo;ll use for real work and is labelled as a sample, not a result.{" "}
                <Link href="/security-lab" className="link-underline text-accent">
                  Open the Security Lab
                </Link>
              </li>
              <li>
                <strong className="font-medium text-fg">The subnet and IPv4 tools.</strong> Local calculations only. They don&rsquo;t probe anything.{" "}
                <Link href="/network-tools" className="link-underline text-accent">
                  Network tools
                </Link>
              </li>
            </ul>
          </Reveal>
        </div>

        {/* A real run, with its limits */}
        {run && shot && (
          <Reveal className="mt-10 grid gap-8 rounded-2xl border border-term/30 bg-bg2 p-5 md:p-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
            <figure className="reveal-img self-start overflow-hidden rounded-xl border border-line bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={withBase(shot.src)} alt={shot.alt} width={shot.w} height={shot.h} loading="lazy" decoding="async" className="block h-auto w-full" />
            </figure>
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-term/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-term">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-term" /> Real run
              </p>
              <h3 className="mt-5 font-display text-4xl leading-tight text-fg">My scanner, on a host made for practice</h3>
              <dl className="mt-6 space-y-4 text-[14px] leading-relaxed">
                {(
                  [
                    ["Target", run.target],
                    ["Permission", run.authorization],
                    ["Mode", run.mode],
                    ["Observed", run.observed.join(". ") + "."],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg2">{k}</dt>
                    <dd className="mt-1 text-fg">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">What this does not show</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] leading-relaxed text-fg2">
                {run.limits.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              <p className="mt-6">
                <Link href="/projects/python-port-scanner" className="link-underline font-mono text-[11px] uppercase tracking-[0.16em] text-term">
                  Scanner write-up →
                </Link>
              </p>
            </div>
          </Reveal>
        )}

        {/* Demo */}
        <Reveal className="mt-10 overflow-hidden rounded-2xl border border-line bg-win">
          <div className="flex items-center justify-between border-b border-line px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em]">
            <span className="text-term">&gt;_ port-scan replay</span>
            <span className="rounded-full border border-accent/50 px-2.5 py-0.5 text-accent">Replay · 2 simulations</span>
          </div>
          <div className="p-5 md:p-8">
            <ScanSimulation />
          </div>
        </Reveal>

        {/* Training */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {certifications.map((c) => (
            <Reveal key={c.title} className="rounded-2xl border border-line bg-bg2 p-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-term">Certificate earned</p>
              <p className="mt-3 font-display text-3xl text-fg">{c.title}</p>
              <p className="mt-1 text-sm text-fg2">{c.org}</p>
            </Reveal>
          ))}
          {studying.map((s) => (
            <Reveal key={s.title} delay={80} className="rounded-2xl border border-dashed border-line p-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">Continuing study</p>
              <p className="mt-3 font-display text-3xl text-fg">{s.title}</p>
              <p className="mt-1 text-sm text-fg2">{s.org}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
