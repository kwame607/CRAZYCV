import { describe, expect, it } from "vitest";
import { createMind, drawMind, mulberry32, type FrameState } from "./mind";

describe("createMind", () => {
  it("is deterministic for a given seed", () => {
    const a = createMind(400, 1);
    const b = createMind(400, 1);
    expect(Array.from(a.pos.slice(0, 30))).toEqual(Array.from(b.pos.slice(0, 30)));
    expect(a.edgeCount).toBe(b.edgeCount);
    expect(Array.from(createMind(400, 2).pos.slice(0, 6))).not.toEqual(Array.from(a.pos.slice(0, 6)));
  });

  it("builds the requested number of nodes, all finite and inside a brain-sized volume", () => {
    const m = createMind(600);
    expect(m.count).toBe(600);
    for (let i = 0; i < m.pos.length; i++) {
      expect(Number.isFinite(m.pos[i] as number)).toBe(true);
      expect(Math.abs(m.pos[i] as number)).toBeLessThan(2);
    }
  });

  it("has a front-to-back long axis (x longer than z) so a side view reads as a brain", () => {
    const m = createMind(1200);
    let xmin = Infinity, xmax = -Infinity, zmin = Infinity, zmax = -Infinity;
    for (let i = 0; i < m.count; i++) {
      const x = m.pos[i * 3] as number;
      const z = m.pos[i * 3 + 2] as number;
      xmin = Math.min(xmin, x); xmax = Math.max(xmax, x);
      zmin = Math.min(zmin, z); zmax = Math.max(zmax, z);
    }
    expect(xmax - xmin).toBeGreaterThan(zmax - zmin);
  });

  it("links each node to a few neighbours, without self-links or duplicates", () => {
    const m = createMind(700);
    expect(m.edgeCount).toBeGreaterThan(m.count);
    expect(m.edgeCount).toBeLessThan(m.count * 4);
    const seen = new Set<number>();
    for (let e = 0; e < m.edgeCount; e++) {
      const a = m.edgeA[e] as number;
      const b = m.edgeB[e] as number;
      expect(a).toBeLessThan(b);
      expect(b).toBeLessThan(m.count);
      const id = a * m.count + b;
      expect(seen.has(id)).toBe(false);
      seen.add(id);
    }
  });

  it("keeps ignition order keys within 0..1", () => {
    const m = createMind(500);
    for (let e = 0; e < m.edgeCount; e++) {
      expect(m.edgeKey[e]).toBeGreaterThanOrEqual(0);
      expect(m.edgeKey[e]).toBeLessThanOrEqual(1.01);
    }
  });
});

describe("mulberry32", () => {
  it("returns values in [0, 1) and repeats for the same seed", () => {
    const r = mulberry32(5);
    const r2 = mulberry32(5);
    for (let i = 0; i < 100; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
      expect(v).toBe(r2());
    }
  });
});

/** A canvas stand-in that only counts what would be drawn. */
function fakeCtx() {
  const calls: Record<string, number> = {};
  const count = (k: string) => () => {
    calls[k] = (calls[k] ?? 0) + 1;
  };
  const ctx = new Proxy(
    {
      createRadialGradient: () => ({ addColorStop: () => undefined }),
    } as Record<string, unknown>,
    {
      get(t, k: string) {
        if (k in t) return t[k];
        return count(k);
      },
      set() {
        return true;
      },
    },
  );
  return { ctx: ctx as unknown as CanvasRenderingContext2D, calls };
}

const frame = (p: number, over: Partial<FrameState> = {}): FrameState => ({ w: 1200, h: 800, p, t: 3, mx: 0, my: 0, lowPower: false, ...over });

describe("drawMind", () => {
  const m = createMind(900);

  it("draws nodes and links at every stage of the journey without throwing", () => {
    for (const p of [0, 0.1, 0.25, 0.4, 0.5, 0.6, 0.75, 0.9, 1]) {
      const { ctx, calls } = fakeCtx();
      expect(() => drawMind(ctx, m, frame(p))).not.toThrow();
      expect(calls.clearRect).toBe(1);
      expect(calls.stroke).toBeGreaterThan(0);
    }
  });

  it("draws many nodes while outside, and culls nodes once the camera has passed through", () => {
    const outside = fakeCtx();
    drawMind(outside.ctx, m, frame(0));
    const past = fakeCtx();
    drawMind(past.ctx, m, frame(0.78));
    const total = (c: Record<string, number>) => (c.fillRect ?? 0) + (c.arc ?? 0);
    expect(total(outside.calls)).toBeGreaterThan(m.count * 0.9);
    expect(total(past.calls)).toBeLessThan(total(outside.calls) * 0.2);
  });

  it("finishes by looking back at the whole mind from outside, dimmed", () => {
    const end = fakeCtx();
    drawMind(end.ctx, m, frame(1));
    expect((end.calls.fillRect ?? 0) + (end.calls.arc ?? 0)).toBeGreaterThan(m.count * 0.9);
  });

  it("is cheaper in low-power mode (no travelling pulses)", () => {
    const full = fakeCtx();
    drawMind(full.ctx, m, frame(0.5));
    const low = fakeCtx();
    drawMind(low.ctx, m, frame(0.5, { lowPower: true }));
    expect((low.calls.fillRect ?? 0) + (low.calls.arc ?? 0)).toBeLessThan((full.calls.fillRect ?? 0) + (full.calls.arc ?? 0));
  });

  it("allocates no per-frame buffers (scratch arrays are reused)", () => {
    const before = [m.sx, m.sy, m.sz, ...m.buckets];
    drawMind(fakeCtx().ctx, m, frame(0.5));
    expect([m.sx, m.sy, m.sz, ...m.buckets]).toEqual(before);
    expect(m.sx).toBe(before[0]);
  });
});
