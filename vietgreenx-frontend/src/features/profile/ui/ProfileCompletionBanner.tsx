"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useUser } from "@/shared/auth";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { ROUTES } from "@/shared/routing";

import { useMyProfile } from "../api/profile.queries";
import {
  resolveProfileBannerType,
  shouldShowProfileBanner,
  type ProfileBannerType,
} from "../lib/profile-completion";
import { getProfileCopy } from "../profile.constants";

function useDismissedBanner(userId: string, type: ProfileBannerType) {
  const storageKey = `vgx_banner_${userId}_${type}`;
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setDismissed(localStorage.getItem(storageKey) === "true");
  }, [storageKey]);

  const dismiss = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, "true");
    }
    setDismissed(true);
  };

  return { dismissed, dismiss };
}

interface ProfileCompletionBannerProps {
  locale?: AppLocale;
  className?: string;
  /** Profile sidebar — single-line strip */
  compact?: boolean;
  /** Block layout with CTA — shell chrome applied by widget on feed */
  variant?: "inline" | "card";
}

export function ProfileCompletionBanner({
  locale = getClientLocale(),
  className,
  compact = false,
  variant = "inline",
}: ProfileCompletionBannerProps) {
  const copy = getProfileCopy(locale).banner;
  const { user } = useUser();
  const { data: profile } = useMyProfile();

  const bannerType = user ? resolveProfileBannerType(user.role, user.orgId) : null;

  const config = useMemo(() => {
    if (!bannerType) return null;

    switch (bannerType) {
      case "green-profile":
        return {
          type: bannerType,
          title: copy.greenProfile.title,
          description: copy.greenProfile.description,
          cta: copy.greenProfile.cta,
          href: ROUTES.greenProfileCreate,
        };
      case "org-setup":
        return {
          type: bannerType,
          title: copy.orgSetup.title,
          description: copy.orgSetup.description,
          cta: copy.orgSetup.cta,
          href: ROUTES.orgEdit,
        };
      case "profile-completion":
        return {
          type: bannerType,
          title: copy.profileCompletion.title,
          description: copy.profileCompletion.description,
          cta: copy.profileCompletion.cta,
          href: ROUTES.profileEdit,
        };
    }
  }, [bannerType, copy]);

  const { dismissed, dismiss } = useDismissedBanner(user?.id ?? "", config?.type ?? "profile-completion");

  if (!user || !config) return null;
  if (dismissed) return null;
  if (!shouldShowProfileBanner(user.role, user.orgId, profile)) return null;

  const isCard = variant === "card" && !compact;
  const isStrip = compact || variant === "inline";

  return (
    <div
      role="status"
      aria-label={config.title}
      data-tour="tour-profile-banner"
      className={cn(
        isStrip && "relative border-l-2 border-primary py-1 pl-3 pr-7",
        isCard && "text-sm",
        className,
      )}
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label={copy.dismiss}
        className={cn(
          "absolute p-1 text-muted-foreground hover:text-foreground",
          isCard ? "right-3 top-3" : "right-0 top-0",
        )}
      >
        <X className="size-3.5" />
      </button>
      <p
        className={cn(
          "text-sm leading-relaxed",
          isCard ? "text-foreground/85" : "text-muted-foreground",
        )}
      >
        <span className={cn(isCard ? "font-semibold" : "font-medium", "text-foreground")}>
          {config.title}
        </span>
        {isCard ? (
          <>
            <span className="mt-1 block text-sm">{config.description}</span>
            <Link
              href={config.href}
              className="mt-3 inline-flex rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              {config.cta}
            </Link>
          </>
        ) : (
          <>
            {" — "}
            {config.description}{" "}
            <Link href={config.href} className="font-medium text-primary hover:underline">
              {config.cta}
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
