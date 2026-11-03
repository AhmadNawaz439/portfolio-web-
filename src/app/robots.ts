import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Tells Google it may list the portfolio, but not the private dashboard.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
