"use client";

import { useEffect, useRef, useState } from "react";
import { createMind, drawMind } from "@/lib/experience/mind";
import { captionOpacity, captions, clamp01, easeInOutCubic, formatDepth, type Caption } from "@/lib/experience/timeline";
import { scrollToSection, skipIntro } from "@/lib/experience/actions";

/**
 * "Welcome to my mind": a tall runway containing a sticky stage.
 *
 * Scrolling is native (no wheel/touch hijacking). Each frame we read how far
 * through the runway the page is, ease towards it, and draw the brain and the
 * captions for that progress. React never re-renders per frame; the loop
 * writes straight to canvas and a handful of DOM styles.
 */
export function IntroStage() {
  const runwayRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const depthRef = useRef<HTMLSpanElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const playRef = useRef<() => void>(() => undefined);
  const [canvasFailed, setCanvasFailed] = useState(false);

  useEffect(() => {
    const runway = runwayRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!runway || !stage || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      // Canvas unavailable: the CSS fallback and the text captions still work.
      setCanvasFailed(true);
      return;
    }

    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const smallMq = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    const mind = createMind(smallMq.matches ? 760 : 1350);
    const root = document.documentElement;
    const capEls: Partial<Record<Caption["id"], HTMLElement>> = {};
    stage.querySelectorAll<HTMLElement>("[data-cap]").forEach((el) => {
      capEls[el.dataset.cap as Caption["id"]] = el;
    });

    let w = 0;
    let h = 0;
    let dpr = 1;
    let t = 0;
    let shown = 0;
    let last = performance.now();
    let raf = 0;
    let visible = false;
    let px = 0;
    let py = 0;
    let mx = 0;
    let my = 0;
    let tweenId = 0;
    let lastPhase = "";
    let lastBeatEnd = false;
    let lastStarted = false;
    // Adaptive quality: 0 full, 1 no additive blending or pulses, 2 also half the frame rate.
    // Phones start at 1. The loop steps down if real frame times say the device is struggling.
    let tier = smallMq.matches ? 1 : 0;
    let ema = 16;
    let framesAtTier = 0;
    let skip = false;

    const setPhase = (phase: "intro" | "site") => {
      if (lastPhase === phase) return;
      lastPhase = phase;
      root.dataset.phase = phase;
    };

    const resize = () => {
      const r = stage.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      dpr = Math.min(window.devicePixelRatio || 1, tier === 0 ? 2 : tier === 1 ? 1.5 : 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reducedMq.matches || !visible) drawFrame(reducedMq.matches ? 0.34 : shown);
    };

    const drawFrame = (p: number) => {
      drawMind(ctx, mind, { w, h, p, t, mx, my, lowPower: tier >= 1 });
    };

    const applyDom = (p: number) => {
      if (depthRef.current) depthRef.current.textContent = formatDepth(p);
      if (railRef.current) railRef.current.style.transform = `scaleY(${p.toFixed(3)})`;
      for (const c of captions) {
        const el = capEls[c.id];
        if (!el) continue;
        const o = captionOpacity(c.id, p);
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translate3d(0,${((1 - o) * 16).toFixed(1)}px,0)`;
        el.style.visibility = o < 0.01 ? "hidden" : "visible";
      }
      const started = p > 0.06;
      if (started !== lastStarted) {
        lastStarted = started;
        stage.dataset.started = started ? "1" : "0";
      }
      const end = p > 0.9;
      if (end !== lastBeatEnd) {
        lastBeatEnd = end;
        stage.dataset.end = end ? "1" : "0";
      }
      setPhase(p < 0.9 ? "intro" : "site");
    };

    const readTarget = () => {
      const rect = runway.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      if (range <= 1) return 0;
      return clamp01(-rect.top / range);
    };

    const frame = (now: number) => {
      // Returning visitors: the runway is collapsed to nothing. Stand down and leave the nav visible.
      if (runway.offsetHeight < 2) {
        setPhase("site");
        raf = 0;
        return;
      }
      const raw = now - last;
      const dt = Math.min(0.05, raw / 1000);
      last = now;
      t += dt;
      // Judge the device by real frame intervals (ignore the first frames and tab-switch gaps).
      if (raw < 500) {
        ema += (raw - ema) * 0.08;
        framesAtTier += 1;
        if (framesAtTier > 50 && ema > 38 && tier < 2) {
          tier += 1;
          framesAtTier = 0;
          ema = 16;
          resize();
        }
      }
      if (tier >= 2) {
        skip = !skip;
        if (skip) {
          if (visible) raf = requestAnimationFrame(frame);
          return;
        }
      }
      const target = readTarget();
      // Easing uses real elapsed time (capped at 250ms) so a slow device still catches up to the scroll.
      shown += (target - shown) * (1 - Math.exp(-Math.min(0.25, raw / 1000) * 7));
      if (Math.abs(target - shown) < 0.0005) shown = target;
      mx += (px - mx) * 0.05;
      my += (py - my) * 0.05;
      drawFrame(shown);
      applyDom(shown);
      if (visible) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf || reducedMq.matches || runway.offsetHeight < 2) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries.some((e) => e.isIntersecting);
        if (visible) start();
        else {
          stop();
          setPhase("site");
        }
      },
      { threshold: 0 },
    );
    io.observe(runway);

    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      px = e.clientX / window.innerWidth - 0.5;
      py = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const cancelers: Array<[string, EventListener]> = [];
    const cancelTween = () => {
      cancelAnimationFrame(tweenId);
      tweenId = 0;
      for (const [type, fn] of cancelers) window.removeEventListener(type, fn);
      cancelers.length = 0;
    };

    // "Enter" plays the journey for people who won't or can't scroll. Any input hands control back.
    playRef.current = () => {
      if (reducedMq.matches) {
        skipIntro();
        return;
      }
      cancelTween();
      const rect = runway.getBoundingClientRect();
      const from = window.scrollY;
      const to = from + rect.bottom - window.innerHeight;
      if (to <= from) {
        skipIntro();
        return;
      }
      const dur = Math.min(6500, Math.max(3500, (to - from) * 1.1));
      const t0 = performance.now();
      for (const type of ["wheel", "touchstart", "keydown", "pointerdown"]) {
        window.addEventListener(type, cancelTween, { passive: true, once: true });
        cancelers.push([type, cancelTween]);
      }
      const step = (now: number) => {
        const k = clamp01((now - t0) / dur);
        window.scrollTo({ top: from + (to - from) * easeInOutCubic(k), behavior: "instant" });
        if (k < 1) tweenId = requestAnimationFrame(step);
        else cancelTween();
      };
      tweenId = requestAnimationFrame(step);
    };

    // "Replay intro" re-opens a collapsed runway; the observer sees no change, so it tells us directly.
    const onReplay = () => {
      shown = 0;
      lastPhase = "";
      start();
    };
    window.addEventListener("ka:replay", onReplay);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && visible && lastPhase === "intro") skipIntro();
    };
    window.addEventListener("keydown", onKey);

    resize();
    if (reducedMq.matches) {
      // One still frame, welcome text only. All content below is unchanged.
      applyDom(0);
      root.dataset.phase = "site";
    }

    return () => {
      stop();
      cancelTween();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("ka:replay", onReplay);
      root.dataset.phase = "site";
    };
  }, []);

  // Server markup shows only the welcome beat; the loop takes over after hydration.
  const hidden = { opacity: 0, visibility: "hidden" as const };

  return (
    <section ref={runwayRef} id="intro" aria-label="Introduction: welcome to my mind" className="intro-runway">
      <div ref={stageRef} className="intro-stage group" data-end="0" data-started="0">
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
        {canvasFailed && (
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 48%, rgba(233,177,85,.22), transparent 38%), radial-gradient(circle at 30% 60%, rgba(98,230,165,.08), transparent 30%)",
            }}
          />
        )}

        {/* chrome */}
        <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between p-5 font-mono text-[11px] uppercase tracking-[0.2em] transition-opacity duration-[var(--t-fast)] group-data-[end=1]:invisible group-data-[end=1]:opacity-0 md:p-8">
          <div className="text-fg" aria-hidden="true">
            KA <span className="text-fg2">/ Kwame Adom</span>
          </div>
          <div className="flex items-center gap-5">
            <span aria-hidden="true" className="hidden text-fg2 sm:inline">
              Depth <span ref={depthRef} className="text-fg">000%</span>
            </span>
            <button
              type="button"
              onClick={skipIntro}
              className="rounded-full border border-line px-4 py-2 text-fg transition-colors duration-[var(--t-fast)] hover:border-accent hover:text-accent"
            >
              Skip intro <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        {/* progress rail */}
        <div aria-hidden="true" className="absolute bottom-8 right-5 top-24 z-10 w-px bg-line md:right-8">
          <div ref={railRef} className="h-full w-full origin-top bg-accent" style={{ transform: "scaleY(0)" }} />
        </div>

        {/* captions */}
        <div className="pointer-events-none absolute inset-0 z-10 [text-shadow:0_0_26px_rgb(10_12_13/0.95),0_0_60px_rgb(10_12_13/0.8)]">
          <div data-cap="welcome" className="absolute bottom-[19vh] left-5 md:bottom-[17vh] md:left-[6vw]">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent">An interactive portfolio</p>
            <h2 className="mt-4 font-display text-[clamp(3.6rem,12.5vw,11rem)] leading-[0.88] text-fg">
              Welcome
              <br />
              to my <em className="text-accent">mind.</em>
            </h2>
          </div>

          <Beat cap="build" style={hidden} n="01" kicker="Build" title="Learn by building." body="Small tools and projects, built to understand how systems work." />
          <Beat cap="investigate" style={hidden} n="02" kicker="Investigate" title="Curiosity is good. Evidence is better." body="Security learning done carefully: authorized targets and documented evidence." />
          <Beat cap="ship" style={hidden} n="03" kicker="Improve" title="Know how it breaks. Build it better." body="What I learn in the lab goes straight back into how I build." />

          <div data-cap="name" style={hidden} className="absolute inset-x-5 bottom-[21vh] text-center md:bottom-[18vh]">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-fg2">You are inside</p>
            <p className="mt-3 font-display text-[clamp(2.6rem,9vw,8rem)] leading-[0.92] text-fg">Kwame Emmanuel Adom</p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-accent md:text-xs">Cybersecurity · Full-stack web developer · Kumasi, Ghana</p>
          </div>
        </div>

        {/* cue and controls */}
        <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center px-5 md:bottom-8">
          <button
            type="button"
            onClick={() => playRef.current()}
            className="group/enter inline-flex items-center gap-3 rounded-full border border-line bg-bg/60 px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.24em] text-fg backdrop-blur transition-all duration-[var(--t-fast)] hover:border-accent hover:text-accent group-data-[end=1]:invisible group-data-[end=1]:opacity-0 group-data-[started=1]:invisible group-data-[started=1]:opacity-0"
          >
            <span className="hidden md:inline">Scroll to enter</span>
            <span className="md:hidden">Tap to enter</span>
            <span aria-hidden="true" className="cue-bob">↓</span>
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("hero")}
            className="invisible absolute bottom-0 inline-flex items-center gap-3 rounded-full border border-accent bg-accent px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.24em] text-bg opacity-0 transition-all duration-[var(--t-fast)] hover:brightness-110 group-data-[end=1]:visible group-data-[end=1]:opacity-100"
          >
            Continue <span aria-hidden="true" className="cue-bob">↓</span>
          </button>
        </div>
      </div>
    </section>
  );
}

function Beat({
  cap,
  style,
  n,
  kicker,
  title,
  body,
}: {
  cap: Caption["id"];
  style: React.CSSProperties;
  n: string;
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <div data-cap={cap} style={style} aria-hidden="true" className="absolute bottom-[20vh] left-5 max-w-[34rem] md:bottom-[17vh] md:left-[6vw]">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
        {n} <span className="text-fg2">/</span> {kicker}
      </p>
      <p className="mt-4 font-display text-[clamp(2.2rem,5.6vw,4.6rem)] leading-[0.96] text-fg">{title}</p>
      <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-fg2 md:text-base">{body}</p>
    </div>
  );
}

