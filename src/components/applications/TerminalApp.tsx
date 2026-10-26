"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { TerminalContext, TerminalLine } from "@/types/terminal";
import { runCommand, commandNames } from "@/lib/terminal/command-registry";
import { MAX_INPUT_LENGTH } from "@/lib/terminal/command-parser";
import { sectionLines } from "@/lib/browser/report";
import { useSystemInfo } from "@/components/system/SystemInfoProvider";
import { useDesktop } from "@/components/desktop/DesktopProvider";

const PROMPT = "adom@portfolio:~$";

const welcome: TerminalLine[] = [
  { kind: "info", text: "ADOM // OS terminal. A portfolio navigator, not a shell." },
  { kind: "info", text: "Type 'help' for commands. Nothing you type is executed on any machine." },
];

const lineStyle: Record<TerminalLine["kind"], string> = {
  cmd: "text-fg",
  out: "text-term",
  err: "text-danger",
  info: "text-fg2",
};

export function TerminalApp() {
  const { sections, requestIp } = useSystemInfo();
  const { openApp } = useDesktop();
  const [lines, setLines] = useState<TerminalLine[]>(welcome);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const ctx = useMemo<TerminalContext>(
    () => ({
      systemLines: () => {
        if (sections.length === 0) return ["System information is still loading."];
        return [
          "-- Device --",
          ...sectionLines(sections, "device"),
          "-- Connection --",
          ...sectionLines(sections, "connection"),
          "-- Portfolio system --",
          ...sectionLines(sections, "portfolio"),
        ];
      },
      browserLines: () => (sections.length ? sectionLines(sections, "browser", ["User-agent"]) : ["System information is still loading."]),
      networkLines: () => (sections.length ? sectionLines(sections, "connection") : ["System information is still loading."]),
      requestIp,
    }),
    [sections, requestIp],
  );

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  const submit = useCallback(() => {
    const raw = input.slice(0, MAX_INPUT_LENGTH);
    setInput("");
    setCursor(null);
    if (!raw.trim()) {
      setLines((l) => [...l, { kind: "cmd", text: PROMPT }]);
      return;
    }
    setHistory((h) => [...h, raw]);
    const result = runCommand(raw, ctx);
    if (result.clear) {
      setLines([]);
      return;
    }
    setLines((l) => [...l, { kind: "cmd", text: `${PROMPT} ${raw}` }, ...(result.lines ?? [])]);
    if (result.openApp) openApp(result.openApp);
    if (result.deferred) {
      void result.deferred().then((more) => setLines((l) => [...l, ...more]));
    }
  }, [input, ctx, openApp]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const next = cursor === null ? history.length - 1 : Math.max(cursor - 1, 0);
      setCursor(next);
      setInput(history[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cursor === null) return;
      const next = cursor + 1;
      if (next >= history.length) {
        setCursor(null);
        setInput("");
      } else {
        setCursor(next);
        setInput(history[next] ?? "");
      }
    } else if (e.key === "Tab") {
      // Complete only against the fixed command list.
      const matches = commandNames.filter((n) => n.startsWith(input.trim().toLowerCase()));
      if (input.trim() && matches.length === 1) {
        e.preventDefault();
        setInput(matches[0] ?? input);
      }
    }
  };

  return (
    <div
      className="-m-4 flex h-[calc(100%+2rem)] min-h-[16rem] flex-col bg-black/40 p-3 font-mono text-[13px] leading-relaxed"
      onClick={() => inputRef.current?.focus()}
    >
      <div role="log" aria-live="polite" aria-label="Terminal output" className="scroll-thin min-h-0 flex-1 overflow-y-auto whitespace-pre-wrap break-words">
        {lines.map((l, i) => (
          <div key={i} className={lineStyle[l.kind]}>
            {l.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="mt-2 flex items-center gap-2 border-t border-line pt-2">
        <label htmlFor="terminal-input" className="shrink-0 text-accent">
          {PROMPT}
        </label>
        <input
          id="terminal-input"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT_LENGTH))}
          onKeyDown={onKeyDown}
          maxLength={MAX_INPUT_LENGTH}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-fg caret-term outline-none"
        />
      </div>
    </div>
  );
}
