import { Reveal } from "@/components/experience/Reveal";
import { SectionHeader, container } from "@/components/experience/SectionHeader";

const layers = [
  {
    n: "01",
    title: "Investigate",
    tone: "text-term",
    body: "Hands-on security learning in an isolated lab: Kali Linux, Nmap and Metasploit against deliberately vulnerable machines, never against systems I don't have permission to test.",
  },
  {
    n: "02",
    title: "Improve",
    tone: "text-cream",
    body: "Turning what I learn into practice: documented findings, fixes, retests. This is the part I'm still building evidence for, and the Security section says so plainly.",
  },
  {
    n: "03",
    title: "Build",
    tone: "text-accent",
    body: "My strongest web fundamentals are HTML, CSS and basic JavaScript. I have also built AI-assisted applications with Node.js, TypeScript and modern frameworks. I direct and deploy them; I don't claim to have written all of that code myself.",
  },
];

const facts: [string, string][] = [
  ["Education", "BSc Computer Science, University of Cape Coast"],
  ["Final-year project", "MoMo Fraud Shield, a machine-learning prototype for spotting mobile money scam messages"],
  ["Training", "Cisco Networking Academy: Introduction to Cybersecurity (certificate); Ethical Hacking (continuing study)"],
  ["Based in", "Kumasi, Ghana"],
];

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="border-t border-line bg-bg2 py-24 md:py-36">
      <div className={container}>
        <SectionHeader index="03" label="About">
          <span id="about-title">
            I want to understand how software is built, <em className="text-accent">how it fails,</em> and how it can be improved.
          </span>
        </SectionHeader>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <p className="max-w-[48ch] text-lg leading-relaxed text-fg2">
              I&rsquo;m an aspiring cybersecurity professional in Kumasi with a Computer Science degree. I&rsquo;m building my skills the careful way: understand the system first, test only what I&rsquo;m authorised to test, and write down what I actually observed.
            </p>
            <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-fg2">
              I have also built and launched a few web products with AI assistance. They taught me how real applications are put together, which is useful when the job is to find where they break.
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
