"use client";

import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { simScenarios, type SimPort } from "@/lib/security/demo-scenarios";
import { GhostButton, Notice, PrimaryButton } from "@/components/shared/ui";

type Phase = "idle" | "running" | "done";

const stateColor: Record<SimPort["state"], string> = {
  open: "text-term",
  closed: "text-fg2",
  filtered: "text-warn",
};

export function ScanSimulation() {
  const [scenarioId, setScenarioId] = useState(simScenarios[0]?.id ?? "");
  const scenario = simScenarios.find((s) => s.id === scenarioId) ?? simScenarios[0];
  const [phase, setPhase] = useState<Phase>("idle");
  const [revealed, setRevealed] = useState(0);
  const [selected, setSelected] = useState<SimPort | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };
  useEffect(() => stop, []);

  if (!scenario) return null;
  const total = scenario.ports.length;

  const start = () => {
    stop();
    setSelected(null);
    setRevealed(0);
    setPhase("running");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setRevealed(total);
      setPhase("done");
      return;
    }
    let n = 0;
    timer.current = setInterval(() => {
      n += 1;
      setRevealed(n);
      if (n >= total) {
        stop();
        setPhase("done");
      }
    }, 600);
  };

  const reset = () => {
    stop();
    setPhase("idle");
    setRevealed(0);
    setSelected(null);
  };

  const shown = scenario.ports.slice(0, revealed);
  const pct = Math.round((revealed / total) * 100);

  return (
    <div className="space-y-4">
      <Notice tone="warn">
        <strong className="text-fg">SIMULATION.</strong> This is a fixed, pre-written dataset replayed in your browser. No packets are sent, no network is
        scanned, and the target address belongs to a reserved documentation range. It is not the output of a real scan.
      </Notice>

      <div>
        <label htmlFor="scenario" className="mb-1 block text-xs text-fg2">
          Scenario
        </label>
        <select
          id="scenario"
          value={scenarioId}
          onChange={(e) => {
            setScenarioId(e.target.value);
            reset();
          }}
          className="w-full rounded-md border border-line bg-bg2 px-2 py-1.5 text-sm text-fg"
        >
          {simScenarios.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-fg2">{scenario.description}</p>
        <p className="mt-1 font-mono text-xs text-fg2">Target (fictional): {scenario.target}</p>
      </div>

      <div className="flex gap-2">
        <PrimaryButton onClick={start} disabled={phase === "running"}>
          <Play className="h-4 w-4" aria-hidden /> {phase === "done" ? "Run again" : "Start simulation"}
        </PrimaryButton>
        <GhostButton onClick={reset} disabled={phase === "idle"}>
          <RotateCcw className="h-4 w-4" aria-hidden /> Reset
        </GhostButton>
      </div>

      {phase !== "idle" && (
        <div>
          <div
            role="progressbar"
            aria-label="Simulation progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            className="h-1.5 overflow-hidden rounded bg-white/10"
          >
            <div className="h-full bg-accent transition-[width] duration-300" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1 font-mono text-[11px] text-fg2">
            {phase === "running" ? `Replaying sample data… ${revealed}/${total} ports` : "Replay complete (simulated)"}
          </p>
        </div>
      )}

      {shown.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-line">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Simulated port results</caption>
            <thead className="border-b border-line text-xs text-fg2">
              <tr>
                <th scope="col" className="px-3 py-2">Port</th>
                <th scope="col" className="px-3 py-2">State</th>
                <th scope="col" className="px-3 py-2">Service (by convention)</th>
                <th scope="col" className="px-3 py-2"><span className="sr-only">Details</span></th>
              </tr>
            </thead>
            <tbody>
              {shown.map((p) => (
                <tr key={p.port} className="border-b border-line last:border-0">
                  <td className="px-3 py-2 font-mono">{p.port}/{p.protocol}</td>
                  <td className={`px-3 py-2 font-mono ${stateColor[p.state]}`}>{p.state}</td>
                  <td className="px-3 py-2 font-mono text-fg2">{p.service}</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => setSelected(p)}
                      aria-pressed={selected?.port === p.port}
                      className="text-xs text-accent hover:underline"
                    >
                      Explain<span className="sr-only"> port {p.port}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <section aria-live="polite" className="space-y-2 rounded-lg border border-accent/40 bg-accent/5 p-4 text-sm">
          <h4 className="font-mono text-accent">
            Port {selected.port}/{selected.protocol}: {selected.state} (simulated)
          </h4>
          <p className="text-fg2"><strong className="text-fg">What it means:</strong> {selected.explanation}</p>
          <p className="text-fg2"><strong className="text-fg">Limits and false positives:</strong> {selected.falsePositiveNote}</p>
          <p className="text-fg2"><strong className="text-fg">Sample remediation:</strong> {selected.remediation}</p>
        </section>
      )}
    </div>
  );
}
