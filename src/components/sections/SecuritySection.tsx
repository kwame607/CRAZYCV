import Link from "next/link";
import { assessments } from "@/data/assessments";
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
  return (
    <section id="security" aria-labelledby="security-title" className="relative border-t border-line py-24 md:py-36">
      <div className={container}>
        <SectionHeader
          index="04"
          label="Cybersecurity"
          lead="I'm learning security in public, so this section is strict about the difference between what I've done and what I'm demonstrating."
        >
          <span id="security-title">
            Curiosity is good. <em className="text-term">Evidence is better.</em>
          </span>
        </SectionHeader>

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
                <strong className="font-medium text-fg">A Python port scanner.</strong> A TCP connect scanner I wrote for authorised targets. Its limitations are documented, and nothing on this site runs it.{" "}
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
                <strong className="font-medium text-fg">Published assessments: {published}.</strong>{" "}
                {published === 0
                  ? "I haven't published a real assessment yet. When I do it will state scope, authorisation, tools, redacted evidence, the fix and the retest. Until then, this site claims no findings."
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
                <strong className="font-medium text-fg">The port-scan replay below.</strong> A fixed, pre-written dataset against reserved documentation addresses. No packets leave your browser.
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

        {/* Demo */}
        <Reveal className="mt-10 overflow-hidden rounded-2xl border border-line bg-win">
          <div className="flex items-center justify-between border-b border-line px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em]">
            <span className="text-term">&gt;_ port-scan replay</span>
            <span className="rounded-full border border-accent/50 px-2.5 py-0.5 text-accent">Simulation</span>
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
