"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useUser } from "@/shared/auth";
import {
  ROUTES,
  isEmailVerifyCompletionPage,
  isGuestAuthPage,
} from "@/shared/routing";

interface AuthGuestGuardProps {
  children: ReactNode;
}

/** Redirect authenticated users away from login/register — client-side only. */
export function AuthGuestGuard({ children }: AuthGuestGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { status, isAuthenticated } = useUser();

  useEffect(() => {
    if (status === "loading") return;
    if (!isAuthenticated) return;
    if (!isGuestAuthPage(pathname) || isEmailVerifyCompletionPage(pathname)) return;
    router.replace(ROUTES.feed);
  }, [status, isAuthenticated, pathname, router]);

  return <>{children}</>;
}
