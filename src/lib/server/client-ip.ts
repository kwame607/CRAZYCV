import "server-only";
import { BlockList, isIP } from "node:net";

// Addresses that can never be a visitor's public IP.
const nonPublic = new BlockList();
for (const [net, prefix] of [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.168.0.0", 16],
] as const) {
  nonPublic.addSubnet(net, prefix, "ipv4");
}
for (const [net, prefix] of [
  ["::1", 128],
  ["fc00::", 7],
  ["fe80::", 10],
] as const) {
  nonPublic.addSubnet(net, prefix, "ipv6");
}

export function isNonPublicIp(ip: string): boolean {
  const mapped = ip.toLowerCase().startsWith("::ffff:") ? ip.slice(7) : ip;
  const family = isIP(mapped);
  if (family === 0) return true;
  return nonPublic.check(mapped, family === 4 ? "ipv4" : "ipv6");
}

export type ClientIpResult =
  | { kind: "ok"; ip: string; method: string }
  | { kind: "non-public" }
  | { kind: "none" };

/**
 * Read the caller's own public IP from request headers set by the hosting
 * platform's proxy. No third-party lookup, no storage, no logging.
 *
 * Header trust: x-forwarded-for can be forged by clients when the host does not
 * overwrite it. Because the value is only ever echoed back to the same caller,
 * forging it can only mislead the forger. The result is never stored or used
 * for any decision.
 */
export function readClientIp(headers: Headers): ClientIpResult {
  const candidates: [string, string | null][] = [
    ["cf-connecting-ip", headers.get("cf-connecting-ip")],
    ["x-real-ip", headers.get("x-real-ip")],
    ["x-forwarded-for", headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null],
  ];
  let sawNonPublic = false;
  for (const [header, value] of candidates) {
    const v = value?.trim();
    // Strictly validate so nothing but an IP address is ever echoed back.
    if (v && v.length <= 45 && isIP(v) !== 0) {
      if (isNonPublicIp(v)) {
        sawNonPublic = true;
        continue;
      }
      return { kind: "ok", ip: v, method: `Reflected from the ${header} request header set by the hosting proxy` };
    }
  }
  return sawNonPublic ? { kind: "non-public" } : { kind: "none" };
}
