import type { AppId } from "@/types/terminal";

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WinState extends Rect {
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  z: number;
  /** Rect to restore after un-maximizing. */
  restore: Rect | null;
  placed: boolean;
}

export interface WmState {
  wins: Record<AppId, WinState>;
  zTop: number;
  active: AppId | null;
  bounds: { w: number; h: number };
}

export const MIN_W = 320;
export const MIN_H = 220;

export const defaultSizes: Record<AppId, { w: number; h: number }> = {
  home: { w: 620, h: 500 },
  projects: { w: 700, h: 520 },
  terminal: { w: 640, h: 420 },
  system: { w: 620, h: 560 },
  "security-lab": { w: 720, h: 560 },
  "network-tools": { w: 680, h: 540 },
  skills: { w: 600, h: 520 },
  cv: { w: 640, h: 560 },
  about: { w: 560, h: 480 },
  contact: { w: 520, h: 420 },
};

export const appIds = Object.keys(defaultSizes) as AppId[];

export function initialState(): WmState {
  const wins = {} as Record<AppId, WinState>;
  for (const id of appIds) {
    const s = defaultSizes[id];
    wins[id] = { x: 0, y: 0, ...s, open: false, minimized: false, maximized: false, z: 0, restore: null, placed: false };
  }
  return { wins, zTop: 1, active: null, bounds: { w: 1200, h: 700 } };
}

export type WmAction =
  | { type: "open"; id: AppId; anchor?: "left" | "right" }
  | { type: "close"; id: AppId }
  | { type: "minimize"; id: AppId }
  | { type: "focus"; id: AppId }
  | { type: "toggleMax"; id: AppId }
  | { type: "move"; id: AppId; x: number; y: number }
  | { type: "resize"; id: AppId; w: number; h: number }
  | { type: "bounds"; w: number; h: number }
  | { type: "hydrate"; saved: Partial<Record<AppId, Partial<WinState>>> };

export function clampRect(r: Rect, b: { w: number; h: number }): Rect {
  const w = Math.min(Math.max(r.w, MIN_W), Math.max(b.w, MIN_W));
  const h = Math.min(Math.max(r.h, MIN_H), Math.max(b.h, MIN_H));
  // Keep the title bar reachable: never let the window leave the workspace.
  const x = Math.min(Math.max(r.x, 0), Math.max(b.w - w, 0));
  const y = Math.min(Math.max(r.y, 0), Math.max(b.h - h, 0));
  return { x, y, w, h };
}

function openCount(s: WmState) {
  return appIds.filter((id) => s.wins[id].open).length;
}

export function wmReducer(s: WmState, a: WmAction): WmState {
  switch (a.type) {
    case "bounds": {
      // Re-fit every window when the workspace changes size so none is stranded off-screen.
      const bounds = { w: a.w, h: a.h };
      const wins = { ...s.wins };
      for (const id of appIds) {
        const w = wins[id];
        if (!w.placed) continue;
        wins[id] = w.maximized ? { ...w, x: 0, y: 0, w: bounds.w, h: bounds.h } : { ...w, ...clampRect(w, bounds) };
      }
      return { ...s, bounds, wins };
    }
    case "hydrate": {
      const wins = { ...s.wins };
      let zTop = s.zTop;
      for (const id of appIds) {
        const saved = a.saved[id];
        if (!saved) continue;
        const r = clampRect({ x: saved.x ?? 0, y: saved.y ?? 0, w: saved.w ?? wins[id].w, h: saved.h ?? wins[id].h }, s.bounds);
        wins[id] = { ...wins[id], ...r, open: !!saved.open, minimized: !!saved.minimized, z: saved.z ?? 0, placed: true };
        zTop = Math.max(zTop, (saved.z ?? 0) + 1);
      }
      return { ...s, wins, zTop };
    }
    case "open": {
      const w = s.wins[a.id];
      let next = w;
      if (!w.placed) {
        // Cascade new windows so they do not stack exactly on top of each other.
        const n = openCount(s);
        // An anchor gives the first-run layout: side by side instead of stacked.
        const rect = a.anchor
          ? clampRect({ x: a.anchor === "left" ? 24 : s.bounds.w - w.w - 24, y: 20, w: w.w, h: w.h }, s.bounds)
          : clampRect({ x: 24 + n * 32, y: 16 + n * 28, w: w.w, h: w.h }, s.bounds);
        next = { ...w, ...rect, placed: true };
      }
      next = { ...next, open: true, minimized: false, z: s.zTop };
      return { ...s, wins: { ...s.wins, [a.id]: next }, zTop: s.zTop + 1, active: a.id };
    }
    case "close":
      return {
        ...s,
        wins: { ...s.wins, [a.id]: { ...s.wins[a.id], open: false, minimized: false } },
        active: s.active === a.id ? null : s.active,
      };
    case "minimize":
      return {
        ...s,
        wins: { ...s.wins, [a.id]: { ...s.wins[a.id], minimized: true } },
        active: s.active === a.id ? null : s.active,
      };
    case "focus":
      return {
        ...s,
        wins: { ...s.wins, [a.id]: { ...s.wins[a.id], z: s.zTop, minimized: false } },
        zTop: s.zTop + 1,
        active: a.id,
      };
    case "toggleMax": {
      const w = s.wins[a.id];
      if (w.maximized && w.restore) {
        return { ...s, wins: { ...s.wins, [a.id]: { ...w, ...w.restore, maximized: false, restore: null } } };
      }
      return {
        ...s,
        wins: {
          ...s.wins,
          [a.id]: { ...w, restore: { x: w.x, y: w.y, w: w.w, h: w.h }, x: 0, y: 0, w: s.bounds.w, h: s.bounds.h, maximized: true },
        },
      };
    }
    case "move": {
      const w = s.wins[a.id];
      if (w.maximized) return s;
      const r = clampRect({ x: a.x, y: a.y, w: w.w, h: w.h }, s.bounds);
      return { ...s, wins: { ...s.wins, [a.id]: { ...w, x: r.x, y: r.y } } };
    }
    case "resize": {
      const w = s.wins[a.id];
      if (w.maximized) return s;
      const r = clampRect({ x: w.x, y: w.y, w: a.w, h: a.h }, s.bounds);
      return { ...s, wins: { ...s.wins, [a.id]: { ...w, ...r } } };
    }
  }
}
