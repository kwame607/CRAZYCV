/**
 * Reads pasted HTTP response headers and explains the security-relevant ones.
 * It never makes a request. The presence of a header is not proof it is
 * configured well, and a missing one is not always a vulnerability.
 */

export type Status = "good" | "issue" | "missing" | "info";

export interface Finding {
  id: string;
  header: string;
  status: Status;
  title: string;
  detail: string;
}

export interface HeaderLine {
  name: string;
  value: string;
}

export function parseHeaders(text: string): HeaderLine[] {
  const out: HeaderLine[] = [];
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || /^HTTP\/\d/i.test(t) || /^(GET|POST|PUT|DELETE|HEAD|OPTIONS|PATCH)\s/i.test(t)) continue;
    const i = t.indexOf(":");
    if (i <= 0) continue;
    const name = t.slice(0, i).trim();
    if (!/^[A-Za-z0-9-]+$/.test(name)) continue;
    out.push({ name, value: t.slice(i + 1).trim() });
  }
  return out;
}

export function analyzeHeaders(text: string): { findings: Finding[]; count: number } {
  const lines = parseHeaders(text);
  const get = (n: string) => lines.filter((l) => l.name.toLowerCase() === n.toLowerCase()).map((l) => l.value);
  const first = (n: string) => get(n)[0];
  const f: Finding[] = [];
  const add = (x: Finding) => f.push(x);

  const hsts = first("Strict-Transport-Security");
  if (!hsts) {
    add({ id: "hsts", header: "Strict-Transport-Security", status: "missing", title: "No HSTS", detail: "HSTS tells browsers to use only https for this site. Without it, a first visit over http can be intercepted and downgraded. It only matters for sites served over https." });
  } else {
    const age = Number(/max-age=(\d+)/i.exec(hsts)?.[1] ?? NaN);
    if (!Number.isFinite(age)) add({ id: "hsts", header: "Strict-Transport-Security", status: "issue", title: "HSTS without a readable max-age", detail: "The header should carry max-age=<seconds>. Without it browsers ignore the header." });
    else if (age < 15552000) add({ id: "hsts", header: "Strict-Transport-Security", status: "issue", title: `HSTS max-age is short (${age} seconds)`, detail: "A short lifetime means the protection expires quickly. Six months (15,552,000 seconds) or more is a common baseline." });
    else add({ id: "hsts", header: "Strict-Transport-Security", status: "good", title: "HSTS present with a long max-age", detail: /includeSubDomains/i.test(hsts) ? "It also covers subdomains." : "It does not cover subdomains (no includeSubDomains)." });
  }

  const csp = first("Content-Security-Policy");
  if (!csp) {
    add({ id: "csp", header: "Content-Security-Policy", status: "missing", title: "No Content-Security-Policy", detail: "A CSP limits where scripts, styles and frames can load from, which reduces the damage a cross-site scripting bug can do." });
  } else {
    const problems: string[] = [];
    if (/'unsafe-inline'/i.test(csp)) problems.push("'unsafe-inline' allows inline scripts or styles, which removes much of the protection");
    if (/'unsafe-eval'/i.test(csp)) problems.push("'unsafe-eval' allows code to be built from strings");
    if (/(^|[\s;])(default-src|script-src)[^;]*\s\*(\s|;|$)/i.test(csp)) problems.push("a * wildcard lets scripts load from anywhere");
    if (!/(default-src|script-src)/i.test(csp)) problems.push("there is no default-src or script-src, so scripts are not restricted");
    if (problems.length) add({ id: "csp", header: "Content-Security-Policy", status: "issue", title: "CSP present, with weak settings", detail: `${problems.join("; ")}.` });
    else add({ id: "csp", header: "Content-Security-Policy", status: "good", title: "CSP present, with no obvious weak settings", detail: "This checks for common weak settings only. Whether the policy really fits the site needs a closer read." });
  }

  const xfo = first("X-Frame-Options");
  const frameAncestors = csp && /frame-ancestors/i.test(csp);
  if (xfo || frameAncestors) {
    add({ id: "frame", header: "X-Frame-Options", status: "good", title: "Framing is restricted", detail: frameAncestors ? "CSP frame-ancestors controls who can embed the page, which helps against clickjacking." : `X-Frame-Options is ${xfo}, which helps against clickjacking.` });
  } else {
    add({ id: "frame", header: "X-Frame-Options", status: "missing", title: "Nothing stops the page being framed", detail: "Without X-Frame-Options or a CSP frame-ancestors rule, another site can embed this page in a hidden frame and trick users into clicking it (clickjacking)." });
  }

  const nosniff = first("X-Content-Type-Options");
  add(
    nosniff && /nosniff/i.test(nosniff)
      ? { id: "nosniff", header: "X-Content-Type-Options", status: "good", title: "nosniff is set", detail: "The browser will trust the declared content type instead of guessing, which blocks some script-injection tricks." }
      : { id: "nosniff", header: "X-Content-Type-Options", status: "missing", title: "No nosniff", detail: "Without it, some browsers guess a file's type from its contents, which can turn an uploaded file into a script." },
  );

  add(
    first("Referrer-Policy")
      ? { id: "referrer", header: "Referrer-Policy", status: "good", title: "Referrer policy is set", detail: `It is ${first("Referrer-Policy")}. This controls how much of the address is shared when a user follows a link away.` }
      : { id: "referrer", header: "Referrer-Policy", status: "missing", title: "No Referrer-Policy", detail: "Browsers then use their default. Setting one explicitly stops full addresses, which can contain private details, leaking to other sites." },
  );

  add(
    first("Permissions-Policy")
      ? { id: "permissions", header: "Permissions-Policy", status: "good", title: "Permissions policy is set", detail: "It limits which browser features (camera, location and so on) the page and any embedded frames can use." }
      : { id: "permissions", header: "Permissions-Policy", status: "info", title: "No Permissions-Policy", detail: "Optional, but useful for sites that embed third-party content." },
  );

  for (const h of ["Server", "X-Powered-By", "X-AspNet-Version"]) {
    const v = first(h);
    if (v && /\d/.test(v)) add({ id: `leak-${h}`, header: h, status: "issue", title: `${h} reveals a version`, detail: `${v}. Naming the exact software version helps an attacker look up known weaknesses. It is not a vulnerability by itself, but there is little reason to publish it.` });
    else if (v) add({ id: `leak-${h}`, header: h, status: "info", title: `${h} is shown`, detail: `${v}. No version number is visible.` });
  }

  const cookies = get("Set-Cookie");
  cookies.forEach((c, i) => {
    const name = c.split("=")[0]?.trim() || `cookie ${i + 1}`;
    const missing: string[] = [];
    if (!/;\s*secure/i.test(c)) missing.push("Secure");
    if (!/;\s*httponly/i.test(c)) missing.push("HttpOnly");
    if (!/;\s*samesite=/i.test(c)) missing.push("SameSite");
    add(
      missing.length
        ? { id: `cookie-${i}`, header: "Set-Cookie", status: "issue", title: `Cookie "${name}" lacks ${missing.join(", ")}`, detail: "Secure keeps it off plain http, HttpOnly hides it from page scripts, and SameSite limits cross-site sending. What is needed depends on what the cookie is for: a session cookie should have all three." }
        : { id: `cookie-${i}`, header: "Set-Cookie", status: "good", title: `Cookie "${name}" has Secure, HttpOnly and SameSite`, detail: "The three common protective attributes are all present." },
    );
  });

  const acao = first("Access-Control-Allow-Origin");
  if (acao === "*" && /true/i.test(first("Access-Control-Allow-Credentials") ?? "")) {
    add({ id: "cors", header: "Access-Control-Allow-Origin", status: "issue", title: "CORS allows any origin with credentials", detail: "Browsers refuse this combination, so it is a configuration mistake, and it suggests the CORS setup has not been thought through." });
  } else if (acao === "*") {
    add({ id: "cors", header: "Access-Control-Allow-Origin", status: "info", title: "Any website can read responses (CORS *)", detail: "Fine for public data. Not appropriate for anything that depends on a user's login." });
  }

  return { findings: f, count: lines.length };
}
