"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import { ROUTES } from "@/shared/routing";
import { AppSideNav } from "./AppSideNav";

interface AppShellBodyProps {
  children: ReactNode;
}

/** Chat is immersive — no social canvas grid in main (chat layout owns full height). */
function isImmersiveRoute(pathname: string) {
  return pathname === ROUTES.chat || pathname.startsWith(`${ROUTES.chat}/`);
}

export function AppShellBody({ children }: AppShellBodyProps) {
  const pathname = usePathname();
  const immersive = isImmersiveRoute(pathname);

  return (
    <div className={cn("flex flex-1", immersive && "h-[calc(100vh-4rem)] overflow-hidden")}>
      {!immersive && <AppSideNav />}
      <main
        id="main-content"
        className={
          immersive
            ? "h-full min-w-0 flex-1 overflow-hidden pb-16 md:pb-0"
            : "vgx-social-canvas min-w-0 flex-1 pb-16 md:pb-0"
        }
      >
        {children}
      </main>
    </div>
  );
}
