import { forwardRef, type ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

import { Card } from "./card";
import { VGX_ELEVATED_SURFACE } from "./page-layout";

const ElevatedCard = forwardRef<HTMLDivElement, ComponentProps<typeof Card>>(
  ({ className, ...props }, ref) => (
    <Card ref={ref} className={cn(VGX_ELEVATED_SURFACE, className)} {...props} />
  ),
);
ElevatedCard.displayName = "ElevatedCard";

export { ElevatedCard };
