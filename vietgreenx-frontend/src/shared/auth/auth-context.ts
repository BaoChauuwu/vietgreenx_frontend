"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { AuthState, AuthUser } from "./auth.types";

export interface AuthContextValue extends AuthState {
  refresh: (preloadedUser?: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext phải nằm trong <AuthProvider>");
  return ctx;
}

export type AuthProviderProps = { children: ReactNode };
