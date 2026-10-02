"use client";

import Link from "next/link";
import { ChevronDown, Crown, Loader2, LogOut, Settings, User, UserPen } from "lucide-react";

import { useLogout } from "@/features/auth";
import { resolveMediaUrl } from "@/shared/lib/resolve-media-url";
import { useMyProfile } from "@/features/profile";
import { getInitials } from "@/entities/user";
import { useUser, ROLE_DISPLAY_VI } from "@/shared/auth";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { ROUTES } from "@/shared/routing";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

import { getShellCopy } from "@/shared/i18n/shell.copy";

interface UserAccountMenuProps {
  locale?: AppLocale;
}

export function UserAccountMenu({ locale = getClientLocale() }: UserAccountMenuProps) {
  const copy = getShellCopy(locale).userMenu;
  const { user } = useUser();
  const { data: profile } = useMyProfile();
  const { mutate: logout, isPending } = useLogout();

  if (!user) return null;

  const displayName = profile?.displayName ?? user.fullName;
  const avatarSrc = resolveMediaUrl(profile?.avatarUrl);
  const roleLabel = ROLE_DISPLAY_VI[user.role];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="ml-1 h-9 gap-2 rounded-full px-2 text-white hover:bg-white/10 hover:text-white"
          aria-label={copy.ariaLabel}
        >
          <Avatar className="size-7 ring-2 ring-transparent transition-all hover:ring-white/30">
            {avatarSrc && <AvatarImage src={avatarSrc} alt={displayName} />}
            <AvatarFallback className="bg-white/20 text-xs font-medium text-white">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden max-w-[120px] text-left sm:block">
            <p className="truncate text-[13px] font-medium leading-tight text-white">
              {displayName}
            </p>
            {roleLabel && (
              <p className="truncate text-[11px] leading-tight text-white/60">{roleLabel}</p>
            )}
          </div>
          <ChevronDown className="hidden size-3.5 text-white/60 sm:block" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="truncate text-sm font-medium leading-none">{displayName}</p>
            {user.email && <p className="truncate text-xs text-muted-foreground">{user.email}</p>}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={ROUTES.profile} className="cursor-pointer">
            <User className="mr-2 size-4" />
            {copy.profile}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={ROUTES.profileEdit} className="cursor-pointer">
            <UserPen className="mr-2 size-4" />
            {copy.editProfile}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={ROUTES.pricing} className="cursor-pointer">
            <Crown className="mr-2 size-4" />
            {copy.pricing}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={ROUTES.settings} className="cursor-pointer">
            <Settings className="mr-2 size-4" />
            {copy.settings}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          disabled={isPending}
          onSelect={(event) => {
            event.preventDefault();
            logout();
          }}
        >
          {isPending ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 size-4" />
          )}
          {isPending ? copy.loggingOut : copy.logout}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
