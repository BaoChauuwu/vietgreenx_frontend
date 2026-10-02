import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/shared/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ---- Trang tĩnh ----
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/legal"), changeFrequency: "yearly", priority: 0.3 },
  ];

  const orgs: MetadataRoute.Sitemap = [];
  // const orgs = (await fetchOrgSlugs()).map((o) => ({
  //   url: absoluteUrl(`/org/${o.id}`),
  //   lastModified: o.updatedAt,
  //   changeFrequency: "weekly" as const,
  //   priority: 0.8,
  // }));

  const products: MetadataRoute.Sitemap = [];
  // const products = (await fetchProductSlugs()).map((p) => ({
  //   url: absoluteUrl(`/product/${p.id}`),
  //   lastModified: p.updatedAt,
  //   changeFrequency: "weekly" as const,
  //   priority: 0.7,
  // }));

  return [...staticRoutes, ...orgs, ...products];
}
