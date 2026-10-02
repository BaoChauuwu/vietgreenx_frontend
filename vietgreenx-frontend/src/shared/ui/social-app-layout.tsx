"use client";

import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import {
  SOCIAL_APP_SHELL_MAX,
  VGX_CONTENT_COLUMN,
  getSocialAppGrid,
  type SocialAppVariant,
} from "@/shared/ui/page-layout";

interface SocialAppLayoutProps {
  variant: SocialAppVariant;
  children: ReactNode;
  rightRail?: ReactNode;
  /** Rendered below center column on mobile (e.g. feed aside). */
  mobileBelowCenter?: ReactNode;
  className?: string;
  centerClassName?: string;
}

export function SocialAppLayout({
  variant,
  children,
  rightRail,
  mobileBelowCenter,
  className,
  centerClassName,
}: SocialAppLayoutProps) {
  const hasRightRail = variant !== "focused" && Boolean(rightRail);

  return (
    <div
      className={cn(
        VGX_CONTENT_COLUMN,
        "mx-auto w-full px-3 py-4 sm:px-4 md:py-5",
        SOCIAL_APP_SHELL_MAX[variant],
        className,
      )}
    >
      <div
        className={cn("grid grid-cols-1 gap-3 lg:gap-3.5", getSocialAppGrid(variant, hasRightRail))}
      >
        <div className={cn("min-w-0 space-y-3", centerClassName)}>
          {children}
          {mobileBelowCenter ? (
            <div className="space-y-3 border-t border-border/60 pt-3 lg:hidden">
              {mobileBelowCenter}
            </div>
          ) : null}
        </div>

        {hasRightRail ? (
          <aside className="hidden min-w-0 lg:block">
            <div className="space-y-3 lg:sticky lg:top-[80px]">{rightRail}</div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
