"use client";

import { useEffect, useState } from "react";
import { analyzeUrl, type Signal, type UrlCheck } from "@/lib/security/url-check";
import { commonPasswords, randomSaltHex, reverseFromTable, saltedHash, sha256Hex } from "@/lib/security/hashing";
import { analyzeHeaders, type Finding, type Status } from "@/lib/security/headers";
import { GhostButton, Notice, PrimaryButton } from "@/components/shared/ui";

type Tab = "link" | "hash" | "headers";
const tabs: { id: Tab; label: string }[] = [
  { id: "link", label: "Link checker" },
  { id: "hash", label: "Hashing and salting" },
  { id: "headers", label: "Security headers" },
];

const inputCls = "w-full rounded-md border border-line bg-bg2 px-2 py-1.5 font-mono text-sm text-fg";
const mono = "break-all font-mono text-xs text-fg2";

function LinkChecker() {
  const [value, setValue] = useState("https://mtn.secure-login.example.test/verify?otp=1");
  const [result, setResult] = useState<UrlCheck | null>(null);
  const run = () => setResult(analyzeUrl(value));
  const warn = result?.ok ? result.signals.filter((s) => s.severity === "warn").length : 0;
  return (
    <div className="space-y-4">
      <Notice>
        Rules of thumb on the <strong className="text-fg">text of the link only</strong>. Nothing is opened, fetched or sent anywhere. No flags does not mean a link
        is safe, and a flag does not prove it is malicious. It uses fixed rules, not a trained model, so it works differently from my MoMo Fraud Shield project.
      </Notice>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run();
        }}
        className="space-y-3"
      >
        <div>
          <label htmlFor="url-in" className="mb-1 block text-xs text-fg2">
            Link to check
          </label>
          <input id="url-in" value={value} onChange={(e) => setValue(e.target.value)} className={inputCls} spellCheck={false} autoComplete="off" />
        </div>
        <PrimaryButton type="submit">Check link</PrimaryButton>
      </form>
      {result && !result.ok && (
        <p role="alert" className="text-sm text-danger">
          {result.error}
        </p>
      )}
      {result?.ok && (
        <div aria-live="polite" className="space-y-3">
          <dl className="grid gap-3 rounded-lg border border-line p-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-fg2">Site the link goes to</dt>
              <dd className="mt-1 font-mono text-fg">{result.host}</dd>
            </div>
            <div>
              <dt className="text-xs text-fg2">Who owns the name (approximate)</dt>
              <dd className="mt-1 font-mono text-fg">{result.registrable}</dd>
            </div>
          </dl>
          {result.assumedScheme && <p className="text-xs text-fg2">No scheme was given, so https:// was assumed for this check.</p>}
          <p className="text-sm text-fg">
            {warn === 0 ? "No warning signs found by these rules." : `${warn} warning sign${warn === 1 ? "" : "s"} found.`}
          </p>
          <ul className="space-y-2">
            {result.signals.map((s: Signal) => (
              <li key={s.id} className={`rounded-lg border p-3 text-sm ${s.severity === "warn" ? "border-warn/40 bg-warn/10" : "border-line bg-white/[0.03]"}`}>
                <p className="font-medium text-fg">
                  <span className="mr-2 font-mono text-[10px] uppercase tracking-wide text-fg2">{s.severity === "warn" ? "warning" : "note"}</span>
                  {s.title}
                </p>
                <p className="mt-1 text-fg2">{s.detail}</p>
              </li>
            ))}
          </ul>
          <p className="text-xs text-fg2">Limits: the owner is found by a simple rule, not a public-suffix list, so unusual endings can be wrong. Brand matching covers a short fixed list.</p>
        </div>
      )}
    </div>
  );
}

function HashDemo() {
  const [password, setPassword] = useState("password");
  const [salt, setSalt] = useState("");
  const [plain, setPlain] = useState("");
  const [salted, setSalted] = useState("");
  const [plainHit, setPlainHit] = useState<string | null>(null);
  const [saltedHit, setSaltedHit] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        // The salt is generated here, in the browser, so the server-rendered page carries no random value.
        const useSalt = salt || randomSaltHex();
        if (!salt && live) setSalt(useSalt);
        const p = await sha256Hex(password);
        const s = await saltedHash(useSalt, password);
        const [ph, sh] = await Promise.all([reverseFromTable(p), reverseFromTable(s)]);
        if (live) {
          setPlain(p);
          setSalted(s);
          setPlainHit(ph);
          setSaltedHit(sh);
          setError("");
        }
      } catch (e) {
        if (live) setError(e instanceof Error ? e.message : "Hashing failed.");
      }
    })();
    return () => {
      live = false;
    };
  }, [password, salt]);

  return (
    <div className="space-y-4">
      <Notice>
        Runs entirely in your browser. <strong className="text-fg">Do not type a password you really use.</strong> This demo uses SHA-256 to show an idea; real systems
        store passwords with a deliberately slow hash such as Argon2, scrypt or bcrypt.
      </Notice>
      <div>
        <label htmlFor="hash-in" className="mb-1 block text-xs text-fg2">
          Practice password
        </label>
        <input id="hash-in" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} spellCheck={false} autoComplete="off" />
      </div>
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <section className="space-y-2 rounded-lg border border-line p-4">
          <h3 className="text-sm font-medium text-fg">1. Stored with no salt</h3>
          <p className={mono}>{plain}</p>
          <p aria-live="polite" className={`text-sm ${plainHit ? "text-danger" : "text-fg2"}`}>
            {plainHit
              ? `A table of hashes of common passwords finds this instantly: it is "${plainHit}". Everyone who chose the same password has the same hash.`
              : "Not found in my small table of ten common passwords."}
          </p>
        </section>
        <section className="space-y-2 rounded-lg border border-line p-4">
          <h3 className="text-sm font-medium text-fg">2. Stored with a random salt</h3>
          <p className="text-xs text-fg2">Salt (random, stored beside the hash)</p>
          <p className={mono}>{salt}</p>
          <p className="text-xs text-fg2">Hash of salt + password</p>
          <p className={mono}>{salted}</p>
          <p aria-live="polite" className={`text-sm ${saltedHit ? "text-danger" : "text-term"}`}>
            {saltedHit ? "Found in the table." : "The same lookup table finds nothing. It would have to be rebuilt for this one salt."}
          </p>
          <GhostButton onClick={() => setSalt(randomSaltHex())}>New random salt</GhostButton>
        </section>
      </div>
      <p className="text-sm text-fg2">
        What to take from it: the same password with a different salt gives a completely different hash, so precomputed tables stop working and identical passwords no longer
        match. Salting does not make a weak password strong: an attacker can still guess it, one salted hash at a time, which is why the hash must also be slow. My table holds
        only {commonPasswords.length} passwords.
      </p>
    </div>
  );
}

const statusStyle: Record<Status, string> = {
  good: "border-term/40 bg-term/[0.06]",
  issue: "border-warn/40 bg-warn/10",
  missing: "border-warn/40 bg-warn/10",
  info: "border-line bg-white/[0.03]",
};
const statusLabel: Record<Status, string> = { good: "good", issue: "issue", missing: "missing", info: "note" };

const sample = `HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Server: nginx/1.18.0
Strict-Transport-Security: max-age=300
Content-Security-Policy: default-src * 'unsafe-inline'
Set-Cookie: session=abc123; Path=/
X-Powered-By: Express`;

function HeadersChecker() {
  const [text, setText] = useState(sample);
  const [result, setResult] = useState<{ findings: Finding[]; count: number } | null>(null);
  return (
    <div className="space-y-4">
      <Notice>
        Paste the response headers of a page (in a browser&rsquo;s developer tools, Network tab). This page{" "}
        <strong className="text-fg">never fetches a site</strong>; it only reads the text you paste. The sample below is invented.
      </Notice>
      <div>
        <label htmlFor="hdr-in" className="mb-1 block text-xs text-fg2">
          Response headers
        </label>
        <textarea id="hdr-in" value={text} onChange={(e) => setText(e.target.value)} rows={9} className={`${inputCls} scroll-thin`} spellCheck={false} />
      </div>
      <PrimaryButton onClick={() => setResult(analyzeHeaders(text))}>Check headers</PrimaryButton>
      {result && (
        <div aria-live="polite" className="space-y-3">
          {result.count === 0 ? (
            <p role="alert" className="text-sm text-danger">
              No headers found. Paste lines in the form Name: value.
            </p>
          ) : (
            <>
              <p className="text-sm text-fg">
                Read {result.count} header line{result.count === 1 ? "" : "s"}.
              </p>
              <ul className="space-y-2">
                {result.findings.map((f) => (
                  <li key={f.id} className={`rounded-lg border p-3 text-sm ${statusStyle[f.status]}`}>
                    <p className="font-medium text-fg">
                      <span className="mr-2 font-mono text-[10px] uppercase tracking-wide text-fg2">{statusLabel[f.status]}</span>
                      {f.title}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-fg2">{f.header}</p>
                    <p className="mt-1 text-fg2">{f.detail}</p>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-fg2">
                Limits: this checks headers only, from text I cannot verify came from the real site. A missing header is not always a vulnerability, and a present one can still be
                configured badly. It is not a security assessment.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function SecurityToolsApp() {
  const [tab, setTab] = useState<Tab>("link");
  return (
    <div>
      <div role="tablist" aria-label="Security tools" className="mb-4 flex flex-wrap gap-1 border-b border-line">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`sec-tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls="sec-panel"
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm ${tab === t.id ? "border-accent text-fg" : "border-transparent text-fg2 hover:text-fg"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id="sec-panel" aria-labelledby={`sec-tab-${tab}`}>
        {tab === "link" && <LinkChecker />}
        {tab === "hash" && <HashDemo />}
        {tab === "headers" && <HeadersChecker />}
      </div>
      <p className="mt-8 text-xs text-fg2">
        Three small teaching tools, built with AI assistance. They illustrate ideas I am learning; they are not evidence of professional experience or a substitute for a real assessment.
      </p>
    </div>
  );
}
