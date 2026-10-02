import type { Metadata } from "next";

import { absoluteUrl, siteConfig } from "./site";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Green Agriculture Platform`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    url: siteConfig.url,
    images: [{ url: siteConfig.defaultOgImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

interface BuildMetadataArgs {
  title: string;
  description?: string;
  path: string;
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article" | "profile";
}

export function buildMetadata({
  title,
  description,
  path,
  image,
  noIndex,
  type = "website",
}: BuildMetadataArgs): Metadata {
  const canonical = absoluteUrl(path);
  const ogImage = image ?? siteConfig.defaultOgImage;

  return {
    title,
    description: description ?? siteConfig.description,
    alternates: { canonical },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      url: canonical,
      title,
      description: description ?? siteConfig.description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description ?? siteConfig.description,
      images: [ogImage],
    },
  };
}
