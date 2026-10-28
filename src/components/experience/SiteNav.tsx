"use client";

import { useEffect, useState } from "react";
import { replayIntro, sectionIds, type SectionId } from "@/lib/experience/actions";

const links: { id: SectionId; label: string }[] = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "security", label: "Security" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    const els = sectionIds.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id as SectionId);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const replay = () => {
    setOpen(false);
    replayIntro();
  };

  const linkCls = "font-mono text-[11px] uppercase tracking-[0.2em] text-fg2 transition-colors duration-[var(--t-fast)] hover:text-fg aria-[current=true]:text-accent";

  return (
    <header className="site-nav fixed inset-x-0 top-0 z-40 border-b border-line bg-bg/75 backdrop-blur-md">
      <div className="mx-auto flex h-[var(--nav-h)] max-w-[1240px] items-center justify-between px-5 md:px-10">
        <a href="#hero" className="font-mono text-sm tracking-[0.18em] text-fg">
          KA<span className="text-accent">.</span>
          <span className="sr-only"> Kwame Adom, back to the top</span>
        </a>

        <nav aria-label="Sections" className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`} aria-current={active === l.id ? "true" : undefined} className={linkCls}>
              {l.label}
            </a>
          ))}
          <a href="#terminal" aria-current={active === "terminal" ? "true" : undefined} className="rounded-full border border-term/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-term transition-colors duration-[var(--t-fast)] hover:bg-term/10">
            &gt;_ Terminal
          </a>
          <button type="button" onClick={replay} className={linkCls}>
            Replay intro
          </button>
        </nav>

        <button
          type="button"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <nav id="mobile-menu" aria-label="Sections (mobile)" hidden={!open} className="border-t border-line bg-bg/95 px-5 pb-6 pt-3 md:hidden">
        <ul className="flex flex-col">
          {links.map((l) => (
            <li key={l.id}>
              <a href={`#${l.id}`} onClick={() => setOpen(false)} className="block border-b border-line py-4 font-display text-3xl text-fg">
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#terminal" onClick={() => setOpen(false)} className="block border-b border-line py-4 font-mono text-sm uppercase tracking-[0.2em] text-term">
              &gt;_ Terminal
            </a>
          </li>
          <li>
            <button type="button" onClick={replay} className="block w-full py-4 text-left font-mono text-sm uppercase tracking-[0.2em] text-fg2">
              Replay intro
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
