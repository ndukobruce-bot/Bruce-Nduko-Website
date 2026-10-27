import type { MetadataRoute } from "next";
import { links } from "@/content/links";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${links.siteUrl}/sitemap.xml`,
    host: links.siteUrl,
  };
}
