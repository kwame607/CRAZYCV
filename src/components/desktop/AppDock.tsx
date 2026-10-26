"use client";

import { apps } from "./apps";
import { useDesktop } from "./DesktopProvider";

export function AppDock() {
  const { state, openApp, dispatch } = useDesktop();
  return (
    <nav aria-label="Applications" className="flex w-[72px] shrink-0 flex-col items-center gap-1 overflow-y-auto border-r border-line bg-bg2/80 py-3">
      {apps.map(({ id, title, Icon }) => {
        const w = state.wins[id];
        const running = w.open;
        return (
          <button
            key={id}
            type="button"
            aria-label={title}
            title={title}
            aria-pressed={running && !w.minimized}
            onClick={() => (running && !w.minimized && state.active === id ? dispatch({ type: "minimize", id }) : openApp(id))}
            className={`relative flex h-12 w-14 flex-col items-center justify-center gap-0.5 rounded-lg text-fg2 hover:bg-white/10 hover:text-fg ${
              running && !w.minimized ? "bg-white/[0.06] text-fg" : ""
            }`}
          >
            <Icon className="h-5 w-5" aria-hidden />
            <span className="max-w-full truncate px-0.5 text-[10px] leading-none">{title.split(" ")[0]}</span>
            {running && <span aria-hidden className="absolute -left-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent" />}
          </button>
        );
      })}
    </nav>
  );
}
