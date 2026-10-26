import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";
import { profile } from "@/data/profile";

/** True only when a real CV PDF has been placed in /public. Prevents a fake download button. */
export function cvPdfAvailable(): boolean {
  try {
    // Path comes from our own config, never from visitor input.
    return existsSync(path.join(process.cwd(), "public", profile.cvPdfPath));
  } catch {
    return false;
  }
}
