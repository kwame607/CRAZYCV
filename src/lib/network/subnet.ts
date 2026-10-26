export type Ipv4Result = { ok: true; value: number } | { ok: false; error: string };

/** Parse a dotted-quad IPv4 address into an unsigned 32-bit number. */
export function parseIPv4(input: string): Ipv4Result {
  const text = input.trim();
  if (!text) return { ok: false, error: "Enter an IPv4 address, for example 192.168.1.10." };
  const parts = text.split(".");
  if (parts.length !== 4) return { ok: false, error: "An IPv4 address has exactly four numbers separated by dots." };
  let value = 0;
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return { ok: false, error: `"${p}" is not a valid octet. Use digits only.` };
    if (p.length > 1 && p.startsWith("0")) return { ok: false, error: `"${p}" has a leading zero, which is ambiguous (some tools read it as octal).` };
    const n = Number(p);
    if (n > 255) return { ok: false, error: `${n} is out of range. Each octet must be 0 to 255.` };
    value = value * 256 + n;
  }
  return { ok: true, value };
}

export function formatIPv4(n: number): string {
  return [24, 16, 8, 0].map((s) => (n >>> s) & 255).join(".");
}

export type PrefixResult = { ok: true; prefix: number } | { ok: false; error: string };

/** Accepts "/24", "24", or a dotted mask such as 255.255.255.0. */
export function parsePrefix(input: string): PrefixResult {
  const text = input.trim().replace(/^\//, "");
  if (/^\d{1,2}$/.test(text)) {
    const p = Number(text);
    if (p > 32) return { ok: false, error: "A prefix length must be 0 to 32." };
    return { ok: true, prefix: p };
  }
  const mask = parseIPv4(text);
  if (!mask.ok) return { ok: false, error: "Use a prefix length like /24 or a mask like 255.255.255.0." };
  const inverted = ~mask.value >>> 0;
  // A valid mask is contiguous ones then zeros, so its inverse is 2^k - 1.
  if ((inverted & (inverted + 1)) !== 0) return { ok: false, error: "That mask is not contiguous (ones must come before zeros)." };
  let prefix = 0;
  for (let i = 31; i >= 0 && (mask.value >>> i) & 1; i--) prefix++;
  return { ok: true, prefix };
}

export interface SubnetInfo {
  address: string;
  prefix: number;
  mask: string;
  wildcard: string;
  network: string;
  broadcast: string | null;
  firstHost: string | null;
  lastHost: string | null;
  totalAddresses: number;
  usableHosts: number;
  explanation: string;
}

export function calculateSubnet(addr: string, prefixInput: string): { ok: true; info: SubnetInfo } | { ok: false; error: string } {
  const a = parseIPv4(addr);
  if (!a.ok) return a;
  const p = parsePrefix(prefixInput);
  if (!p.ok) return p;
  const prefix = p.prefix;

  const maskNum = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const network = (a.value & maskNum) >>> 0;
  const broadcastNum = (network | (~maskNum >>> 0)) >>> 0;
  const total = 2 ** (32 - prefix);

  let firstHost: string | null;
  let lastHost: string | null;
  let usable: number;
  let broadcast: string | null = formatIPv4(broadcastNum);

  if (prefix === 32) {
    firstHost = lastHost = formatIPv4(network);
    usable = 1;
    broadcast = null;
  } else if (prefix === 31) {
    // RFC 3021 point-to-point link: both addresses are usable.
    firstHost = formatIPv4(network);
    lastHost = formatIPv4(broadcastNum);
    usable = 2;
    broadcast = null;
  } else {
    firstHost = formatIPv4(network + 1);
    lastHost = formatIPv4(broadcastNum - 1);
    usable = total - 2;
  }

  const hostBits = 32 - prefix;
  const explanation = `/${prefix} means the first ${prefix} bits identify the network and the remaining ${hostBits} bits identify hosts, giving ${total.toLocaleString("en-US")} addresses in the block.`;

  return {
    ok: true,
    info: {
      address: formatIPv4(a.value),
      prefix,
      mask: formatIPv4(maskNum),
      wildcard: formatIPv4(~maskNum >>> 0),
      network: formatIPv4(network),
      broadcast,
      firstHost,
      lastHost,
      totalAddresses: total,
      usableHosts: usable,
      explanation,
    },
  };
}

export interface Classification {
  category: string;
  scope: "private" | "public" | "special";
  detail: string;
}

const ranges: { base: string; prefix: number; category: string; scope: Classification["scope"]; detail: string }[] = [
  { base: "0.0.0.0", prefix: 8, category: "This network", scope: "special", detail: "0.0.0.0/8 is reserved for 'this host on this network'." },
  { base: "10.0.0.0", prefix: 8, category: "Private (RFC 1918)", scope: "private", detail: "Not routable on the public internet; used inside home and company networks." },
  { base: "100.64.0.0", prefix: 10, category: "Carrier-grade NAT (RFC 6598)", scope: "private", detail: "Shared address space used by ISPs; one public IP may serve many customers." },
  { base: "127.0.0.0", prefix: 8, category: "Loopback", scope: "special", detail: "Refers to the local machine itself." },
  { base: "169.254.0.0", prefix: 16, category: "Link-local (APIPA)", scope: "special", detail: "Self-assigned when no DHCP server answers." },
  { base: "172.16.0.0", prefix: 12, category: "Private (RFC 1918)", scope: "private", detail: "Not routable on the public internet." },
  { base: "192.0.0.0", prefix: 24, category: "IETF protocol assignments", scope: "special", detail: "Reserved for protocol use." },
  { base: "192.0.2.0", prefix: 24, category: "Documentation (TEST-NET-1)", scope: "special", detail: "Reserved for examples; this site's demos use it." },
  { base: "192.168.0.0", prefix: 16, category: "Private (RFC 1918)", scope: "private", detail: "Common in home routers. Not routable on the public internet." },
  { base: "198.18.0.0", prefix: 15, category: "Benchmarking", scope: "special", detail: "Reserved for network device testing." },
  { base: "198.51.100.0", prefix: 24, category: "Documentation (TEST-NET-2)", scope: "special", detail: "Reserved for examples." },
  { base: "203.0.113.0", prefix: 24, category: "Documentation (TEST-NET-3)", scope: "special", detail: "Reserved for examples." },
  { base: "224.0.0.0", prefix: 4, category: "Multicast", scope: "special", detail: "One-to-many delivery, not a single host." },
  { base: "240.0.0.0", prefix: 4, category: "Reserved (future use)", scope: "special", detail: "Includes 255.255.255.255, the limited broadcast address." },
];

export function classifyIPv4(input: string): { ok: true; result: Classification } | { ok: false; error: string } {
  const a = parseIPv4(input);
  if (!a.ok) return a;
  for (const r of ranges) {
    const base = parseIPv4(r.base);
    if (!base.ok) continue;
    const mask = (0xffffffff << (32 - r.prefix)) >>> 0;
    if (((a.value & mask) >>> 0) === base.value) {
      return { ok: true, result: { category: r.category, scope: r.scope, detail: r.detail } };
    }
  }
  return { ok: true, result: { category: "Public (globally routable)", scope: "public", detail: "Not in a reserved range. Classification is by address block only; it says nothing about who owns it." } };
}
