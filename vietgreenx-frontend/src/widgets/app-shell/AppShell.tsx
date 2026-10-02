"use client";

import { usePathname } from "next/navigation";
import { ProductTourProvider } from "@/features/onboarding";
import type { ReactNode } from "react";

import { ROUTES } from "@/shared/routing";
import { cn } from "@/shared/lib/cn";
import { AppTopNav } from "./AppTopNav";
import { AppShellBody } from "./AppShellBody";
import { AppBottomNav } from "./AppBottomNav";
import { ChatOverlay } from "./ChatOverlay";

interface AppShellProps {
  children: ReactNode;
}

function isImmersiveRoute(pathname: string) {
  return pathname === ROUTES.chat || pathname.startsWith(`${ROUTES.chat}/`);
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const immersive = isImmersiveRoute(pathname);

  return (
    <div
      className={cn(
        "flex flex-col bg-background",
        immersive ? "h-screen overflow-hidden" : "min-h-[100dvh]",
      )}
    >
      {/* ── Top navigation (full-width) ──────────────────────────────────────── */}
      <AppTopNav />

      {/* ── Body: Social canvas main (left rail per-page via SocialAppLayout) ─── */}
      <AppShellBody>{children}</AppShellBody>

      {/* ── Mobile bottom navigation (fixed) ────────────────────────────────── */}
      <AppBottomNav />

      <ChatOverlay />

      <ProductTourProvider />
    </div>
  );
}
