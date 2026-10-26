import "server-only";
import pkg from "../../../package.json";
import type { ServerInfo } from "@/types/browser-info";

function pick(...values: (string | undefined)[]): string | null {
  for (const v of values) {
    const t = v?.trim();
    if (t) return t;
  }
  return null;
}

/**
 * Public, intentionally exposed release information. Everything here comes
 * from explicit configuration. No env dump, paths, secrets or host details.
 */
export function getBuildInfo(): ServerInfo {
  const build = pick(
    process.env.BUILD_ID,
    process.env.VERCEL_GIT_COMMIT_SHA,
    process.env.CF_PAGES_COMMIT_SHA,
    process.env.GITHUB_SHA,
  );
  return {
    app: "adom-os",
    version: pick(process.env.APP_VERSION) ?? pkg.version,
    build: build ? build.slice(0, 12) : "not configured",
    environment: pick(process.env.DEPLOY_ENV) ?? (process.env.NODE_ENV === "production" ? "production" : "development"),
    health: "ok",
    time: new Date().toISOString(),
  };
}
