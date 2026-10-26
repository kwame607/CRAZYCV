"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Mail } from "lucide-react";
import { useDesktop } from "./DesktopProvider";
import { useSystemInfo } from "@/components/system/SystemInfoProvider";

function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    // Set after mount so server and client markup match.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  return (
    // Until mounted, reserve the space without any placeholder text (server HTML must not show "--:--").
    now ? (
      <time className="font-mono text-xs text-fg2" dateTime={now.toISOString()}>
        {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </time>
    ) : (
      <span aria-hidden className="inline-block h-4 w-[2.6rem]" />
    )
  );
}

export function TopBar({ compact = false }: { compact?: boolean }) {
  const { openApp } = useDesktop();
  const { server } = useSystemInfo();
  // Only show a status once it is known; nothing like "api …" in the server HTML.
  const status =
    server.state === "ok"
      ? { text: "api ok", ok: true }
      : server.state === "error"
        ? { text: "api unavailable", ok: false }
        : server.state === "static"
          ? { text: "static preview", ok: false }
          : null;

  return (
    <header className="flex h-10 shrink-0 items-center gap-3 border-b border-line bg-bg2/90 px-3 backdrop-blur">
      <Link href="/" className="font-mono text-sm font-semibold tracking-wide text-fg">
        ADOM <span className="text-accent">{"//"}</span> OS
      </Link>
      {!compact && <span className="hidden font-mono text-[11px] text-fg2 md:inline">Kwame Emmanuel Adom</span>}
      <div className="ml-auto flex items-center gap-2">
        {status && (
          <span className={`hidden font-mono text-[11px] sm:inline ${status.ok ? "text-term" : "text-fg2"}`}>
            ● {status.text}
          </span>
        )}
        <button type="button" onClick={() => openApp("cv")} className="inline-flex items-center gap-1.5 rounded-md border border-line px-2 py-1 text-xs text-fg hover:bg-white/10">
          <FileText className="h-3.5 w-3.5" aria-hidden /> CV
        </button>
        <button type="button" onClick={() => openApp("contact")} className="inline-flex items-center gap-1.5 rounded-md bg-accent px-2 py-1 text-xs font-medium text-bg hover:brightness-110">
          <Mail className="h-3.5 w-3.5" aria-hidden /> Contact
        </button>
        <Clock />
      </div>
    </header>
  );
}
