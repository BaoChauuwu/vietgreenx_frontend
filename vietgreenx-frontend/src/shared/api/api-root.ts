import { env } from "@/shared/config/env.mjs";

export function getApiRoot(): string {
  return env.NEXT_PUBLIC_API_URL.replace(/\/app\/?$/, "");
}
