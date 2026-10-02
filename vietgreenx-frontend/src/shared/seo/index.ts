// src/shared/seo/index.ts — public API module SEO.
export { siteConfig, absoluteUrl } from "./site";
export { defaultMetadata, buildMetadata } from "./metadata";
export { JsonLd } from "./JsonLd";
export {
  buildOrganizationSchema,
  buildProductSchema,
  buildBreadcrumbSchema,
  buildWebsiteSchema,
} from "./schema";
export type { OrgSeoInput, ProductSeoInput, BreadcrumbItem } from "./schema";
