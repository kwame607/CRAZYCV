import { describe, expect, it } from "vitest";
import { activeBeat, ambient, cameraDistance, cameraPitch, cameraYaw, captionOpacity, captions, clamp01, easeInOutCubic, formatDepth, ignition, smoothstep, windowOpacity } from "./timeline";

describe("easing helpers", () => {
  it("clamp01 and smoothstep stay in range", () => {
    expect(clamp01(-3)).toBe(0);
    expect(clamp01(9)).toBe(1);
    expect(smoothstep(0.2, 0.6, 0.1)).toBe(0);
    expect(smoothstep(0.2, 0.6, 0.9)).toBe(1);
    expect(smoothstep(0.2, 0.6, 0.4)).toBeCloseTo(0.5, 5);
  });
  it("smoothstep with a zero-width edge does not divide by zero", () => {
    expect(smoothstep(0.5, 0.5, 0.4)).toBe(0);
    expect(smoothstep(0.5, 0.5, 0.6)).toBe(1);
  });
  it("easeInOutCubic starts at 0, ends at 1 and is monotonic", () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(1)).toBe(1);
    let prev = -1;
    for (let i = 0; i <= 20; i++) {
      const v = easeInOutCubic(i / 20);
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  });
});

describe("captions", () => {
  it("shows the welcome text at the very start and nothing else", () => {
    expect(captionOpacity("welcome", 0)).toBe(1);
    for (const id of ["build", "investigate", "ship", "name"] as const) expect(captionOpacity(id, 0)).toBe(0);
  });
  it("hands over beat by beat in order as scroll progresses", () => {
    expect(captionOpacity("build", 0.28)).toBe(1);
    expect(captionOpacity("investigate", 0.55)).toBe(1);
    expect(captionOpacity("ship", 0.76)).toBe(1);
    expect(captionOpacity("name", 1)).toBe(1);
    expect(activeBeat(0)).toBe(1);
    expect(activeBeat(0.28)).toBe(2);
    expect(activeBeat(0.55)).toBe(3);
    expect(activeBeat(0.76)).toBe(4);
    expect(activeBeat(1)).toBe(5);
  });
  it("never has two captions mostly visible at the same time", () => {
    for (let i = 0; i <= 1000; i++) {
      const p = i / 1000;
      const strong = captions.filter((c) => windowOpacity(c.window, p) > 0.5).length;
      expect(strong, `p=${p}`).toBeLessThanOrEqual(1);
    }
  });
  it("every caption window is well-formed (ascending)", () => {
    for (const c of captions) {
      const w = c.window;
      expect(w[0]).toBeLessThanOrEqual(w[1]);
      expect(w[1]).toBeLessThanOrEqual(w[2]);
      expect(w[2]).toBeLessThanOrEqual(w[3]);
    }
  });
});

describe("camera path", () => {
  it("starts outside, moves steadily inward, passes through, then pulls back out to look back", () => {
    expect(cameraDistance(0)).toBeGreaterThan(4);
    expect(cameraDistance(0.78)).toBeLessThan(0); // inside and past the structure
    expect(cameraDistance(1)).toBeGreaterThan(4); // outside again, looking back
    let prev = Infinity;
    for (let i = 0; i <= 160; i++) {
      const d = cameraDistance((i / 160) * 0.78);
      expect(d).toBeLessThanOrEqual(prev + 1e-9);
      prev = d;
    }
    prev = -Infinity;
    for (let i = 0; i <= 100; i++) {
      const d = cameraDistance(0.8 + (i / 100) * 0.2);
      expect(d).toBeGreaterThanOrEqual(prev - 1e-9);
      prev = d;
    }
  });
  it("swings a quarter turn to travel down the long axis, then a half turn to look back", () => {
    expect(cameraYaw(0.7, 0) - cameraYaw(0, 0)).toBeCloseTo(Math.PI / 2, 1);
    expect(cameraYaw(1, 0) - cameraYaw(0.7, 0)).toBeCloseTo(Math.PI, 1);
  });
  it("idle sway fades out once the journey starts", () => {
    const early = Math.abs(cameraYaw(0, 7) - cameraYaw(0, 0));
    const late = Math.abs(cameraYaw(0.6, 7) - cameraYaw(0.6, 0));
    expect(early).toBeGreaterThan(0.05);
    expect(late).toBeLessThan(1e-9);
  });
  it("pitch relaxes to level", () => {
    expect(cameraPitch(0)).toBeGreaterThan(0);
    expect(cameraPitch(1)).toBe(0);
  });
  it("ignition lights everything by mid-journey, and the scene dims at the end", () => {
    expect(ignition(0)).toBe(0);
    expect(ignition(0.7)).toBeGreaterThanOrEqual(1.1 - 1e-9);
    expect(ambient(0.5)).toBe(1);
    expect(ambient(1)).toBeLessThan(0.45);
    expect(ambient(1)).toBeGreaterThan(0.2); // dim, but the mind is still visible behind the name
  });
  it("formats the depth readout as three digits and a percent sign", () => {
    expect(formatDepth(0)).toBe("000%");
    expect(formatDepth(0.074)).toBe("007%");
    expect(formatDepth(1)).toBe("100%");
    expect(formatDepth(5)).toBe("100%");
  });
});
