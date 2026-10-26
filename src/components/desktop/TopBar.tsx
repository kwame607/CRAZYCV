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
    <time className="font-mono text-xs text-fg2" dateTime={now?.toISOString()} suppressHydrationWarning>
      {now ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
    </time>
  );
}

export function TopBar({ compact = false }: { compact?: boolean }) {
  const { openApp } = useDesktop();
  const { sections } = useSystemInfo();
  const portfolio = sections.find((s) => s.id === "portfolio");
  const health = portfolio?.items.find((i) => i.label === "Health");
  const api = portfolio ? (health ? "api ok" : "api unavailable") : "api …";

  return (
    <header className="flex h-10 shrink-0 items-center gap-3 border-b border-line bg-bg2/90 px-3 backdrop-blur">
      <Link href="/" className="font-mono text-sm font-semibold tracking-wide text-fg">
        ADOM <span className="text-accent">{"//"}</span> OS
      </Link>
      {!compact && <span className="hidden font-mono text-[11px] text-fg2 md:inline">Kwame Emmanuel Adom</span>}
      <div className="ml-auto flex items-center gap-2">
        <span className={`hidden font-mono text-[11px] sm:inline ${health ? "text-term" : "text-fg2"}`} aria-label={`Status: ${api}`}>
          ● {api}
        </span>
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
