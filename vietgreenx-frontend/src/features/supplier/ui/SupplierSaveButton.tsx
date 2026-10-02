"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck, Loader2, UserMinus } from "lucide-react";

import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";

import { useSavedSuppliers, useSaveSupplier, useUnsaveSupplier } from "../api/supplier.queries";
import { getSupplierCopy } from "../supplier.constants";

interface SupplierSaveButtonProps {
  supplierId: string;
  isSaved?: boolean;
  locale?: AppLocale;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function SupplierSaveButton({
  supplierId,
  isSaved: initialIsSaved,
  locale = getClientLocale(),
  variant = "outline",
  size = "sm",
  className,
}: SupplierSaveButtonProps) {
  const t = getSupplierCopy(locale).actions;
  const [isHovered, setIsHovered] = useState(false);

  // Auto-check saved state if initialIsSaved is not explicitly provided
  const { data: savedData } = useSavedSuppliers(1, 100);
  const isAutoSaved = Boolean(
    savedData?.data?.some((item) => item.supplier?.id === supplierId || item.id === supplierId),
  );

  const effectiveIsSaved = initialIsSaved ?? isAutoSaved;

  const saveMutation = useSaveSupplier(locale);
  const unsaveMutation = useUnsaveSupplier(locale);

  const isPending = saveMutation.isPending || unsaveMutation.isPending;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPending) return;

    if (effectiveIsSaved) {
      unsaveMutation.mutate(supplierId);
    } else {
      saveMutation.mutate(supplierId);
    }
  };

  return (
    <Button
      type="button"
      variant={effectiveIsSaved ? "default" : variant}
      size={size}
      disabled={isPending}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "gap-1.5 font-semibold transition-all",
        effectiveIsSaved
          ? "border border-emerald-600 bg-emerald-600 font-bold text-white shadow-sm hover:border-red-600 hover:bg-red-600"
          : "",
        className,
      )}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : effectiveIsSaved ? (
        isHovered ? (
          <UserMinus className="size-4" />
        ) : (
          <BookmarkCheck className="size-4" />
        )
      ) : (
        <Bookmark className="size-4" />
      )}
      {size !== "icon" && (effectiveIsSaved ? (isHovered ? t.unsave : t.saved) : t.save)}
    </Button>
  );
}
