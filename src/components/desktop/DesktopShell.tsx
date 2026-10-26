"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { DesktopProvider, useDesktop } from "./DesktopProvider";
import { SystemInfoProvider } from "@/components/system/SystemInfoProvider";
import { AppDock } from "./AppDock";
import { TopBar } from "./TopBar";
import { DesktopWindow } from "./DesktopWindow";
import { MobileShell } from "./MobileShell";
import { BootScreen } from "./BootScreen";
import { appIds } from "./window-state";

const QUERY = "(max-width: 767px)";

function useIsMobile(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(QUERY);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

function Workspace() {
  const { dispatch, state } = useDesktop();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const report = () => dispatch({ type: "bounds", w: el.clientWidth, h: el.clientHeight });
    report();
    const ro = new ResizeObserver(report);
    ro.observe(el);
    return () => ro.disconnect();
  }, [dispatch]);

  return (
    <div className="desk-bg flex h-dvh flex-col">
      <TopBar />
      <div className="flex min-h-0 flex-1">
        <AppDock />
        <main id="workspace" ref={ref} aria-label="Desktop workspace" className="relative min-w-0 flex-1 overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute bottom-4 right-5 select-none text-right font-mono text-[11px] text-fg2/50">
            ADOM {"//"} OS · portfolio of Kwame Emmanuel Adom
          </div>
          {appIds.map((id) => (
            <DesktopWindow key={id} id={id} />
          ))}
          {appIds.every((id) => !state.wins[id].open || state.wins[id].minimized) && (
            <p className="absolute inset-0 grid place-items-center text-sm text-fg2">All windows are closed or minimized. Choose an app from the dock.</p>
          )}
        </main>
      </div>
    </div>
  );
}

function Screen() {
  const mobile = useIsMobile();
  return mobile ? <MobileShell /> : <Workspace />;
}

export function DesktopShell({ pdfAvailable }: { pdfAvailable: boolean }) {
  const [booted, setBooted] = useState(false);
  const done = useCallback(() => setBooted(true), []);
  return (
    <SystemInfoProvider>
      <DesktopProvider pdfAvailable={pdfAvailable}>
        <Screen />
        {!booted && <BootScreen onDone={done} />}
      </DesktopProvider>
    </SystemInfoProvider>
  );
}
