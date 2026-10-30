"use client";

import Link from "next/link";
import { replayIntro } from "@/lib/experience/actions";
import { container } from "@/components/experience/SectionHeader";

export function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className={`${container} flex flex-col items-start justify-between gap-6 font-mono text-[11px] uppercase tracking-[0.18em] text-fg2 sm:flex-row sm:items-center`}>
        <p>© Kwame Emmanuel Adom · Kumasi, Ghana</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/security-tools" className="link-underline hover:text-fg">
            Security tools
          </Link>
          <Link href="/network-tools" className="link-underline hover:text-fg">
            Network tools
          </Link>
          <button type="button" onClick={replayIntro} className="link-underline hover:text-fg">
            Replay intro
          </button>
          <a href="#hero" className="link-underline hover:text-fg">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
