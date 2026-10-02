"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { cn } from "@/shared/lib/cn";
import type { AppLocale } from "@/shared/i18n/locale";
import { localeService } from "@/shared/api/locale.service";

interface LanguageSwitcherProps {
  locale: AppLocale;
  className?: string;
  label?: string;
}

export function LanguageSwitcher({ locale, className, label }: LanguageSwitcherProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const changeLocale = (nextLocale: AppLocale) => {
    startTransition(async () => {
      await localeService.setLocale(nextLocale);
      router.refresh();
    });
  };

  return (
    <div className={cn("flex items-center gap-2 text-xs", className)}>
      {label && <span className="text-muted-foreground">{label}</span>}
      <button
        type="button"
        disabled={isPending}
        className={cn(
          "transition-colors hover:text-foreground",
          locale === "vi" ? "font-semibold text-foreground" : "text-muted-foreground",
        )}
        onClick={() => changeLocale("vi")}
      >
        VI
      </button>
      <span className="text-muted-foreground">·</span>
      <button
        type="button"
        disabled={isPending}
        className={cn(
          "transition-colors hover:text-foreground",
          locale === "en" ? "font-semibold text-foreground" : "text-muted-foreground",
        )}
        onClick={() => changeLocale("en")}
      >
        EN
      </button>
    </div>
  );
}
