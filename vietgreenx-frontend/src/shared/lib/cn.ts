// src/shared/lib/cn.ts
// -----------------------------------------------------------------------------
// The single source of truth for merging className strings.
// `clsx`           -> conditionally joins classes ("a", cond && "b").
// `tailwind-merge` -> resolves Tailwind conflicts ("px-2 px-4" => "px-4").
// Used by every UI component and shadcn/ui.
// -----------------------------------------------------------------------------
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
