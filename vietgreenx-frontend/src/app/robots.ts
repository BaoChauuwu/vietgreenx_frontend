import type { MetadataRoute } from "next";

import { siteConfig } from "@/shared/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/profile",
          "/org/members",
          "/admin",
          "/onboarding",
          "/login",
          "/register",
          "/otp",
          "/api/",
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
