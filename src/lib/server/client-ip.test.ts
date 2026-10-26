import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { readClientIp } from "./client-ip";

const h = (o: Record<string, string>) => new Headers(o);

describe("readClientIp", () => {
  it("returns a valid forwarded public IPv4 and names the method", () => {
    const r = readClientIp(h({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" }));
    expect(r).toMatchObject({ kind: "ok", ip: "203.0.113.7" });
    if (r.kind === "ok") expect(r.method).toContain("x-forwarded-for");
  });
  it("accepts public IPv6", () => {
    expect(readClientIp(h({ "x-real-ip": "2001:db8::1" }))).toMatchObject({ kind: "ok", ip: "2001:db8::1" });
  });
  it("never labels loopback or private addresses as a public IP", () => {
    for (const ip of ["::1", "127.0.0.1", "10.1.2.3", "192.168.0.9", "172.20.0.1", "100.64.1.1", "fe80::1", "fd00::1", "::ffff:127.0.0.1"]) {
      expect(readClientIp(h({ "x-forwarded-for": ip })).kind).toBe("non-public");
    }
  });
  it("never echoes anything that is not an IP address", () => {
    expect(readClientIp(h({ "x-forwarded-for": "<script>alert(1)</script>" })).kind).toBe("none");
    expect(readClientIp(h({ "x-real-ip": "1.2.3.4; DROP TABLE" })).kind).toBe("none");
  });
  it("returns none when no header is present", () => {
    expect(readClientIp(h({})).kind).toBe("none");
  });
});
