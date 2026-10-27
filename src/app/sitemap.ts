import type { MetadataRoute } from "next";
import { links } from "@/content/links";
import { projects } from "@/content/projects";

const pages = ["", "/about", "/projects", "/certifications", "/now", "/principles", "/uses"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...pages.map((path) => ({
      url: `${links.siteUrl}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...projects.map((p) => ({
      url: `${links.siteUrl}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
