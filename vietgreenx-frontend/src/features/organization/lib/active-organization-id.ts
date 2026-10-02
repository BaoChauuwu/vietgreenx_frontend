const ACTIVE_ORG_STORAGE_KEY = "vgx_active_org_id";

export function getStoredActiveOrganizationId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACTIVE_ORG_STORAGE_KEY);
}

export function setStoredActiveOrganizationId(orgId: string | null): void {
  if (typeof window === "undefined") return;
  if (!orgId) {
    window.localStorage.removeItem(ACTIVE_ORG_STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(ACTIVE_ORG_STORAGE_KEY, orgId);
}
