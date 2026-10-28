import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export const container = "mx-auto w-full max-w-[1240px] px-5 md:px-10";

/** Small mono index + a large serif title. The pairing is the site's typographic signature. */
export function SectionHeader({ index, label, children, lead }: { index: string; label: string; children: ReactNode; lead?: ReactNode }) {
  return (
    <header className="max-w-[60rem]">
      <Reveal>
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
          {index} <span className="text-fg2">/</span> {label}
        </p>
        <div aria-hidden="true" className="rule-draw mt-4 h-px w-24 bg-accent" />
      </Reveal>
      <Reveal delay={80}>
        <h2 className="mt-6 font-display text-[clamp(2.6rem,7vw,6rem)] leading-[0.95] text-fg">{children}</h2>
      </Reveal>
      {lead && (
        <Reveal delay={160}>
          <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-fg2 md:text-lg">{lead}</p>
        </Reveal>
      )}
    </header>
  );
}
