import { describe, expect, it } from "vitest";
import { detectPlatform, parseUserAgent } from "./detect-browser";

const UA = {
  chromeWin: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  edge: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.2592.81",
  firefoxLinux: "Mozilla/5.0 (X11; Linux x86_64; rv:127.0) Gecko/20100101 Firefox/127.0",
  safariMac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
  androidChrome: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36",
  iphoneSafari: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
  opera: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 OPR/111.0.0.0",
};

describe("parseUserAgent", () => {
  it("tells Edge and Opera apart from Chrome", () => {
    expect(parseUserAgent(UA.edge).family).toBe("Microsoft Edge");
    expect(parseUserAgent(UA.opera).family).toBe("Opera");
    expect(parseUserAgent(UA.chromeWin).family).toContain("Chrome");
  });
  it("detects Firefox and Safari with engines", () => {
    expect(parseUserAgent(UA.firefoxLinux)).toMatchObject({ family: "Firefox", version: "127.0", engine: "Gecko" });
    expect(parseUserAgent(UA.safariMac)).toMatchObject({ family: "Safari", version: "17.5", engine: "WebKit" });
  });
  it("reports Unknown rather than guessing", () => {
    expect(parseUserAgent("")).toEqual({ family: "Unknown", version: null, engine: "Unknown" });
    expect(parseUserAgent("curl/8.0")).toMatchObject({ family: "Unknown" });
  });
});

describe("detectPlatform", () => {
  it("prefers Client Hints and labels the method", () => {
    const p = detectPlatform(UA.chromeWin, { platform: "Windows" });
    expect(p).toMatchObject({ os: "Windows", confidence: "best effort" });
    expect(p.method).toContain("Client Hints");
  });
  it("falls back to the legacy user agent in the right order", () => {
    expect(detectPlatform(UA.androidChrome).os).toBe("Android"); // not Linux
    expect(detectPlatform(UA.iphoneSafari).os).toBe("iOS"); // not macOS
    expect(detectPlatform(UA.firefoxLinux).os).toBe("Linux");
    expect(detectPlatform(UA.safariMac).os).toBe("macOS");
  });
  it("is honest when nothing is usable", () => {
    expect(detectPlatform("")).toMatchObject({ os: "Unknown", confidence: "unknown" });
  });
});
