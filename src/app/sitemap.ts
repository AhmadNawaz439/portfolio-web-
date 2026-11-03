import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// The list of public pages Google should index.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE_URL, changeFrequency: "monthly", priority: 1 }];
}
