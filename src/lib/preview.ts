/**
 * Build-time flags (inlined by Next.js, safe on client and server).
 * Set only by the GitHub Pages workflow; normal deployments leave them unset.
 */
export const staticPreview = process.env.NEXT_PUBLIC_STATIC_PREVIEW === "true";
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const previewBuildId = process.env.NEXT_PUBLIC_BUILD_ID?.trim() || "not configured";
export const previewVersion = process.env.NEXT_PUBLIC_APP_VERSION?.trim() || "not configured";

/** Prefix root-relative asset URLs with the deployment base path (plain <img>/<a download> do not get it automatically). */
export function withBase(path: string): string {
  return path.startsWith("/") ? `${basePath}${path}` : path;
}
