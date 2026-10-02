import { env } from "@/shared/config/env.mjs";

export function resolveBackendUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;

  const apiRoot = env.NEXT_PUBLIC_API_URL.replace(/\/app\/?$/, "");
  const origin = apiRoot.replace(/\/api\/?$/, "");
  return `${origin}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}
