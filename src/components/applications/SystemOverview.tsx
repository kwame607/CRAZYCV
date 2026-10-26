"use client";

import { RefreshCw } from "lucide-react";
import { useSystemInfo } from "@/components/system/SystemInfoProvider";
import { GhostButton, LoadingState, Notice, PrimaryButton, StatusIndicator } from "@/components/shared/ui";

export function SystemOverview() {
  const { ready, sections, ip, requestIp, clearIp, refresh } = useSystemInfo();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="max-w-[46ch] text-sm text-fg2">
          Values below are read from your own browser. Nothing is scanned or modified. The only requests made are to this site&rsquo;s own{" "}
          <code className="font-mono text-xs text-fg">/api/system</code> endpoint, plus <code className="font-mono text-xs text-fg">/api/ip</code> if you ask for it.
        </p>
        <GhostButton onClick={refresh}>
          <RefreshCw className="h-4 w-4" aria-hidden /> Refresh information
        </GhostButton>
      </div>

      {!ready && <LoadingState label="Reading browser information…" />}

      {sections.map((section) => (
        <details key={section.id} open={section.id !== "browser"} className="group rounded-lg border border-line bg-white/[0.02]">
          <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold text-fg marker:text-accent">
            {section.title} <span className="font-normal text-fg2">({section.items.length})</span>
          </summary>
          <dl className="divide-y divide-line border-t border-line">
            {section.items.map((item) => (
              <div key={item.label} className="grid gap-1 px-4 py-2.5 sm:grid-cols-[11rem_1fr]">
                <dt className="text-xs text-fg2">{item.label}</dt>
                <dd className="min-w-0">
                  <div className="flex flex-wrap items-start gap-2">
                    <span className="min-w-0 break-words font-mono text-xs text-fg">{item.value}</span>
                    <StatusIndicator status={item.status} />
                  </div>
                  {item.note && <p className="mt-1 text-[11px] leading-snug text-fg2">{item.note}</p>}
                </dd>
              </div>
            ))}
          </dl>

          {section.id === "connection" && (
            <div className="space-y-3 border-t border-line p-4">
              <Notice>
                <strong className="text-fg">Public IP lookup is optional.</strong> Your public IP can hint at your approximate location and network. This site
                reads it from the request your browser makes to its own server, does not store or log it, and uses no third-party lookup service. A VPN, proxy or
                carrier NAT changes what is shown.
              </Notice>
              <div className="flex flex-wrap gap-2">
                <PrimaryButton onClick={() => void requestIp().catch(() => undefined)} disabled={ip.state === "loading"}>
                  {ip.state === "ok" ? "Look up again" : "Look up my public IP"}
                </PrimaryButton>
                <GhostButton onClick={clearIp} disabled={ip.state === "not-requested"}>
                  Clear / skip
                </GhostButton>
              </div>
            </div>
          )}
        </details>
      ))}
    </div>
  );
}
