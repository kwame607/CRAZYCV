import { Reveal } from "@/components/experience/Reveal";
import { SectionHeader, container } from "@/components/experience/SectionHeader";

const layers = [
  {
    n: "01",
    title: "Build",
    tone: "text-accent",
    body: "Full-stack web applications with real payments, accounts and admin tools. Next.js, TypeScript, Supabase, Cloudflare and Paystack in the products on this page.",
  },
  {
    n: "02",
    title: "Investigate",
    tone: "text-term",
    body: "Hands-on security learning in an isolated lab: Kali Linux, Nmap and Metasploit against deliberately vulnerable machines, never against systems I don't have permission to test.",
  },
  {
    n: "03",
    title: "Improve",
    tone: "text-cream",
    body: "Turning what I learn into practice: documented findings, fixes, retests. This is the part I'm still building evidence for, and the Security section says so plainly.",
  },
];

const facts: [string, string][] = [
  ["Education", "BSc Computer Science, University of Cape Coast"],
  ["Final-year project", "MoMo Fraud Shield, a machine-learning prototype"],
  ["Founder and developer", "Admunz Data Hub and AdepaMarket"],
  ["Based in", "Kumasi, Ghana"],
];

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="border-t border-line bg-bg2 py-24 md:py-36">
      <div className={container}>
        <SectionHeader index="02" label="About">
          <span id="about-title">
            I want to understand how software is built, <em className="text-accent">how it fails,</em> and how it can be improved.
          </span>
        </SectionHeader>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <p className="max-w-[48ch] text-lg leading-relaxed text-fg2">
              I&rsquo;m a Computer Science graduate and full-stack developer in Kumasi. I founded Admunz Data Hub and AdepaMarket, and I&rsquo;m teaching myself security the careful way: understand the system first, test only what I&rsquo;m authorised to test, and write down what I actually observed.
            </p>
            <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-fg2">
              Building and securing aren&rsquo;t separate jobs to me. The better I understand how an application breaks, the better the next one I build.
            </p>
            <dl className="mt-12 grid gap-x-8 gap-y-6 border-t border-line pt-8 sm:grid-cols-2">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg2">{k}</dt>
                  <dd className="mt-2 text-[15px] leading-snug text-fg">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <ol className="space-y-4">
            {layers.map((l, i) => (
              <Reveal as="li" key={l.n} delay={i * 110} className="rounded-2xl border border-line bg-bg3 p-7 md:p-9" >
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-4xl text-fg md:text-5xl">{l.title}</h3>
                  <span className={`font-mono text-[11px] tracking-[0.22em] ${l.tone}`}>{l.n}</span>
                </div>
                <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-fg2">{l.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
