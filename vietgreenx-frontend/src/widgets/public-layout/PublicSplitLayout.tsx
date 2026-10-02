import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import { AuthStoryPanel } from "./AuthStoryPanel";

interface PublicSplitLayoutProps {
  children: ReactNode;
  /** @deprecated locale no longer needed */
  locale?: string;
}

/**
 * 3-breakpoint auth layout:
 *  mobile  — image banner top (~260px), white form stacked below
 *  tablet  — full-screen bg image, card centered overlay
 *  desktop — full-screen bg image, frosted right overlay, card on right
 */
export function PublicSplitLayout({ children }: PublicSplitLayoutProps) {
  return (
    <div className="relative flex min-h-[100dvh] flex-col md:block md:h-[100dvh]">
      {/* Background image — mobile: in-flow banner; md+: absolute full-screen */}
      <AuthStoryPanel />

      {/* Desktop: frosted white overlay on right ~45% so form is readable */}
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-[1] hidden w-[45%] xl:block" />

      {/* Form panel — scrollable at all breakpoints, content centered via my-auto */}
      <div
        className={cn(
          // mobile: in-flow, white bg, scrolls with page
          "relative z-10 flex flex-1 flex-col items-center bg-white px-5",
          // tablet+: absolute overlay, own scroll context, centered
          "md:absolute md:inset-0 md:items-center md:overflow-y-auto md:bg-transparent md:px-6",
          // desktop: right panel only
          "xl:left-auto xl:w-[45%] xl:px-10",
        )}
      >
        {/* my-auto = centers when content fits; collapses when content overflows so scroll works */}
        <div className="my-auto w-full max-w-[580px] py-10">{children}</div>
      </div>
    </div>
  );
}
