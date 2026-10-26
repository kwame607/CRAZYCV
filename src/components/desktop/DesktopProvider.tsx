"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import type { AppId } from "@/types/terminal";
import { appIds, initialState, wmReducer, type WmAction, type WmState } from "./window-state";

export type AppParams = Partial<Record<AppId, { slug?: string; n: number }>>;

interface DesktopValue {
  state: WmState;
  dispatch: (a: WmAction) => void;
  openApp: (id: AppId, params?: { slug?: string }) => void;
  /** Last app opened; used by the single-view mobile layout. */
  mobileApp: AppId;
  params: AppParams;
  pdfAvailable: boolean;
}

const Ctx = createContext<DesktopValue | null>(null);
const STORAGE_KEY = "adom-os-layout-v1";

export function DesktopProvider({ children, pdfAvailable }: { children: ReactNode; pdfAvailable: boolean }) {
  const [state, dispatch] = useReducer(wmReducer, undefined, initialState);
  const [mobileApp, setMobileApp] = useState<AppId>("home");
  const [params, setParams] = useState<AppParams>({});
  const [hydrated, setHydrated] = useState(false);

  // Restore harmless layout preferences for this browser session only.
  useEffect(() => {
    let restored = false;
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Record<string, unknown>;
        if (saved && typeof saved === "object") {
          dispatch({ type: "hydrate", saved: saved as never });
          restored = Object.values(saved as Record<string, { open?: boolean }>).some((w) => w?.open);
        }
      }
    } catch {
      /* storage blocked or corrupt: fall back to defaults */
    }
    if (!restored) {
      dispatch({ type: "open", id: "system" });
      dispatch({ type: "open", id: "home" });
    }
    // Hydration flag flips once after the layout has been restored.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const out: Record<string, unknown> = {};
      for (const id of appIds) {
        const w = state.wins[id];
        if (w.placed) out[id] = { x: w.x, y: w.y, w: w.w, h: w.h, open: w.open, minimized: w.minimized, z: w.z };
      }
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(out));
    } catch {
      /* ignore */
    }
  }, [state.wins, hydrated]);

  const openApp = useCallback((id: AppId, p?: { slug?: string }) => {
    if (p) setParams((prev) => ({ ...prev, [id]: { ...p, n: (prev[id]?.n ?? 0) + 1 } }));
    setMobileApp(id);
    dispatch({ type: "open", id });
  }, []);

  const value = useMemo(
    () => ({ state, dispatch, openApp, mobileApp, params, pdfAvailable }),
    [state, openApp, mobileApp, params, pdfAvailable],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDesktop(): DesktopValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDesktop must be used inside DesktopProvider");
  return v;
}

/** Returns null outside the desktop (static routes), so shared apps can degrade. */
export function useDesktopOptional(): DesktopValue | null {
  return useContext(Ctx);
}
