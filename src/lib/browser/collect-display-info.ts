import type { InfoItem, InfoSection, ParsedBrowser, ParsedPlatform, ServerInfoState, IpState } from "@/types/browser-info";
import { capabilityItems, detectCapabilities } from "./detect-capabilities";
import { detectPlatform, parseUserAgent, type UaDataLike } from "./detect-browser";

interface NetworkInformationLike {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

export interface ClientSnapshot {
  parsed: ParsedBrowser;
  platform: ParsedPlatform;
  userAgent: string;
  uaDataBrands: string | null;
  platformVersion: string | null;
  language: string;
  languages: string[];
  timeZone: string;
  screen: { w: number; h: number };
  viewport: { w: number; h: number };
  pixelRatio: number;
  colorScheme: "dark" | "light" | "no-preference";
  reducedMotion: boolean;
  online: boolean;
  protocol: string;
  origin: string;
  network: NetworkInformationLike | null;
  navTiming: { ttfbMs: number; domContentLoadedMs: number } | null;
  capabilities: ReturnType<typeof detectCapabilities>;
}

/** Collect the synchronous snapshot. Browser-only. No network requests are made. */
export function collectClientSnapshot(): ClientSnapshot {
  const ua = navigator.userAgent;
  const uaData = (navigator as Navigator & { userAgentData?: UaDataLike }).userAgentData ?? null;
  const conn = (navigator as Navigator & { connection?: NetworkInformationLike }).connection ?? null;
  const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;

  const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const light = window.matchMedia("(prefers-color-scheme: light)").matches;

  return {
    parsed: parseUserAgent(ua),
    platform: detectPlatform(ua, uaData),
    userAgent: ua,
    uaDataBrands: uaData?.brands?.length
      ? uaData.brands.map((b) => `${b.brand} ${b.version}`).join(", ")
      : null,
    platformVersion: null,
    language: navigator.language,
    languages: [...(navigator.languages ?? [])],
    timeZone: (() => {
      try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
      } catch {
        return "Unavailable";
      }
    })(),
    screen: { w: window.screen.width, h: window.screen.height },
    viewport: { w: window.innerWidth, h: window.innerHeight },
    pixelRatio: window.devicePixelRatio,
    colorScheme: dark ? "dark" : light ? "light" : "no-preference",
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    online: navigator.onLine,
    protocol: window.location.protocol,
    origin: window.location.origin,
    network: conn
      ? { effectiveType: conn.effectiveType, downlink: conn.downlink, rtt: conn.rtt, saveData: conn.saveData }
      : null,
    navTiming: nav
      ? { ttfbMs: Math.round(nav.responseStart - nav.startTime), domContentLoadedMs: Math.round(nav.domContentLoadedEventEnd - nav.startTime) }
      : null,
    capabilities: detectCapabilities(),
  };
}

const NA = "Not available in this browser";

/**
 * Optional: request high-entropy Client Hints. Only asks for the platform
 * version, only when supported, and never required. Returns null on failure.
 */
export async function readPlatformVersion(): Promise<string | null> {
  try {
    const uaData = (navigator as Navigator & {
      userAgentData?: { getHighEntropyValues?: (h: string[]) => Promise<{ platformVersion?: string }> };
    }).userAgentData;
    if (!uaData?.getHighEntropyValues) return null;
    const v = await uaData.getHighEntropyValues(["platformVersion"]);
    return v.platformVersion || null;
  } catch {
    return null;
  }
}

export function buildSections(
  s: ClientSnapshot,
  server: ServerInfoState,
  ip: IpState,
): InfoSection[] {
  const browser: InfoItem[] = [
    { label: "Browser", value: s.parsed.family, status: s.parsed.family === "Unknown" ? "unavailable" : "inferred", note: "Parsed from the user-agent string, which can be reduced or spoofed." },
    { label: "Version", value: s.parsed.version ?? NA, status: s.parsed.version ? "inferred" : "unavailable" },
    { label: "Engine", value: s.parsed.engine, status: s.parsed.engine === "Unknown" ? "unavailable" : "inferred" },
    { label: "Operating system", value: s.platform.os, status: s.platform.confidence === "unknown" ? "unavailable" : "inferred", note: `Detection method: ${s.platform.method}. Confidence: ${s.platform.confidence}. Only the browser-reported platform is shown, not a confirmed OS version.` },
    ...(s.platformVersion
      ? [{ label: "Platform version (Client Hints)", value: s.platformVersion, status: "detected" as const, note: "Reported by the browser; may not match the real OS release." }]
      : []),
    { label: "Client Hints brands", value: s.uaDataBrands ?? NA, status: s.uaDataBrands ? "detected" : "unavailable" },
    { label: "User-agent", value: s.userAgent, status: "detected", note: "Raw string as sent by the browser. Best-effort signal only." },
    ...capabilityItems(s.capabilities),
  ];

  const device: InfoItem[] = [
    { label: "Screen size", value: `${s.screen.w} × ${s.screen.h} px`, status: "detected", note: "Size of the whole display, not of this page." },
    { label: "Viewport size", value: `${s.viewport.w} × ${s.viewport.h} px`, status: "detected", note: "Size of the visible page area inside the browser window." },
    { label: "Device pixel ratio", value: String(s.pixelRatio), status: "detected" },
    { label: "Language", value: s.language || NA, status: s.language ? "detected" : "unavailable" },
    { label: "Preferred languages", value: s.languages.join(", ") || NA, status: s.languages.length ? "detected" : "unavailable" },
    { label: "Time zone", value: s.timeZone, status: s.timeZone === "Unavailable" ? "unavailable" : "detected" },
    { label: "Color scheme preference", value: s.colorScheme, status: "detected" },
    { label: "Reduced motion", value: s.reducedMotion ? "Preferred" : "No preference", status: "detected" },
  ];

  const connection: InfoItem[] = [
    { label: "Page protocol", value: s.protocol.replace(":", "").toUpperCase(), status: "detected", note: s.protocol === "https:" ? "Connection to this site is encrypted." : "Not HTTPS. Expected on localhost during development only." },
    { label: "Browser online flag", value: s.online ? "Online" : "Offline", status: "detected", note: "navigator.onLine only reports whether the browser thinks it has a network link. It does not prove the internet is reachable." },
    s.network
      ? { label: "Connection estimate", value: [s.network.effectiveType, s.network.downlink != null ? `${s.network.downlink} Mbit/s` : null, s.network.rtt != null ? `${s.network.rtt} ms RTT` : null].filter(Boolean).join(" · ") || NA, status: "inferred", note: "Network Information API. Rounded estimate, not a measurement of your line." }
      : { label: "Connection estimate", value: NA, status: "unavailable", note: "The Network Information API is not supported here (for example Firefox and Safari)." },
    s.navTiming
      ? { label: "This page's load timing", value: `first byte ${s.navTiming.ttfbMs} ms · DOM ready ${s.navTiming.domContentLoadedMs} ms`, status: "detected", note: "From the Navigation Timing API for this site only." }
      : { label: "This page's load timing", value: NA, status: "unavailable" },
    ipItem(ip),
    { label: "Local (LAN) IP", value: "Not collected", status: "unavailable", note: "Websites cannot reliably read a private LAN address, and this site deliberately does not try (no WebRTC address harvesting, no local scanning)." },
  ];

  const portfolio: InfoItem[] = [
    { label: "Origin", value: s.origin, status: "detected" },
    ...serverItems(server),
  ];

  return [
    { id: "browser", title: "Browser", items: browser },
    { id: "device", title: "Device", items: device },
    { id: "connection", title: "Connection", items: connection },
    { id: "portfolio", title: "Portfolio System", items: portfolio },
  ];
}

function ipItem(ip: IpState): InfoItem {
  const privacy = "Your public IP can reveal approximate network or geographic information. VPNs, proxies and carrier NAT change the result. It is not stored by this site.";
  switch (ip.state) {
    case "ok":
      return { label: "Public IP", value: ip.ip, status: "detected", note: `Method: ${ip.method}. Retrieved ${ip.retrievedAt}. ${privacy}` };
    case "loading":
      return { label: "Public IP", value: "Retrieving…", status: "not-requested" };
    case "failed":
      return { label: "Public IP", value: "Not retrieved", status: "unavailable", note: ip.message };
    default:
      return { label: "Public IP", value: "Not requested", status: "not-requested", note: "Optional. Use the button to look it up. " + privacy };
  }
}

function serverItems(server: ServerInfoState): InfoItem[] {
  if (server.state === "loading") {
    return [{ label: "Server info", value: "Loading…", status: "not-requested" }];
  }
  if (server.state === "static") {
    return [
      { label: "Server API", value: "Not available in this static preview", status: "unavailable", note: "GitHub Pages serves static files only, so /api/* does not exist here. On a Next.js host these rows show live values." },
      { label: "App version", value: server.version, status: server.version === "not configured" ? "unavailable" : "detected", note: "Baked in at build time from package.json." },
      { label: "Build identifier", value: server.build, status: server.build === "not configured" ? "unavailable" : "detected", note: "Baked in at build time (commit SHA)." },
    ];
  }
  if (server.state === "error") {
    return [{ label: "API availability", value: "Unavailable", status: "unavailable", note: `${server.message}. The rest of the portfolio works without it.` }];
  }
  const i = server.info;
  return [
    { label: "App version", value: i.version, status: "detected", note: "From release configuration." },
    { label: "Build identifier", value: i.build, status: i.build === "not configured" ? "unavailable" : "detected" },
    { label: "Deployment environment", value: i.environment, status: "detected" },
    { label: "Health", value: i.health.toUpperCase(), status: "detected" },
    { label: "API round trip", value: `${server.roundTripMs} ms`, status: "detected", note: "Time for one request to /api/system from your browser." },
  ];
}
