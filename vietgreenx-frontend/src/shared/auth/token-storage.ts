import { ACCESS_COOKIE } from "@/shared/routing";

import type { AuthTokenPayload } from "./auth-token.schema";

const ACCESS_KEY = "vgx_access_token";
const REFRESH_KEY = "vgx_refresh_token";
const USER_ID_KEY = "vgx_user_id";
const ROLE_KEY = "vgx_user_role";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function setSessionCookie(accessToken: string, maxAgeMs: number): void {
  if (!isBrowser()) return;
  const maxAgeSec = Math.max(1, Math.floor(maxAgeMs / 1000));
  document.cookie = `${ACCESS_COOKIE}=${encodeURIComponent(accessToken)}; path=/; max-age=${maxAgeSec}; SameSite=Lax`;
}

function clearSessionCookie(): void {
  if (!isBrowser()) return;
  document.cookie = `${ACCESS_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function persistAuthSession(tokens: AuthTokenPayload): void {
  if (!isBrowser()) return;

  localStorage.setItem(ACCESS_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
  localStorage.setItem(USER_ID_KEY, tokens.userId);
  localStorage.setItem(ROLE_KEY, tokens.role);
  setSessionCookie(tokens.accessToken, tokens.accessTokenExpires);
}

export function clearAuthSession(): void {
  if (!isBrowser()) return;

  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(ROLE_KEY);
  clearSessionCookie();
}

export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function getStoredUserId(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(USER_ID_KEY);
}

export function getStoredRole(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(ROLE_KEY);
}

export function hasAuthSession(): boolean {
  return Boolean(getAccessToken() && getStoredUserId());
}
