import { profile } from "@/data/profile";
import { withBase } from "@/lib/preview";
import { Reveal } from "@/components/experience/Reveal";
import { container } from "@/components/experience/SectionHeader";

const facts: [string, string][] = [
  ["Based in", profile.location],
  ["Role", "Full-stack developer"],
  ["Also", "Cybersecurity learner"],
  ["Founder of", "Admunz Data Hub · AdepaMarket"],
  ["Studied", "BSc Computer Science, University of Cape Coast"],
];

export function Hero({ cvAvailable }: { cvAvailable: boolean }) {
  const btn =
    "inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] transition-all duration-[var(--t-fast)]";
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative isolate overflow-hidden pb-24 pt-[calc(var(--nav-h)+4.5rem)] md:pb-36 md:pt-[calc(var(--nav-h)+7rem)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(900px 520px at 82% 0%, rgba(233,177,85,.09), transparent 62%), radial-gradient(700px 420px at 0% 100%, rgba(98,230,165,.045), transparent 60%)" }}
      />
      <div className={container}>
        <div>
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">{profile.name}</p>
          </Reveal>
          <Reveal delay={80}>
            <h1 id="hero-title" className="mt-7 font-display text-[clamp(2.7rem,6.5vw,6.3rem)] leading-[0.95] text-fg">
              Building useful things.
              <br />
              Understanding how they work.
              <br />
              <em className="text-accent">Making them more secure.</em>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-9 max-w-[54ch] text-base leading-relaxed text-fg2 md:text-lg">
              I build web applications and digital products, integrate APIs, and explore practical cybersecurity through hands-on projects and security assessments.
            </p>
          </Reveal>
          <Reveal delay={240} className="mt-10 flex flex-wrap gap-3">
            <a href="#work" className={`${btn} bg-accent text-bg hover:brightness-110`}>
              Explore my work <span aria-hidden="true">↓</span>
            </a>
            {cvAvailable && (
              <a href={withBase(profile.cvPdfPath)} download className={`${btn} border border-line text-fg hover:border-accent hover:text-accent`}>
                View my CV <span aria-hidden="true">↗</span>
                <span className="sr-only">(PDF download)</span>
              </a>
            )}
            <a href="#contact" className={`${btn} border border-line text-fg hover:border-accent hover:text-accent`}>
              Contact me
            </a>
          </Reveal>
          <Reveal delay={320} className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-fg2">
            {profile.github && (
              <a className="link-underline hover:text-fg" href={profile.github} target="_blank" rel="noopener noreferrer">
                GitHub<span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
            <a className="link-underline hover:text-fg" href={profile.website} target="_blank" rel="noopener noreferrer">
              admunz.com<span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a className="link-underline hover:text-fg" href="https://adepamarket.admunz.workers.dev/" target="_blank" rel="noopener noreferrer">
              AdepaMarket<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </Reveal>
        </div>

        <Reveal delay={400} className="mt-16 md:mt-24">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-8 font-mono text-[11px] uppercase tracking-[0.14em] md:grid-cols-5">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="text-fg2">{k}</dt>
                <dd className="mt-2 text-[12px] normal-case leading-snug tracking-normal text-fg">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
