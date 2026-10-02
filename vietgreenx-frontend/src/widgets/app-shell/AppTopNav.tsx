"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, Crown, Menu, MessageCircle, Search, X } from "lucide-react";

import { useUser } from "@/shared/auth";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { ROUTES } from "@/shared/routing";
import { Button } from "@/shared/ui/button";

import { getShellCopy } from "@/shared/i18n/shell.copy";
import { NotificationUnreadBadge, useNotificationUnreadCount } from "./NotificationUnreadBadge";
import { UserAccountMenu } from "./UserAccountMenu";

interface AppTopNavProps {
  locale?: AppLocale;
}

export function AppTopNav({ locale = getClientLocale() }: AppTopNavProps) {
  const copy = getShellCopy(locale).topNav;
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQ = searchParams?.get("q") ?? "";

  const [searchQuery, setSearchQuery] = useState(currentQ);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const { user } = useUser();
  const unreadCount = useNotificationUnreadCount();

  useEffect(() => {
    setSearchQuery(currentQ);
  }, [currentQ]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`${ROUTES.search}?q=${encodeURIComponent(q)}`);
    } else {
      router.push(ROUTES.search);
    }
    setIsMobileSearchOpen(false);
  };

  const notificationsAriaLabel =
    unreadCount > 0
      ? `${copy.notificationsAriaLabel}. ${copy.notificationsAriaLabelUnread(unreadCount)}`
      : copy.notificationsAriaLabel;

  return (
    <header className="sticky top-0 z-40 border-b border-tertiary bg-primary-900">
      <div className="flex h-16 items-center justify-between px-3 sm:px-6">
        {isMobileSearchOpen ? (
          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full items-center gap-2 rounded-full border border-primary/20 bg-white px-3.5 py-1.5 text-sm text-foreground shadow-sm sm:hidden"
          >
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={copy.searchPlaceholder}
              autoFocus
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setIsMobileSearchOpen(false)}
            >
              <X className="size-4" />
            </Button>
          </form>
        ) : (
          <>
            <Link href={ROUTES.feed} aria-label="VietGreenX" className="shrink-0">
              <Image
                src="/images/logo.svg"
                alt="VietGreenX"
                width={180}
                height={40}
                priority
                className="h-auto w-[110px] sm:w-[180px]"
              />
            </Link>

            <form
              onSubmit={handleSearchSubmit}
              className="hidden max-w-[846px] flex-1 items-center gap-2 rounded-full border border-primary/15 bg-primary-50 px-4 py-1.5 text-sm text-muted-foreground transition-colors focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 sm:flex"
            >
              <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={copy.searchPlaceholder}
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </form>

            <div className="flex shrink-0 items-center gap-0.5" data-tour="tour-top-actions">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 sm:hidden"
                onClick={() => setIsMobileSearchOpen(true)}
                aria-label={copy.searchAriaLabel}
              >
                <Search className="size-5" />
              </Button>

              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" asChild>
                <Link
                  href={ROUTES.pricing}
                  aria-label={copy.pricingAriaLabel}
                  title={copy.pricingAriaLabel}
                >
                  <Crown className="size-5" />
                </Link>
              </Button>

              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" asChild>
                <Link href={ROUTES.chat} aria-label={copy.messagesAriaLabel}>
                  <MessageCircle className="size-5" />
                </Link>
              </Button>

              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" asChild>
                <Link href={ROUTES.notifications} aria-label={notificationsAriaLabel}>
                  <Bell className="size-5" />
                  <NotificationUnreadBadge className="-right-0.5 -top-0.5" />
                </Link>
              </Button>

              {user && (
                <div className="flex items-center rounded border border-primary/5 bg-primary/5">
                  <UserAccountMenu locale={locale} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden text-white hover:bg-white/10 sm:inline-flex"
                    aria-label="Menu"
                  >
                    <Menu className="size-5" />
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
