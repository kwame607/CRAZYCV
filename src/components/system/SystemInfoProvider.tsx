"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { z } from "zod";
import type { InfoSection, IpState, ServerInfoState } from "@/types/browser-info";
import { buildSections, collectClientSnapshot, readPlatformVersion, type ClientSnapshot } from "@/lib/browser/collect-display-info";

interface SystemInfoValue {
  ready: boolean;
  sections: InfoSection[];
  ip: IpState;
  /** Explicit, user-initiated. Resolves to the IP or rejects. */
  requestIp: () => Promise<string>;
  clearIp: () => void;
  refresh: () => void;
}

const Ctx = createContext<SystemInfoValue | null>(null);

const serverInfoSchema = z.object({
  app: z.string(),
  version: z.string(),
  build: z.string(),
  environment: z.string(),
  health: z.literal("ok"),
  time: z.string(),
});

const ipSchema = z.object({
  ip: z.string().min(2).max(45),
  method: z.string(),
  retrievedAt: z.string(),
});

async function fetchJson(url: string, timeoutMs: number): Promise<unknown> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { cache: "no-store", signal: ctrl.signal, credentials: "omit" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

export function SystemInfoProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<ClientSnapshot | null>(null);
  const [server, setServer] = useState<ServerInfoState>({ state: "loading" });
  const [ip, setIp] = useState<IpState>({ state: "not-requested" });
  const ipRef = useRef(ip);
  useEffect(() => {
    ipRef.current = ip;
  }, [ip]);

  const loadServer = useCallback(async () => {
    setServer({ state: "loading" });
    const t0 = performance.now();
    try {
      const data = serverInfoSchema.parse(await fetchJson("/api/system", 6000));
      setServer({ state: "ok", info: data, roundTripMs: Math.round(performance.now() - t0) });
    } catch {
      setServer({ state: "error", message: "Could not reach /api/system" });
    }
  }, []);

  const loadSnapshot = useCallback(async () => {
    const snap = collectClientSnapshot();
    setSnapshot(snap);
    // Optional, local-only: shown to the visitor, never sent anywhere.
    const pv = await readPlatformVersion();
    if (pv) setSnapshot((prev) => (prev ? { ...prev, platformVersion: pv } : prev));
  }, []);

  useEffect(() => {
    // Initial load on mount: browser APIs are only available client-side.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadSnapshot();
    void loadServer();
    const update = () => setSnapshot((prev) => (prev ? { ...prev, ...collectLive() } : prev));
    window.addEventListener("resize", update);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, [loadSnapshot, loadServer]);

  const requestIp = useCallback(async () => {
    setIp({ state: "loading" });
    try {
      const data = ipSchema.parse(await fetchJson("/api/ip", 6000));
      setIp({ state: "ok", ip: data.ip, method: data.method, retrievedAt: new Date(data.retrievedAt).toLocaleTimeString() });
      return data.ip;
    } catch {
      setIp({ state: "failed", message: "The lookup did not complete. This is optional; nothing else is affected." });
      throw new Error("ip lookup failed");
    }
  }, []);

  const clearIp = useCallback(() => setIp({ state: "not-requested" }), []);

  const refresh = useCallback(() => {
    void loadSnapshot();
    void loadServer();
    // The public IP is deliberately NOT re-requested here.
  }, [loadSnapshot, loadServer]);

  const sections = useMemo(() => (snapshot ? buildSections(snapshot, server, ip) : []), [snapshot, server, ip]);

  const value = useMemo<SystemInfoValue>(
    () => ({ ready: snapshot !== null, sections, ip, requestIp, clearIp, refresh }),
    [snapshot, sections, ip, requestIp, clearIp, refresh],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

function collectLive() {
  return {
    viewport: { w: window.innerWidth, h: window.innerHeight },
    online: navigator.onLine,
  };
}

export function useSystemInfo(): SystemInfoValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSystemInfo must be used inside SystemInfoProvider");
  return v;
}
