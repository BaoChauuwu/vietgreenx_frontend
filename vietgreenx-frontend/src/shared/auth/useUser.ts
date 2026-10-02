"use client";

import { useAuthContext } from "./auth-context";
import { can as canFn, hasRole as hasRoleFn, type Permission, type UserRole } from "./roles";

export function useUser() {
  const { user, status, refresh, logout } = useAuthContext();

  return {
    user,
    role: user?.role,
    status,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    can: (permission: Permission) => canFn(user?.role, permission),
    hasRole: (allowed: UserRole[]) => hasRoleFn(user?.role, allowed),
    refresh,
    logout,
  };
}
