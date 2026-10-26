import { describe, expect, it } from "vitest";
import { initialState, wmReducer, MIN_W } from "./window-state";

describe("window manager reducer", () => {
  it("opens, focuses with rising z-index, and cascades new windows", () => {
    let s = initialState();
    s = wmReducer(s, { type: "open", id: "home" });
    s = wmReducer(s, { type: "open", id: "terminal" });
    expect(s.wins.home.open && s.wins.terminal.open).toBe(true);
    expect(s.wins.terminal.z).toBeGreaterThan(s.wins.home.z);
    expect(s.wins.terminal.x).not.toBe(s.wins.home.x);
    s = wmReducer(s, { type: "focus", id: "home" });
    expect(s.wins.home.z).toBeGreaterThan(s.wins.terminal.z);
    expect(s.active).toBe("home");
  });
  it("closes and restores", () => {
    let s = wmReducer(initialState(), { type: "open", id: "cv" });
    s = wmReducer(s, { type: "minimize", id: "cv" });
    expect(s.wins.cv.minimized).toBe(true);
    s = wmReducer(s, { type: "open", id: "cv" });
    expect(s.wins.cv.minimized).toBe(false);
    s = wmReducer(s, { type: "close", id: "cv" });
    expect(s.wins.cv.open).toBe(false);
  });
  it("keeps windows inside the workspace and above minimum size", () => {
    let s = wmReducer(initialState(), { type: "bounds", w: 900, h: 600 });
    s = wmReducer(s, { type: "open", id: "about" });
    s = wmReducer(s, { type: "move", id: "about", x: 99999, y: -500 });
    expect(s.wins.about.x + s.wins.about.w).toBeLessThanOrEqual(900);
    expect(s.wins.about.y).toBe(0);
    s = wmReducer(s, { type: "resize", id: "about", w: 10, h: 10 });
    expect(s.wins.about.w).toBeGreaterThanOrEqual(MIN_W);
  });
  it("maximizes and restores the previous rectangle", () => {
    let s = wmReducer(initialState(), { type: "bounds", w: 1000, h: 700 });
    s = wmReducer(s, { type: "open", id: "skills" });
    const before = { x: s.wins.skills.x, y: s.wins.skills.y, w: s.wins.skills.w, h: s.wins.skills.h };
    s = wmReducer(s, { type: "toggleMax", id: "skills" });
    expect(s.wins.skills).toMatchObject({ x: 0, y: 0, w: 1000, h: 700, maximized: true });
    s = wmReducer(s, { type: "toggleMax", id: "skills" });
    expect(s.wins.skills).toMatchObject({ ...before, maximized: false });
  });
});

describe("workspace resize", () => {
  it("re-fits windows when the workspace shrinks", () => {
    let s = wmReducer(initialState(), { type: "bounds", w: 1400, h: 900 });
    s = wmReducer(s, { type: "open", id: "projects" });
    s = wmReducer(s, { type: "move", id: "projects", x: 650, y: 350 });
    s = wmReducer(s, { type: "bounds", w: 800, h: 500 });
    const w = s.wins.projects;
    expect(w.x + w.w).toBeLessThanOrEqual(800);
    expect(w.y + w.h).toBeLessThanOrEqual(500);
  });
});
