"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { ROUTES } from "@/shared/routing";

import { hasRole, type UserRole } from "./roles";
import { useUser } from "./useUser";

interface AuthWrapperProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  fallback?: ReactNode;
}

export function AuthWrapper({ children, requiredRoles, fallback = null }: AuthWrapperProps) {
  const router = useRouter();
  const { user, status } = useUser();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace(ROUTES.login);
      return;
    }

    if (requiredRoles && !hasRole(user?.role, requiredRoles)) {
      router.replace(ROUTES.forbidden);
    }
  }, [status, user, requiredRoles, router]);

  if (status !== "authenticated") return <>{fallback}</>;
  if (requiredRoles && !hasRole(user?.role, requiredRoles)) return <>{fallback}</>;

  return <>{children}</>;
}
