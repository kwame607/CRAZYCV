"use client";

import { useState, type FormEvent } from "react";
import { calculateSubnet, classifyIPv4, type Classification, type SubnetInfo } from "@/lib/network/subnet";
import { Notice, PrimaryButton, SectionTitle } from "@/components/shared/ui";

type Tab = "subnet" | "classify" | "tcp-udp" | "ports" | "dns" | "http";
const tabs: { id: Tab; label: string }[] = [
  { id: "subnet", label: "Subnet calculator" },
  { id: "classify", label: "IPv4 classifier" },
  { id: "tcp-udp", label: "TCP vs UDP" },
  { id: "ports", label: "Port reference" },
  { id: "dns", label: "DNS records" },
  { id: "http", label: "HTTP anatomy" },
];

const inputCls = "w-full rounded-md border border-line bg-bg2 px-2 py-1.5 font-mono text-sm text-fg";

function Table({ head, rows, caption }: { head: string[]; rows: string[][]; caption: string }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="border-b border-line text-xs text-fg2">
          <tr>{head.map((h) => <th key={h} scope="col" className="px-3 py-2">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.join("|")} className="border-b border-line last:border-0">
              {r.map((c, i) => <td key={i} className={`px-3 py-2 ${i === 0 ? "font-mono text-fg" : "text-fg2"}`}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SubnetTool() {
  const [addr, setAddr] = useState("192.168.1.130");
  const [prefix, setPrefix] = useState("/26");
  const [result, setResult] = useState<{ info?: SubnetInfo; error?: string } | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const r = calculateSubnet(addr, prefix);
    setResult(r.ok ? { info: r.info } : { error: r.error });
  };

  const rows: [string, string | null][] = result?.info
    ? [
        ["Address", result.info.address],
        ["Mask", `${result.info.mask} (/${result.info.prefix})`],
        ["Wildcard", result.info.wildcard],
        ["Network", result.info.network],
        ["Broadcast", result.info.broadcast ?? "none for this prefix"],
        ["First host", result.info.firstHost],
        ["Last host", result.info.lastHost],
        ["Total addresses", result.info.totalAddresses.toLocaleString("en-US")],
        ["Usable hosts", result.info.usableHosts.toLocaleString("en-US")],
      ]
    : [];

  return (
    <form onSubmit={submit} className="space-y-3" noValidate>
      <p className="text-sm text-fg2">Calculated locally in your browser. Nothing is sent anywhere.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="sn-addr" className="mb-1 block text-xs text-fg2">IPv4 address</label>
          <input id="sn-addr" value={addr} onChange={(e) => setAddr(e.target.value)} className={inputCls} inputMode="decimal" autoComplete="off" />
        </div>
        <div>
          <label htmlFor="sn-prefix" className="mb-1 block text-xs text-fg2">Prefix or mask (/24 or 255.255.255.0)</label>
          <input id="sn-prefix" value={prefix} onChange={(e) => setPrefix(e.target.value)} className={inputCls} autoComplete="off" />
        </div>
      </div>
      <PrimaryButton type="submit">Calculate</PrimaryButton>
      <div aria-live="polite">
        {result?.error && <p role="alert" className="text-sm text-danger">{result.error}</p>}
        {result?.info && (
          <>
            <dl className="mt-2 grid gap-x-4 gap-y-1 rounded-lg border border-line p-3 text-sm sm:grid-cols-[10rem_1fr]">
              {rows.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-fg2">{k}</dt>
                  <dd className="font-mono text-fg">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-xs text-fg2">{result.info.explanation}</p>
          </>
        )}
      </div>
    </form>
  );
}

function ClassifyTool() {
  const [addr, setAddr] = useState("10.0.0.5");
  const [result, setResult] = useState<{ c?: Classification; error?: string } | null>(null);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const r = classifyIPv4(addr);
    setResult(r.ok ? { c: r.result } : { error: r.error });
  };
  return (
    <form onSubmit={submit} className="space-y-3" noValidate>
      <p className="text-sm text-fg2">Classifies an address by reserved block only. It does not look anything up or contact the address.</p>
      <div>
        <label htmlFor="cl-addr" className="mb-1 block text-xs text-fg2">IPv4 address</label>
        <input id="cl-addr" value={addr} onChange={(e) => setAddr(e.target.value)} className={inputCls} autoComplete="off" />
      </div>
      <PrimaryButton type="submit">Classify</PrimaryButton>
      <div aria-live="polite">
        {result?.error && <p role="alert" className="text-sm text-danger">{result.error}</p>}
        {result?.c && (
          <div className="rounded-lg border border-line p-3 text-sm">
            <p className="font-mono text-accent">{result.c.category}</p>
            <p className="mt-1 text-fg2">{result.c.detail}</p>
          </div>
        )}
      </div>
    </form>
  );
}

export function NetworkToolsApp() {
  const [tab, setTab] = useState<Tab>("subnet");
  return (
    <div>
      <div role="tablist" aria-label="Network tools" className="mb-4 flex flex-wrap gap-1 border-b border-line">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`net-tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls="net-panel"
            type="button"
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm ${tab === t.id ? "border-accent text-fg" : "border-transparent text-fg2 hover:text-fg"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id="net-panel" aria-labelledby={`net-tab-${tab}`} className="space-y-3">
        {tab === "subnet" && <SubnetTool />}
        {tab === "classify" && <ClassifyTool />}
        {tab === "tcp-udp" && (
          <>
            <Table
              caption="TCP compared with UDP"
              head={["Property", "TCP", "UDP"]}
              rows={[
                ["Connection", "Connection-oriented (three-way handshake)", "Connectionless"],
                ["Delivery", "Reliable, retransmits lost segments", "Best effort, no retransmission"],
                ["Ordering", "Preserves order", "No ordering guarantee"],
                ["Overhead", "Higher", "Lower"],
                ["Typical uses", "Web, email, SSH", "DNS lookups, streaming, voice, games"],
              ]}
            />
            <SectionTitle>TCP three-way handshake</SectionTitle>
            <ol className="list-decimal space-y-1 pl-5 text-sm text-fg2">
              <li><span className="font-mono text-fg">SYN</span>: the client asks to open a connection.</li>
              <li><span className="font-mono text-fg">SYN-ACK</span>: the server agrees and acknowledges.</li>
              <li><span className="font-mono text-fg">ACK</span>: the client confirms; data can flow.</li>
            </ol>
            <p className="text-xs text-fg2">This is why a port scanner can tell open (handshake completes), closed (reset) and filtered (silence) apart.</p>
          </>
        )}
        {tab === "ports" && (
          <>
            <Table
              caption="Common ports and services"
              head={["Port", "Service", "Notes"]}
              rows={[
                ["22/tcp", "SSH", "Remote administration"],
                ["53/udp,tcp", "DNS", "Name resolution"],
                ["80/tcp", "HTTP", "Unencrypted web"],
                ["443/tcp", "HTTPS", "Encrypted web"],
                ["25, 587/tcp", "SMTP", "Mail submission and relay"],
                ["3306/tcp", "MySQL", "Should not face the public internet"],
                ["5432/tcp", "PostgreSQL", "Should not face the public internet"],
              ]}
            />
            <p className="text-xs text-fg2">Ports are conventions. A service can listen on any port, so a port number alone never proves what is running.</p>
          </>
        )}
        {tab === "dns" && (
          <Table
            caption="Common DNS record types"
            head={["Type", "Purpose", "Example value"]}
            rows={[
              ["A", "Hostname to IPv4 address", "192.0.2.10"],
              ["AAAA", "Hostname to IPv6 address", "2001:db8::10"],
              ["CNAME", "Alias to another hostname", "www → example.test"],
              ["MX", "Mail servers for the domain", "10 mail.example.test"],
              ["TXT", "Free text; SPF, DKIM and verification", "\"v=spf1 -all\""],
              ["NS", "Authoritative name servers", "ns1.example.test"],
            ]}
          />
        )}
        {tab === "http" && (
          <>
            <Notice>Static example using a reserved example domain. No request is made.</Notice>
            <pre className="scroll-thin overflow-x-auto rounded-lg bg-black/40 p-3 font-mono text-xs leading-relaxed text-term">{`GET /index.html HTTP/1.1
Host: www.example.test
Accept: text/html

HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Strict-Transport-Security: max-age=63072000
Content-Security-Policy: default-src 'self'`}</pre>
            <ul className="list-disc space-y-1 pl-5 text-sm text-fg2">
              <li><span className="font-mono text-fg">GET /index.html</span>: method and path being requested.</li>
              <li><span className="font-mono text-fg">Host</span>: which site on the server is wanted.</li>
              <li><span className="font-mono text-fg">200 OK</span>: status code of the response.</li>
              <li><span className="font-mono text-fg">Strict-Transport-Security, Content-Security-Policy</span>: security headers a browser enforces.</li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
