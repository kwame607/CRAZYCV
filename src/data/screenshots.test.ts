import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { projects } from "./projects";

describe("project screenshots", () => {
  it("every supplied screenshot file exists and has meaningful alt text", () => {
    for (const p of projects)
      for (const s of p.screenshots) {
        if (!s.src) continue;
        expect(existsSync(join(process.cwd(), "public", s.src)), `${p.slug}: ${s.src}`).toBe(true);
        expect(s.alt.length).toBeGreaterThan(20);
      }
  });
});
