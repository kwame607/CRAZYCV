/**
 * Pure choreography for the intro. Everything here maps a scroll progress
 * `p` in [0, 1] to a number. No DOM, no React, so it can be tested directly.
 */

export const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export function smoothstep(a: number, b: number, x: number): number {
  if (a === b) return x < a ? 0 : 1;
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}

export const easeInOutCubic = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd] in scroll progress. */
export type Window4 = readonly [number, number, number, number];

export function windowOpacity(w: Window4, p: number): number {
  return smoothstep(w[0], w[1], p) * (1 - smoothstep(w[2], w[3], p));
}

export interface Caption {
  id: "welcome" | "build" | "investigate" | "ship" | "name";
  window: Window4;
}

/**
 * The text beats of the intro. The copy lives in the component; the timing
 * lives here. Windows never overlap by more than their fade, so two captions
 * are never fully visible at once.
 */
export const captions: readonly Caption[] = [
  { id: "welcome", window: [-0.2, -0.1, 0.09, 0.15] },
  { id: "build", window: [0.17, 0.22, 0.35, 0.4] },
  { id: "investigate", window: [0.43, 0.48, 0.62, 0.67] },
  { id: "ship", window: [0.69, 0.74, 0.79, 0.84] },
  { id: "name", window: [0.88, 0.95, 2, 3] },
];

export function captionOpacity(id: Caption["id"], p: number): number {
  const c = captions.find((x) => x.id === id);
  return c ? windowOpacity(c.window, p) : 0;
}

/**
 * Distance of the camera from the brain's centre. Negative means "inside and
 * past it". After exiting the far side the camera turns round (see cameraYaw)
 * and pulls back, so the finale looks back at the mind from outside.
 */
export function cameraDistance(p: number): number {
  const a = lerp(4.7, 4.2, smoothstep(0, 0.12, p));
  const b = lerp(a, 2.4, smoothstep(0.12, 0.4, p));
  const through = lerp(b, -2.1, smoothstep(0.4, 0.78, p));
  return lerp(through, 5.4, smoothstep(0.8, 0.97, p));
}

/**
 * Yaw starts as a side view (long axis across the screen), then swings a
 * quarter turn so the camera looks down the long axis and can travel through
 * the structure. At the end it turns a half turn to look back. `t` adds a
 * gentle idle sway that fades out once the journey starts.
 */
export function cameraYaw(p: number, t: number): number {
  const idle = Math.sin(t * 0.22) * 0.22 * (1 - smoothstep(0.08, 0.38, p));
  return 0.3 + smoothstep(0.1, 0.46, p) * (Math.PI / 2) + smoothstep(0.8, 0.97, p) * Math.PI + idle;
}

export function cameraPitch(p: number): number {
  return 0.16 * (1 - smoothstep(0.1, 0.5, p));
}

/** 0 → 1.1: how far the "ignition front" has travelled through the network. */
export function ignition(p: number): number {
  return smoothstep(0.1, 0.6, p) * 1.1;
}

/** Global brightness: full through the journey, settling to a dim backdrop at the end. */
export function ambient(p: number): number {
  return 1 - 0.62 * smoothstep(0.86, 0.97, p);
}

export function formatDepth(p: number): string {
  return `${String(Math.round(clamp01(p) * 100)).padStart(3, "0")}%`;
}

/** Index (1-based) of the caption currently most visible, or 0 if none. */
export function activeBeat(p: number): number {
  let best = 0;
  let bestOpacity = 0.05;
  captions.forEach((c, i) => {
    const o = windowOpacity(c.window, p);
    if (o > bestOpacity) {
      bestOpacity = o;
      best = i + 1;
    }
  });
  return best;
}
