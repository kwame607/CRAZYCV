import type { InfoItem } from "@/types/browser-info";

export interface Capabilities {
  javascript: true;
  cookies: boolean;
  localStorage: boolean;
  webgl: boolean;
  webassembly: boolean;
  webCrypto: boolean;
  serviceWorker: boolean;
  webSocket: boolean;
  webRtc: boolean;
  secureContext: boolean;
}

function tryOr(fn: () => boolean): boolean {
  try {
    return fn();
  } catch {
    return false;
  }
}

/**
 * Feature detection only. A capability being present says nothing about the
 * browser being secure, and nothing here probes the device or network.
 * Browser-only: call from client code.
 */
export function detectCapabilities(): Capabilities {
  return {
    javascript: true, // this code is running
    cookies: tryOr(() => navigator.cookieEnabled),
    localStorage: tryOr(() => {
      const k = "__adom_probe__";
      window.localStorage.setItem(k, "1");
      window.localStorage.removeItem(k);
      return true;
    }),
    webgl: tryOr(() => {
      const c = document.createElement("canvas");
      return !!(c.getContext("webgl2") ?? c.getContext("webgl"));
    }),
    webassembly: tryOr(() => typeof WebAssembly === "object"),
    webCrypto: tryOr(() => typeof crypto !== "undefined" && !!crypto.subtle),
    serviceWorker: tryOr(() => "serviceWorker" in navigator),
    webSocket: tryOr(() => typeof WebSocket !== "undefined"),
    // Existence check only. No peer connection is created, so no addresses are gathered.
    webRtc: tryOr(() => typeof RTCPeerConnection !== "undefined"),
    secureContext: tryOr(() => window.isSecureContext),
  };
}

const labels: Record<keyof Capabilities, string> = {
  javascript: "JavaScript",
  cookies: "Cookies enabled",
  localStorage: "Local storage",
  webgl: "WebGL",
  webassembly: "WebAssembly",
  webCrypto: "Web Crypto API",
  serviceWorker: "Service Workers",
  webSocket: "WebSocket",
  webRtc: "WebRTC (API present)",
  secureContext: "Secure context",
};

export function capabilityItems(c: Capabilities): InfoItem[] {
  return (Object.keys(labels) as (keyof Capabilities)[]).map((key) => ({
    label: labels[key],
    value: c[key] ? "Available" : "Not available in this browser",
    status: c[key] ? "detected" : "unavailable",
    ...(key === "webRtc"
      ? { note: "Only checks that the API exists. No connection is made and no addresses are collected." }
      : {}),
  }));
}
