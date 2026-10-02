"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";

import { AuthContext, type AuthProviderProps } from "@/shared/auth/auth-context";
import { hydrateMyProfileCache } from "../lib/hydrate-profile-cache";
import type { AuthState } from "@/shared/auth/auth.types";
import { clearAuthSession, hasAuthSession } from "@/shared/auth/token-storage";

import { sessionService } from "../api/session.service";

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<AuthState>({ user: null, status: "loading" });

  const refresh = useCallback(async (preloadedUser?: import("@/shared/auth/auth.types").AuthUser) => {
    if (preloadedUser) {
      setState({ user: preloadedUser, status: "authenticated" });
      return;
    }

    if (!hasAuthSession()) {
      // Drop orphan access_token cookie — middleware treats it as logged-in
      // even when localStorage session is gone, which blocks /register and /login.
      clearAuthSession();
      setState({ user: null, status: "unauthenticated" });
      return;
    }

    try {
      const { user, profile } = await sessionService.me();
      if (profile) hydrateMyProfileCache(queryClient, profile);
      setState({ user, status: "authenticated" });
    } catch {
      clearAuthSession();
      setState({ user: null, status: "unauthenticated" });
    }
  }, [queryClient]);

  const logout = useCallback(async () => {
    try {
      await sessionService.logout();
    } finally {
      setState({ user: null, status: "unauthenticated" });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ ...state, refresh, logout }),
    [state, refresh, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
