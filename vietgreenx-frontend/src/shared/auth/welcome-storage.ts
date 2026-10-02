/** Product tour completion — persisted per user in localStorage (`vgx_welcome_seen_{userId}`). */
const WELCOME_KEY_PREFIX = "vgx_welcome_seen_";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function hasSeenWelcome(userId: string): boolean {
  if (!isBrowser()) return false;
  return localStorage.getItem(`${WELCOME_KEY_PREFIX}${userId}`) === "1";
}

export function markWelcomeSeen(userId: string): void {
  if (!isBrowser()) return;
  localStorage.setItem(`${WELCOME_KEY_PREFIX}${userId}`, "1");
}
