import type { ParsedBrowser, ParsedPlatform } from "@/types/browser-info";

/**
 * Best-effort user-agent parsing. User-agent strings can be reduced, frozen,
 * or spoofed, so every result is a signal, not a fact.
 */
export function parseUserAgent(ua: string): ParsedBrowser {
  const match = (re: RegExp) => re.exec(ua)?.[1] ?? null;

  // Order matters: Chromium-based browsers also contain "Chrome" and "Safari".
  const edge = match(/\bEdgA?\/([\d.]+)/) ?? match(/\bEdge\/([\d.]+)/) ?? match(/\bEdgiOS\/([\d.]+)/);
  if (edge) return { family: "Microsoft Edge", version: edge, engine: /\bEdge\//.test(ua) ? "EdgeHTML" : engineOf(ua) };

  const opera = match(/\bOPR\/([\d.]+)/);
  if (opera) return { family: "Opera", version: opera, engine: "Blink" };

  const samsung = match(/\bSamsungBrowser\/([\d.]+)/);
  if (samsung) return { family: "Samsung Internet", version: samsung, engine: "Blink" };

  const firefox = match(/\bFirefox\/([\d.]+)/) ?? match(/\bFxiOS\/([\d.]+)/);
  if (firefox) return { family: "Firefox", version: firefox, engine: /\bFxiOS\//.test(ua) ? "WebKit" : "Gecko" };

  const chrome = match(/\bChrome\/([\d.]+)/) ?? match(/\bCriOS\/([\d.]+)/);
  if (chrome) return { family: "Chrome or Chromium-based", version: chrome, engine: /\bCriOS\//.test(ua) ? "WebKit" : "Blink" };

  if (/\bSafari\//.test(ua)) {
    const v = match(/\bVersion\/([\d.]+)/);
    return { family: "Safari", version: v, engine: "WebKit" };
  }

  return { family: "Unknown", version: null, engine: "Unknown" };
}

function engineOf(ua: string): string {
  if (/\bFirefox\//.test(ua)) return "Gecko";
  if (/\bChrome\//.test(ua) || /\bEdgA?\//.test(ua)) return "Blink";
  if (/\bAppleWebKit\//.test(ua)) return "WebKit";
  return "Unknown";
}

/** Minimal shape of the User-Agent Client Hints API, which is not in every TS lib. */
export interface UaDataLike {
  platform?: string;
  mobile?: boolean;
  brands?: { brand: string; version: string }[];
}

const hintPlatforms: Record<string, string> = {
  Windows: "Windows",
  macOS: "macOS",
  Linux: "Linux",
  Android: "Android",
  "Chrome OS": "ChromeOS",
  iOS: "iOS",
};

export function detectPlatform(ua: string, uaData?: UaDataLike | null): ParsedPlatform {
  if (uaData?.platform) {
    const name = hintPlatforms[uaData.platform] ?? uaData.platform;
    return { os: name, method: "User-Agent Client Hints (platform)", confidence: "best effort" };
  }

  // Order matters: Android UAs contain "Linux"; iPadOS may report as Macintosh.
  const rules: [RegExp, string][] = [
    [/Android/i, "Android"],
    [/iPhone|iPad|iPod/i, "iOS"],
    [/CrOS/i, "ChromeOS"],
    [/Windows/i, "Windows"],
    [/Mac OS X|Macintosh/i, "macOS"],
    [/Linux|X11/i, "Linux"],
  ];
  for (const [re, name] of rules) {
    if (re.test(ua)) return { os: name, method: "Legacy user-agent string", confidence: "best effort" };
  }
  return { os: "Unknown", method: "No usable platform signal", confidence: "unknown" };
}
