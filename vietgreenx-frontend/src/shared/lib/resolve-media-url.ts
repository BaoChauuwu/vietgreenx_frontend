import { getApiRoot } from "@/shared/api/api-root";

/** Resolve BE media paths (e.g. `/uploads/...`) to absolute URLs. */
export function resolveMediaUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (!url.includes("/") && !url.includes(".")) return undefined;

  const apiRoot = getApiRoot();
  const origin = apiRoot.replace(/\/api\/?$/, "");
  return `${origin}${url.startsWith("/") ? url : `/${url}`}`;
}
