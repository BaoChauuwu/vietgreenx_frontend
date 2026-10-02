"use client";

import { Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { ProfileResponse } from "@/entities/user";
import { getInitials } from "@/entities/user";
import type { UserRole } from "@/shared/auth";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import { cn } from "@/shared/lib/cn";
import { ROUTES } from "@/shared/routing";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { ElevatedCard } from "@/shared/ui/elevated-card";

import { getProfileCopy } from "../profile.constants";

interface ProfileHeaderProps {
  profile: ProfileResponse;
  displayName: string;
  role?: UserRole;
  locale?: AppLocale;
}

export function ProfileHeader({
  profile,
  displayName,
  role,
  locale = getClientLocale(),
}: ProfileHeaderProps) {
  const { screen: copy, view: viewCopy } = getProfileCopy(locale);
  const roleLabel = role ? viewCopy.roles[role] : undefined;
  const avatarSrc = resolveMediaUrl(profile.avatarUrl);
  const coverSrc = resolveMediaUrl(profile.coverUrl);

  const stats = [
    { label: copy.statPosts, value: profile.postCount ?? 0 },
    { label: copy.statFollowers, value: profile.followerCount ?? 0 },
    { label: copy.statFollowing, value: profile.followingCount ?? 0 },
  ];

  return (
    <ElevatedCard data-tour="tour-profile-header" className="overflow-hidden">
      {coverSrc ? (
        <div className="relative h-32 md:h-36">
          <Image src={coverSrc} alt="" fill className="object-cover" priority sizes="1120px" />
          <div
            className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent"
            aria-hidden
          />
        </div>
      ) : null}

      <div
        className={cn(
          "flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:justify-between md:p-5",
          coverSrc && "relative -mt-10 pt-0",
        )}
      >
        <div className="flex min-w-0 gap-4">
          <Avatar
            className={cn(
              "size-20 shrink-0 border-4 border-card sm:size-24",
              coverSrc && "ring-2 ring-border",
            )}
          >
            {avatarSrc && <AvatarImage src={avatarSrc} alt={displayName} />}
            <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 space-y-1.5 pt-1 sm:pt-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h1 className="text-xl font-semibold leading-tight tracking-tight text-foreground sm:text-2xl">
                {displayName}
              </h1>
              {roleLabel && (
                <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {roleLabel}
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              {stats.map((stat, index) => (
                <span key={stat.label}>
                  {index > 0 && <span className="mx-1.5 text-border">·</span>}
                  <span className="font-semibold tabular-nums text-foreground">{stat.value}</span>{" "}
                  {stat.label}
                </span>
              ))}
            </p>
          </div>
        </div>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-fit shrink-0 border-primary/25 text-primary hover:bg-primary/5"
        >
          <Link href={ROUTES.profileEdit}>
            <Pencil className="mr-1.5 size-4" />
            {viewCopy.edit}
          </Link>
        </Button>
      </div>

      <nav className="border-t border-border/60 px-4 md:px-5" aria-label={copy.postsTab}>
        <span className="-mb-px inline-block border-b-[3px] border-primary pb-2.5 pt-2 text-sm font-semibold text-primary">
          {copy.postsTab}
        </span>
      </nav>
    </ElevatedCard>
  );
}
