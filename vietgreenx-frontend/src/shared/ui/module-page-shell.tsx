import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import { moduleWidthToVariant, type ModulePageWidth } from "@/shared/ui/page-layout";

import { SocialAppLayout } from "./social-app-layout";

interface ModulePageShellProps {
  children: ReactNode;
  width?: ModulePageWidth;
  className?: string;
  contentClassName?: string;
  rightRail?: ReactNode;
  mobileBelowCenter?: ReactNode;
}

export function ModulePageShell({
  children,
  width = "work",
  className,
  contentClassName,
  rightRail,
  mobileBelowCenter,
}: ModulePageShellProps) {
  return (
    <SocialAppLayout
      variant={moduleWidthToVariant(width)}
      className={className}
      centerClassName={cn("min-w-0", contentClassName)}
      rightRail={rightRail}
      mobileBelowCenter={mobileBelowCenter ?? rightRail}
    >
      {children}
    </SocialAppLayout>
  );
}
