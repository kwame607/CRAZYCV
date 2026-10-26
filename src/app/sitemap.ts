import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/projects", "/skills", "/security-lab", "/network-tools", "/about", "/cv", "/contact"];
  return [
    ...pages.map((p) => ({ url: `${siteUrl}${p}` })),
    ...projects.map((p) => ({ url: `${siteUrl}/projects/${p.slug}` })),
  ];
}
