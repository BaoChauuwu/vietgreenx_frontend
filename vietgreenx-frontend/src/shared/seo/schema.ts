// src/shared/seo/schema.ts
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
import type { BreadcrumbList, Organization, Product, WithContext } from "schema-dts";

import { absoluteUrl, siteConfig } from "./site";

export interface OrgSeoInput {
  id: string;
  name: string;
  bio?: string;
  logoUrl?: string;
  websiteUrl?: string;
  phone?: string;
  address?: { street?: string; city?: string; region?: string; country?: string };
}

export interface ProductSeoInput {
  id: string;
  name: string;
  description?: string;
  imageUrls?: string[];
  price: number;
  currency?: string; // mặc định VND
  inStock: boolean;
  brandName?: string;
  certification?: string; // vd "VietGAP", "Organic"
}

export interface BreadcrumbItem {
  name: string;
  path: string; // tương đối, vd "/org/abc"
}

// ---- Organization ----
export function buildOrganizationSchema(org: OrgSeoInput): WithContext<Organization> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl(`/org/${org.id}`),
    name: org.name,
    description: org.bio,
    url: org.websiteUrl ?? absoluteUrl(`/org/${org.id}`),
    logo: org.logoUrl,
    telephone: org.phone,
    address: org.address
      ? {
          "@type": "PostalAddress",
          streetAddress: org.address.street,
          addressLocality: org.address.city,
          addressRegion: org.address.region,
          addressCountry: org.address.country ?? "VN",
        }
      : undefined,
  };
}

export function buildProductSchema(p: ProductSeoInput): WithContext<Product> {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: p.imageUrls,
    brand: p.brandName ? { "@type": "Brand", name: p.brandName } : undefined,
    additionalProperty: p.certification
      ? [{ "@type": "PropertyValue", name: "Chứng nhận", value: p.certification }]
      : undefined,
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: p.currency ?? "VND",
      availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: absoluteUrl(`/product/${p.id}`),
    },
  };
}

// ---- BreadcrumbList ----
export function buildBreadcrumbSchema(items: BreadcrumbItem[]): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildWebsiteSchema(): WithContext<Organization> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/logo.png"),
  };
}
