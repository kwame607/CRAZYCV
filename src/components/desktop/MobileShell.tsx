"use client";

import { apps, appById } from "./apps";
import { useDesktop } from "./DesktopProvider";
import { TopBar } from "./TopBar";

/** Single-active-view layout for narrow screens: no overlapping windows. */
export function MobileShell() {
  const { mobileApp, openApp } = useDesktop();
  const { Component, title } = appById[mobileApp];
  return (
    <div className="desk-bg flex h-dvh flex-col">
      <TopBar compact />
      <main id="app-view" aria-label={title} className="scroll-thin min-h-0 flex-1 overflow-y-auto p-4">
        <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-accent">{title}</h2>
        <Component />
      </main>
      <nav aria-label="Applications" className="flex shrink-0 gap-1 overflow-x-auto border-t border-line bg-bg2 px-2 py-1.5">
        {apps.map(({ id, title: t, Icon }) => (
          <button
            key={id}
            type="button"
            aria-label={t}
            aria-current={mobileApp === id ? "page" : undefined}
            onClick={() => openApp(id)}
            className={`flex min-w-[64px] shrink-0 flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] ${mobileApp === id ? "bg-white/10 text-accent" : "text-fg2"}`}
          >
            <Icon className="h-5 w-5" aria-hidden />
            {t.split(" ")[0]}
          </button>
        ))}
      </nav>
    </div>
  );
}
