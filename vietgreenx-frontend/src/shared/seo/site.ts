import { env } from "@/shared/config/env.mjs";

export const siteConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  url: env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, ""),
  description:
    "VietGreenX — Green Agriculture Platform: Connect cooperatives, enterprises and consumers, trace origin by QR.",
  locale: "vi_VN",
  defaultOgImage: "/og/default.png",
  twitter: "@vietgreenx",
} as const;

export function absoluteUrl(path = ""): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
