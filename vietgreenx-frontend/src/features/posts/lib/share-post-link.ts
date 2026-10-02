import { ROUTES } from "@/shared/routing";

export function buildPostShareUrl(postId: string): string {
  if (typeof window === "undefined") {
    return ROUTES.post(postId);
  }
  return new URL(ROUTES.post(postId), window.location.origin).toString();
}

export async function copyPostLink(postId: string): Promise<boolean> {
  const url = buildPostShareUrl(postId);
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}

export async function sharePostLink(postId: string, title: string): Promise<"shared" | "copied" | "failed"> {
  const url = buildPostShareUrl(postId);
  if (typeof navigator.share === "function") {
    try {
      await navigator.share({ url, title });
      return "shared";
    } catch {
      // User dismissed or unsupported payload — fall through to clipboard.
    }
  }
  return (await copyPostLink(postId)) ? "copied" : "failed";
}
