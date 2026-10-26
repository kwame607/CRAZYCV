"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "Starting ADOM // OS interface",
  "Checking which browser APIs this page can use (read-only, nothing is scanned)",
  "Loading portfolio configuration and project metadata",
  "Opening desktop",
];

const SEEN_KEY = "adom-os-booted";

/**
 * Short intro. Skipped instantly for reduced-motion visitors and for repeat
 * visits in the same browser session. Never blocks content for long.
 */
export function BootScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      /* storage blocked */
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      // Decide on mount: browser-only signals are not available during SSR.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSkip(true);
      onDone();
      return;
    }
    const timers = STEPS.map((_, i) => setTimeout(() => setStep(i), i * 420));
    const end = setTimeout(() => finish(), STEPS.length * 420 + 200);
    function finish() {
      try {
        window.sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* ignore */
      }
      onDone();
    }
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(end);
    };
  }, [onDone]);

  const skipNow = () => {
    try {
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
    onDone();
  };

  if (skip) return null;

  return (
    <div className="boot-overlay fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg p-6" role="status" aria-live="polite" aria-label="Starting">
      <h1 className="font-mono text-3xl font-semibold tracking-wide text-fg sm:text-4xl">
        ADOM <span className="text-accent">{"//"}</span> OS
      </h1>
      <div className="mt-6 h-1 w-64 max-w-full overflow-hidden rounded bg-white/10">
        <div className="boot-bar h-full bg-accent" />
      </div>
      <ul className="mt-5 w-full max-w-md space-y-1 font-mono text-xs text-fg2">
        {STEPS.slice(0, step + 1).map((s, i) => (
          <li key={s} className={i === step ? "text-term" : ""}>
            {i < step ? "✓" : "›"} {s}
          </li>
        ))}
      </ul>
      <button type="button" onClick={skipNow} className="mt-8 rounded-md border border-line px-3 py-1.5 text-sm text-fg hover:bg-white/10">
        Skip intro
      </button>
    </div>
  );
}
