import { describe, expect, it } from "vitest";
import { calculateSubnet, classifyIPv4, parseIPv4, parsePrefix } from "./subnet";

describe("parseIPv4", () => {
  it.each(["", "1.2.3", "1.2.3.4.5", "256.1.1.1", "a.b.c.d", "01.2.3.4", "1.2.3.-4", "1. 2.3.4"])("rejects %j", (s) => {
    expect(parseIPv4(s).ok).toBe(false);
  });
  it("parses a valid address", () => {
    expect(parseIPv4("192.168.1.1")).toEqual({ ok: true, value: 3232235777 });
  });
});

describe("parsePrefix", () => {
  it("accepts /n, n and dotted masks", () => {
    expect(parsePrefix("/24")).toEqual({ ok: true, prefix: 24 });
    expect(parsePrefix("24")).toEqual({ ok: true, prefix: 24 });
    expect(parsePrefix("255.255.255.0")).toEqual({ ok: true, prefix: 24 });
    expect(parsePrefix("0.0.0.0")).toEqual({ ok: true, prefix: 0 });
  });
  it("rejects out-of-range and non-contiguous masks", () => {
    expect(parsePrefix("/33").ok).toBe(false);
    expect(parsePrefix("255.0.255.0").ok).toBe(false);
    expect(parsePrefix("hello").ok).toBe(false);
  });
});

describe("calculateSubnet", () => {
  it("computes a /26", () => {
    const r = calculateSubnet("192.168.1.130", "/26");
    expect(r.ok && r.info).toMatchObject({
      network: "192.168.1.128",
      broadcast: "192.168.1.191",
      firstHost: "192.168.1.129",
      lastHost: "192.168.1.190",
      mask: "255.255.255.192",
      wildcard: "0.0.0.63",
      totalAddresses: 64,
      usableHosts: 62,
    });
  });
  it("handles /32, /31 and /0", () => {
    const a = calculateSubnet("10.1.2.3", "/32");
    expect(a.ok && a.info).toMatchObject({ usableHosts: 1, broadcast: null, network: "10.1.2.3" });
    const b = calculateSubnet("10.1.2.3", "/31");
    expect(b.ok && b.info).toMatchObject({ usableHosts: 2, firstHost: "10.1.2.2", lastHost: "10.1.2.3" });
    const c = calculateSubnet("10.1.2.3", "/0");
    expect(c.ok && c.info).toMatchObject({ network: "0.0.0.0", totalAddresses: 4294967296, broadcast: "255.255.255.255" });
  });
  it("returns readable errors", () => {
    const r = calculateSubnet("300.1.1.1", "/24");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/out of range/);
  });
});

describe("classifyIPv4", () => {
  it.each([
    ["10.0.0.5", "Private"],
    ["172.16.5.1", "Private"],
    ["172.32.0.1", "Public"],
    ["192.168.0.1", "Private"],
    ["127.0.0.1", "Loopback"],
    ["169.254.1.1", "Link-local"],
    ["100.64.0.1", "Carrier-grade"],
    ["192.0.2.10", "Documentation"],
    ["224.0.0.1", "Multicast"],
    ["8.8.8.8", "Public"],
  ])("%s is %s", (ip, expected) => {
    const r = classifyIPv4(ip);
    expect(r.ok && r.result.category).toContain(expected);
  });
});
