// @vitest-environment node
import { describe, expect, it } from "vitest";
import { analyzeUrl, registrableDomain } from "./url-check";
import { commonPasswords, randomSaltHex, reverseFromTable, saltedHash, sha256Hex } from "./hashing";
import { analyzeHeaders, parseHeaders } from "./headers";

const ids = (r: ReturnType<typeof analyzeUrl>) => (r.ok ? r.signals.map((s) => s.id) : []);

describe("analyzeUrl", () => {
  it("rejects empty and malformed input with a readable error", () => {
    expect(analyzeUrl("  ")).toMatchObject({ ok: false });
    expect(analyzeUrl("has spaces in it")).toMatchObject({ ok: false });
  });
  it("finds the real owner after an @ sign", () => {
    const r = analyzeUrl("https://mtn.com.gh@evil-example.test/login");
    expect(r.ok && r.host).toBe("evil-example.test");
    expect(ids(r)).toContain("userinfo");
  });
  it("flags raw IP hosts, plain http, and punycode", () => {
    expect(ids(analyzeUrl("http://192.0.2.10/verify"))).toEqual(expect.arrayContaining(["ip-host", "http"]));
    expect(ids(analyzeUrl("https://xn--80ak6aa92e.com/"))).toContain("punycode");
  });
  it("flags a brand in a subdomain that is not the brand's domain", () => {
    expect(ids(analyzeUrl("https://mtn.secure-login.example.test/"))).toEqual(expect.arrayContaining(["brand-mtn"]));
  });
  it("does not flag the brand's own domain or a harmless word that contains the brand text", () => {
    expect(ids(analyzeUrl("https://www.mtn.com.gh/")).filter((i) => i.startsWith("brand"))).toEqual([]);
    expect(ids(analyzeUrl("https://pineapple.example.test/")).filter((i) => i.startsWith("brand"))).toEqual([]);
  });
  it("flags look-alike domains built from a brand plus a trust word", () => {
    expect(ids(analyzeUrl("https://mtnsupport.com/"))).toContain("brand-in-domain-mtn");
  });
  it("counts subdomains against the registrable domain", () => {
    expect(registrableDomain("a.b.c.example.com.gh")).toBe("example.com.gh");
    expect(registrableDomain("www.example.com")).toBe("example.com");
    expect(ids(analyzeUrl("https://a.b.c.d.example.test/"))).toContain("subdomains");
  });
  it("raises no warnings for an ordinary https link", () => {
    const r = analyzeUrl("https://example.com/docs");
    expect(r.ok && r.signals.filter((s) => s.severity === "warn")).toEqual([]);
  });
  it("accepts a link without a scheme and says it assumed one", () => {
    const r = analyzeUrl("example.com/page");
    expect(r.ok && r.assumedScheme).toBe(true);
  });
  it("warns on code-carrying schemes", () => {
    expect(ids(analyzeUrl("javascript:alert(1)"))).toContain("scheme");
  });
});

describe("hashing", () => {
  it("matches the known SHA-256 of 'abc'", async () => {
    expect(await sha256Hex("abc")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  });
  it("gives different hashes for the same password with different salts", async () => {
    const a = await saltedHash(randomSaltHex(), "password");
    const b = await saltedHash(randomSaltHex(), "password");
    expect(a).not.toBe(b);
  });
  it("lets a lookup table reverse an unsalted common password but not a salted one", async () => {
    expect(await reverseFromTable(await sha256Hex("password"))).toBe("password");
    expect(await reverseFromTable(await saltedHash(randomSaltHex(), "password"))).toBeNull();
    expect(commonPasswords).toContain("password");
  });
});

describe("analyzeHeaders", () => {
  it("parses headers and skips status lines", () => {
    expect(parseHeaders("HTTP/1.1 200 OK\nServer: nginx\n\nnot a header")).toEqual([{ name: "Server", value: "nginx" }]);
  });
  it("reports everything missing for an empty-ish response", () => {
    const { findings } = analyzeHeaders("HTTP/1.1 200 OK\nContent-Type: text/html");
    const byId = Object.fromEntries(findings.map((f) => [f.id, f.status]));
    expect(byId.hsts).toBe("missing");
    expect(byId.csp).toBe("missing");
    expect(byId.nosniff).toBe("missing");
  });
  it("accepts a well-configured set and flags weak CSP and short HSTS", () => {
    const good = analyzeHeaders(
      "Strict-Transport-Security: max-age=63072000; includeSubDomains\nContent-Security-Policy: default-src 'self'; frame-ancestors 'none'\nX-Content-Type-Options: nosniff\nReferrer-Policy: no-referrer",
    ).findings;
    expect(good.find((f) => f.id === "hsts")?.status).toBe("good");
    expect(good.find((f) => f.id === "csp")?.status).toBe("good");
    expect(good.find((f) => f.id === "frame")?.status).toBe("good");
    const weak = analyzeHeaders("Strict-Transport-Security: max-age=300\nContent-Security-Policy: default-src * 'unsafe-inline'").findings;
    expect(weak.find((f) => f.id === "hsts")?.status).toBe("issue");
    expect(weak.find((f) => f.id === "csp")?.status).toBe("issue");
  });
  it("flags version disclosure and cookies without protective attributes", () => {
    const { findings } = analyzeHeaders("Server: Apache/2.4.1\nSet-Cookie: sid=abc; Path=/\nSet-Cookie: ok=1; Secure; HttpOnly; SameSite=Lax");
    expect(findings.find((f) => f.id === "leak-Server")?.status).toBe("issue");
    expect(findings.find((f) => f.id === "cookie-0")?.status).toBe("issue");
    expect(findings.find((f) => f.id === "cookie-1")?.status).toBe("good");
  });
});
