export type MarketplaceListingKind = "sell" | "buy";

export type MarketplaceTab = "all" | MarketplaceListingKind;

export interface MarketplaceListing {
  id: string;
  kind: MarketplaceListingKind;
  title: string;
  productName: string;
  quantity: number;
  unit: string;
  provinceCode: string;
  priceLabel?: string;
  certifications?: string[];
  orgName: string;
  orgVerified?: boolean;
  postedAt: string;
  deadline?: string;
  description?: string;
}
