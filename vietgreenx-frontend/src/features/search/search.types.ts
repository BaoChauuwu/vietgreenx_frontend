export type SearchResultKind = "user" | "org" | "product" | "post";

export type SearchTab = "all" | SearchResultKind;

export interface SearchResultItem {
  id: string;
  kind: SearchResultKind;
  title: string;
  subtitle?: string;
  href: string;
}
