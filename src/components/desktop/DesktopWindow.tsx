"use client";

import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";
import { Maximize2, Minimize2, Minus, X } from "lucide-react";
import { IconButton } from "@/components/shared/ui";
import { useDesktop } from "./DesktopProvider";
import { appById } from "./apps";
import type { AppId } from "@/types/terminal";

const STEP = 16;

export function DesktopWindow({ id }: { id: AppId }) {
  const { state, dispatch } = useDesktop();
  const w = state.wins[id];
  const app = appById[id];
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const size = useRef<{ sx: number; sy: number; w: number; h: number } | null>(null);
  const isActive = state.active === id;

  // Move keyboard focus into a window when it becomes the active one.
  useEffect(() => {
    if (isActive && w.open && !w.minimized) ref.current?.focus({ preventScroll: true });
  }, [isActive, w.open, w.minimized]);

  if (!w.open) return null;

  const onTitleDown = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    dispatch({ type: "focus", id });
    if (w.maximized) return;
    drag.current = { dx: e.clientX - w.x, dy: e.clientY - w.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onTitleMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    dispatch({ type: "move", id, x: e.clientX - drag.current.dx, y: e.clientY - drag.current.dy });
  };
  const onTitleUp = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const onTitleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, [number, number]> = { ArrowLeft: [-STEP, 0], ArrowRight: [STEP, 0], ArrowUp: [0, -STEP], ArrowDown: [0, STEP] };
    const m = moves[e.key];
    if (m) {
      e.preventDefault();
      dispatch({ type: "move", id, x: w.x + m[0], y: w.y + m[1] });
    }
  };

  const onResizeDown = (e: PointerEvent<HTMLDivElement>) => {
    dispatch({ type: "focus", id });
    size.current = { sx: e.clientX, sy: e.clientY, w: w.w, h: w.h };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onResizeMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!size.current) return;
    dispatch({ type: "resize", id, w: size.current.w + e.clientX - size.current.sx, h: size.current.h + e.clientY - size.current.sy });
  };
  const onResizeUp = (e: PointerEvent<HTMLDivElement>) => {
    size.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const onWindowKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape" && (e.target === ref.current || (e.target as HTMLElement).dataset.titlebar)) {
      dispatch({ type: "close", id });
    }
  };

  const { Icon, Component } = app;
  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={app.title}
      aria-modal="false"
      tabIndex={-1}
      onKeyDown={onWindowKey}
      onPointerDown={() => !isActive && dispatch({ type: "focus", id })}
      hidden={w.minimized}
      style={{ left: w.x, top: w.y, width: w.w, height: w.h, zIndex: w.z }}
      className={`window-in absolute flex flex-col overflow-hidden rounded-xl border bg-win shadow-2xl shadow-black/60 outline-none ${isActive ? "border-accent/40" : "border-line"}`}
    >
      <div
        data-titlebar="true"
        tabIndex={0}
        aria-label={`${app.title} title bar. Arrow keys move the window.`}
        onPointerDown={onTitleDown}
        onPointerMove={onTitleMove}
        onPointerUp={onTitleUp}
        onKeyDown={onTitleKey}
        onDoubleClick={() => dispatch({ type: "toggleMax", id })}
        className="flex shrink-0 cursor-grab touch-none select-none items-center gap-2 border-b border-line bg-bg2 px-3 py-2 active:cursor-grabbing"
      >
        <Icon className="h-4 w-4 text-accent" aria-hidden />
        <span className="flex-1 truncate text-sm font-medium text-fg">{app.title}</span>
        <IconButton label={`Minimize ${app.title}`} onClick={() => dispatch({ type: "minimize", id })}>
          <Minus className="h-4 w-4" aria-hidden />
        </IconButton>
        <IconButton label={w.maximized ? `Restore ${app.title}` : `Maximize ${app.title}`} onClick={() => dispatch({ type: "toggleMax", id })}>
          {w.maximized ? <Minimize2 className="h-3.5 w-3.5" aria-hidden /> : <Maximize2 className="h-3.5 w-3.5" aria-hidden />}
        </IconButton>
        <IconButton label={`Close ${app.title}`} onClick={() => dispatch({ type: "close", id })} className="hover:!bg-danger/30">
          <X className="h-4 w-4" aria-hidden />
        </IconButton>
      </div>

      <div className="scroll-thin relative min-h-0 flex-1 overflow-auto p-4">
        <Component />
      </div>

      {!w.maximized && (
        <div
          aria-hidden
          onPointerDown={onResizeDown}
          onPointerMove={onResizeMove}
          onPointerUp={onResizeUp}
          className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize touch-none"
          style={{ background: "linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.25) 50%)" }}
        />
      )}
    </div>
  );
}
