/**
 * Small browser-side helpers shared by the nav, the intro and the terminal.
 * Every function is a no-op on the server.
 */
import { withBase } from "@/lib/preview";
import { profile } from "@/data/profile";

export type SectionId = "hero" | "work" | "about" | "skills" | "security" | "terminal" | "system" | "journey" | "contact";

export const sectionIds: readonly SectionId[] = ["hero", "security", "work", "about", "skills", "terminal", "system", "journey", "contact"];

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Scroll a section into view, then move focus there so keyboard and screen-reader users follow. */
export function scrollToSection(id: SectionId): void {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

/** Jump past the intro immediately. */
export function skipIntro(): void {
  const hero = document.getElementById("hero");
  if (!hero) return;
  window.scrollTo({ top: hero.getBoundingClientRect().top + window.scrollY, behavior: "instant" });
  hero.setAttribute("tabindex", "-1");
  hero.focus({ preventScroll: true });
}

/** Bring the intro back (returning visitors have it collapsed) and start from the top. */
export function replayIntro(): void {
  const root = document.documentElement;
  delete root.dataset.intro;
  root.dataset.phase = prefersReducedMotion() ? "site" : "intro";
  window.scrollTo({ top: 0, behavior: "instant" });
  window.dispatchEvent(new Event("ka:replay"));
}

/** Start a real download of the CV PDF shipped in /public. */
export function downloadCv(): void {
  const a = document.createElement("a");
  a.href = withBase(profile.cvPdfPath);
  a.download = "Kwame-Emmanuel-Adom-CV.pdf";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
