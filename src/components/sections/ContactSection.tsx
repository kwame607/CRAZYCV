import { profile } from "@/data/profile";
import { Reveal } from "@/components/experience/Reveal";
import { container } from "@/components/experience/SectionHeader";

export function ContactSection() {
  const email = profile.email;
  const mailto = email
    ? `mailto:${email}?subject=${encodeURIComponent("Hello from your portfolio")}&body=${encodeURIComponent("Hi Kwame,\n\nI saw your portfolio and wanted to talk about...\n")}`
    : null;
  const link = "link-underline inline-block text-fg hover:text-accent";
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden py-28 md:py-44">
      <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: "radial-gradient(800px 420px at 50% 100%, rgba(233,177,85,.12), transparent 65%)" }} />
      <div className={container}>
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
            08 <span className="text-fg2">/</span> Contact
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 id="contact-title" className="mt-6 max-w-[16ch] font-display text-[clamp(3rem,9vw,8.4rem)] leading-[0.92] text-fg">
            Let&rsquo;s build something <em className="text-accent">useful.</em>
          </h2>
        </Reveal>
        <Reveal delay={160} className="mt-12 grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div>
            {mailto && email ? (
              <a href={mailto} className="link-underline break-all font-display text-[clamp(1.7rem,4.4vw,3.4rem)] leading-tight text-fg hover:text-accent">
                {email}
              </a>
            ) : (
              <p className="text-fg2">Email is not configured. Reach me through GitHub.</p>
            )}
            <p className="mt-4 max-w-[44ch] text-sm leading-relaxed text-fg2">
              There&rsquo;s no contact form on purpose: nothing here would receive it. That link opens your own email app with a message ready to edit.
            </p>
          </div>
          <ul className="space-y-3 font-mono text-[12px] uppercase tracking-[0.16em]">
            {profile.github && (
              <li>
                <a className={link} href={profile.github} target="_blank" rel="noopener noreferrer">
                  GitHub ↗<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            )}
            <li>
              <a className={link} href={profile.website} target="_blank" rel="noopener noreferrer">
                admunz.com ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a className={link} href="https://adepamarket.admunz.workers.dev/" target="_blank" rel="noopener noreferrer">
                AdepaMarket ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li className="pt-2 text-fg2">{profile.location}</li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
