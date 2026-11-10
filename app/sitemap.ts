import type { MetadataRoute } from "next";
import { getCafes } from "@/lib/cafes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cafes = await getCafes();
  const baseUrl = "https://brewscout.vercel.app";
  const buildDate = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: buildDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: buildDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const cafeRoutes: MetadataRoute.Sitemap = cafes.map((cafe) => ({
    url: `${baseUrl}/cafe/${cafe.slug}`,
    lastModified: buildDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...cafeRoutes];
}
