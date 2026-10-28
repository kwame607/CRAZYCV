"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { SystemInfoProvider, useSystemInfo } from "@/components/system/SystemInfoProvider";
import { SystemOverview } from "@/components/applications/SystemOverview";
import { Reveal } from "@/components/experience/Reveal";
import { SectionHeader, container } from "@/components/experience/SectionHeader";
import type { TerminalContext, TerminalLine } from "@/types/terminal";
import { commandNames, runCommand } from "@/lib/terminal/command-registry";
import { MAX_INPUT_LENGTH } from "@/lib/terminal/command-parser";
import { sectionLines } from "@/lib/browser/report";
import { downloadCv, replayIntro, scrollToSection } from "@/lib/experience/actions";

const PROMPT = "kwame@mind:~$";
const chips = ["help", "whoami", "projects", "skills", "security", "experience", "cv", "contact", "network"];

const welcome: TerminalLine[] = [
  { kind: "info", text: "Inside Kwame's mind. A portfolio navigator, not a shell." },
  { kind: "info", text: "Type 'help', or tap a command below. Nothing you type is executed on any machine." },
];

const lineStyle: Record<TerminalLine["kind"], string> = {
  cmd: "text-fg",
  out: "text-term",
  err: "text-danger",
  info: "text-fg2",
};

function TerminalPanel() {
  const { sections, requestIp } = useSystemInfo();
  const [lines, setLines] = useState<TerminalLine[]>(welcome);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const ctx = useMemo<TerminalContext>(() => {
    const loading = ["System information is still loading."];
    return {
      systemLines: () =>
        sections.length === 0
          ? loading
          : ["-- Device --", ...sectionLines(sections, "device"), "-- Connection --", ...sectionLines(sections, "connection"), "-- Portfolio system --", ...sectionLines(sections, "portfolio")],
      browserLines: () => (sections.length ? sectionLines(sections, "browser", ["User-agent"]) : loading),
      networkLines: () => (sections.length ? sectionLines(sections, "connection") : loading),
      requestIp,
    };
  }, [sections, requestIp]);

  // Keep the newest line in view inside the terminal only; never scroll the page.
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const run = useCallback(
    (raw: string) => {
      const text = raw.slice(0, MAX_INPUT_LENGTH);
      if (!text.trim()) {
        setLines((l) => [...l, { kind: "cmd", text: PROMPT }]);
        return;
      }
      setHistory((h) => [...h, text]);
      const result = runCommand(text, ctx);
      if (result.clear) {
        setLines([]);
        return;
      }
      const jump: TerminalLine[] = result.go && !result.autoScroll ? [{ kind: "info", text: `↳ jump to ${result.go}`, go: result.go }] : [];
      setLines((l) => [...l, { kind: "cmd", text: `${PROMPT} ${text}` }, ...(result.lines ?? []), ...jump]);
      if (result.go && result.autoScroll) scrollToSection(result.go);
      if (result.download === "cv") downloadCv();
      if (result.replay) replayIntro();
      if (result.deferred) void result.deferred().then((more) => setLines((l) => [...l, ...more]));
    },
    [ctx],
  );

  const submit = () => {
    const raw = input;
    setInput("");
    setCursor(null);
    run(raw);
  };

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
    <div className="overflow-hidden rounded-2xl border border-line bg-win shadow-[0_40px_100px_-40px_rgba(0,0,0,.8)]">
      <div className="flex items-center justify-between border-b border-line px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em]">
        <span className="text-term">&gt;_ {PROMPT.replace("$", "")}</span>
        <span className="hidden text-fg2 sm:inline">navigator · not a shell</span>
      </div>
      <div className="p-4 font-mono text-[13px] leading-relaxed md:p-6" onClick={() => inputRef.current?.focus()}>
        <div ref={logRef} role="log" aria-live="polite" aria-label="Terminal output" tabIndex={0} className="scroll-thin h-[19rem] overflow-y-auto whitespace-pre-wrap break-words md:h-[23rem]">
          {lines.map((l, i) =>
            l.go ? (
              <div key={i}>
                <button type="button" onClick={() => scrollToSection(l.go!)} className="text-accent underline-offset-4 hover:underline">
                  {l.text}
                </button>
              </div>
            ) : (
              <div key={i} className={lineStyle[l.kind]}>
                {l.text}
              </div>
            ),
          )}
        </div>
        <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
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
            enterKeyHint="send"
            className="min-w-0 flex-1 bg-transparent text-fg caret-term outline-none"
          />
        </div>
      </div>
      <ul className="flex flex-wrap gap-2 border-t border-line px-4 py-4 md:px-6" aria-label="Quick commands">
        {chips.map((c) => (
          <li key={c}>
            <button
              type="button"
              onClick={() => run(c)}
              className="rounded-full border border-line px-3.5 py-2 font-mono text-[11px] text-fg2 transition-colors duration-[var(--t-fast)] hover:border-term hover:text-term"
            >
              {c}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LiveSections() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);
  return (
    <SystemInfoProvider>
      <section id="terminal" aria-labelledby="terminal-title" className="border-t border-line bg-bg2 py-24 md:py-36">
        <div className={container}>
          <SectionHeader
            index="05"
            label="Terminal"
            lead="An optional way to explore this site. It runs a fixed list of commands against the same data the page uses. There is no shell. Nothing you type is sent anywhere, apart from the optional public-IP lookup, which only runs if you ask for it."
          >
            <span id="terminal-title">
              Ask the mind <em className="text-term">directly.</em>
            </span>
          </SectionHeader>
          <Reveal className="mt-12">{hydrated ? <TerminalPanel /> : <p className="font-mono text-sm text-fg2">Loading terminal…</p>}</Reveal>
        </div>
      </section>

      <section id="system" aria-labelledby="system-title" className="py-24 md:py-36">
        <div className={container}>
          <SectionHeader
            index="06"
            label="System overview"
            lead="What your own browser reports to every site you visit, shown only to you. Nothing is scanned, stored or sent. Values are labelled detected, inferred or unavailable, because browsers can hide or spoof them."
          >
            <span id="system-title">
              What your browser <em className="text-accent">tells me.</em>
            </span>
          </SectionHeader>
          <Reveal className="mt-12 rounded-2xl border border-line bg-bg2 p-5 md:p-8">
            <SystemOverview />
          </Reveal>
        </div>
      </section>
    </SystemInfoProvider>
  );
}
