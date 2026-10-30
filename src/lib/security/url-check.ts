/**
 * Rules-of-thumb checks on a pasted link. Everything is computed from the text
 * of the URL alone: nothing is fetched, resolved or sent anywhere. No flags
 * does not mean a link is safe, and a flag does not prove it is malicious.
 */

export type Severity = "warn" | "info";

export interface Signal {
  id: string;
  severity: Severity;
  title: string;
  detail: string;
}

export type UrlCheck =
  | { ok: true; shown: string; host: string; registrable: string; signals: Signal[]; assumedScheme: boolean }
  | { ok: false; error: string };

const SHORTENERS = new Set(["bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", "cutt.ly", "ow.ly", "rebrand.ly", "shorturl.at"]);

/** Brands people are commonly impersonated as. Matching is on the registrable domain, not on the whole text. */
const BRANDS: { word: string; real: string[] }[] = [
  { word: "mtn", real: ["mtn.com", "mtn.com.gh"] },
  { word: "momo", real: ["mtn.com.gh", "mtn.com"] },
  { word: "vodafone", real: ["vodafone.com", "vodafone.com.gh"] },
  { word: "telecel", real: ["telecel.com.gh", "telecel.com"] },
  { word: "airteltigo", real: ["at.com.gh", "airteltigo.com.gh"] },
  { word: "paypal", real: ["paypal.com"] },
  { word: "google", real: ["google.com"] },
  { word: "microsoft", real: ["microsoft.com", "live.com", "office.com"] },
  { word: "apple", real: ["apple.com", "icloud.com"] },
  { word: "facebook", real: ["facebook.com", "fb.com"] },
  { word: "whatsapp", real: ["whatsapp.com", "whatsapp.net"] },
  { word: "amazon", real: ["amazon.com"] },
  { word: "ecobank", real: ["ecobank.com"] },
];

const PRESSURE_WORDS = ["login", "signin", "verify", "secure", "update", "account", "otp", "pin", "claim", "reward", "suspend", "unlock", "confirm"];

/** Second-level labels that make the registrable domain three labels long (e.g. example.com.gh). */
const SECOND_LEVEL = new Set(["com", "co", "org", "net", "gov", "edu", "ac", "sch"]);

export function registrableDomain(host: string): string {
  const labels = host.split(".").filter(Boolean);
  if (labels.length <= 2) return labels.join(".");
  const last = labels[labels.length - 1] ?? "";
  const second = labels[labels.length - 2] ?? "";
  const take = last.length === 2 && SECOND_LEVEL.has(second) ? 3 : 2;
  return labels.slice(-take).join(".");
}

const isIPv4 = (h: string) => /^\d{1,3}(\.\d{1,3}){3}$/.test(h);

export function analyzeUrl(raw: string): UrlCheck {
  const input = raw.trim();
  if (!input) return { ok: false, error: "Paste a link to check." };
  if (input.length > 2048) return { ok: false, error: "That link is longer than 2,048 characters, which is more than this tool will look at." };
  if (/\s/.test(input)) return { ok: false, error: "A link cannot contain spaces. Paste just the link." };

  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(input) && !/^[^/]*:\d+(\/|$)/.test(input);
  const text = hasScheme ? input : `https://${input}`;
  let u: URL;
  try {
    u = new URL(text);
  } catch {
    return { ok: false, error: "That does not look like a valid link." };
  }

  const signals: Signal[] = [];
  const add = (s: Signal) => signals.push(s);

  if (u.protocol !== "http:" && u.protocol !== "https:") {
    add({ id: "scheme", severity: "warn", title: `Unusual scheme: ${u.protocol}`, detail: "Links in messages should be http or https. Schemes such as javascript: or data: can run code or hide content instead of opening a website." });
    return { ok: true, shown: u.href, host: u.hostname, registrable: u.hostname, signals, assumedScheme: !hasScheme };
  }

  const host = u.hostname.toLowerCase();
  const registrable = registrableDomain(host);

  if (u.protocol === "http:") {
    add({ id: "http", severity: "warn", title: "Not encrypted (http)", detail: "Anything typed on this page travels in the clear, and it can be altered on the way. Legitimate login and payment pages use https." });
  }
  if (u.username || u.password) {
    add({ id: "userinfo", severity: "warn", title: "Text before an @ sign", detail: `Everything before the @ is treated as a username, not the site. The real destination is ${host}, even if the start of the link names a brand you trust.` });
  }
  if (isIPv4(host) || host.startsWith("[")) {
    add({ id: "ip-host", severity: "warn", title: "Address is a raw IP number", detail: "Real services almost always use a name. A bare IP address means there is no domain name to recognise, and no trusted name behind it." });
  }
  if (host.split(".").some((l) => l.startsWith("xn--"))) {
    add({ id: "punycode", severity: "warn", title: "Look-alike characters (punycode)", detail: "A name starting with xn-- encodes non-English letters. Attackers use letters from other alphabets that look the same as English ones, so the name reads like a real brand but is a different site." });
  }
  const labels = host.split(".");
  if (!isIPv4(host) && labels.length - registrable.split(".").length >= 3) {
    add({ id: "subdomains", severity: "warn", title: "Many subdomains", detail: `Only the part at the end (${registrable}) says who owns the site. The labels in front of it are chosen freely by the owner, so a long chain can be used to push a trusted-looking word to the front.` });
  }
  if (SHORTENERS.has(registrable)) {
    add({ id: "shortener", severity: "info", title: "Shortened link", detail: "A shortener hides the real destination. The only way to see it is to follow the link, so be careful with a short link sent by someone you do not know." });
  }
  if (!isIPv4(host)) {
    const labelsBefore = labels.slice(0, labels.length - registrable.split(".").length).join(".");
    const haystack = `${labelsBefore}.${u.pathname}`.toLowerCase();
    for (const b of BRANDS) {
      if (new RegExp(`(^|[^a-z])${b.word}([^a-z]|$)`).test(haystack) && !b.real.includes(registrable) && !registrable.split(".")[0]?.split("-").includes(b.word)) {
        add({ id: `brand-${b.word}`, severity: "warn", title: `"${b.word}" appears, but the site is ${registrable}`, detail: `A brand name in a subdomain or in the path does not mean the brand owns the site. The owner is whoever controls ${registrable}.` });
        break;
      }
    }
    const sld = registrable.split(".")[0] ?? "";
    for (const b of BRANDS) {
      const joined = new RegExp(`^(${b.word}(secure|support|login|verify|update|care|help|official|online|service|services|pay)|(secure|support|my|login|verify|official)${b.word})$`);
      if (!b.real.includes(registrable) && (sld.split("-").includes(b.word) || joined.test(sld))) {
        add({ id: `brand-in-domain-${b.word}`, severity: "warn", title: `"${b.word}" is part of a different domain name`, detail: `${registrable} is not a domain I recognise as belonging to that brand. Names like "${b.word}-support" or "${b.word}secure" are a common way to imitate it.` });
        break;
      }
    }
  }
  const hyphens = (host.match(/-/g) ?? []).length;
  if (hyphens >= 3) {
    add({ id: "hyphens", severity: "info", title: "Many hyphens in the name", detail: "Long hyphenated names are a common pattern for look-alike domains, though plenty of real sites use hyphens too." });
  }
  const pressure = PRESSURE_WORDS.filter((w) => `${host}${u.pathname}${u.search}`.toLowerCase().includes(w));
  if (pressure.length >= 2) {
    add({ id: "pressure", severity: "info", title: `Account-action words: ${pressure.slice(0, 4).join(", ")}`, detail: "Words like these appear on real login pages, and also on fake ones built to look urgent. They are a reason to check the domain, not a verdict." });
  }
  if (u.port && u.port !== "443" && u.port !== "80") {
    add({ id: "port", severity: "info", title: `Unusual port (${u.port})`, detail: "Ordinary websites use the default port. A custom port is not harmful by itself but is uncommon for public pages." });
  }
  if (u.href.length > 120) {
    add({ id: "long", severity: "info", title: "Very long link", detail: "Long links can bury the part that matters. Read the domain, which is the part right after the scheme." });
  }

  return { ok: true, shown: u.href, host, registrable, signals, assumedScheme: !hasScheme };
}
