"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ShieldCheck } from "lucide-react";

import { Button } from "@/shared/ui/button";
import type { AppLocale } from "@/shared/i18n/locale";
import { ROUTES } from "@/shared/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { getLandingCopy } from "../landing.constants";

interface SiteHeaderProps {
  locale: AppLocale;
}

export function SiteHeader({ locale }: SiteHeaderProps) {
  const copy = getLandingCopy(locale);
  const pathname = usePathname();
  const onLoginPage = pathname === ROUTES.login;
  const onRegisterPage = pathname === ROUTES.register;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90">
      <div className="container flex h-16 items-center justify-between gap-3">
        <div className="flex items-center gap-8">
          <Link href="/" aria-label="VietGreenX" className="flex shrink-0 items-center gap-2.5">
            <Image src="/images/logo.svg" alt="VietGreenX" width={122} height={32} priority />
            <span
              title={copy.beta.hint}
              className="hidden rounded-full border border-secondary/35 bg-secondary-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-secondary-700 sm:inline-flex"
            >
              {copy.beta.label}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-muted/50 hover:text-foreground focus-visible:ring-0"
                >
                  {copy.headerDropdown.explore} <ChevronDown className="size-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="mt-2 w-[280px] rounded-2xl border-0 bg-background/95 p-2 shadow-xl ring-1 ring-border/50 backdrop-blur-md"
              >
                <DropdownMenuLabel className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {copy.headerDropdown.systemResources}
                </DropdownMenuLabel>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer rounded-xl p-3 transition-colors focus:bg-muted/80"
                >
                  <Link href={ROUTES.legal} className="flex items-start gap-3 outline-none">
                    <div className="mt-0.5 shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
                      <ShieldCheck className="size-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold leading-none text-foreground">
                        {copy.headerDropdown.legal.title}
                      </span>
                      <span className="text-xs leading-snug text-muted-foreground">
                        {copy.headerDropdown.legal.description}
                      </span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {!onLoginPage && (
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href={ROUTES.login}>{copy.auth.login}</Link>
            </Button>
          )}
          {!onRegisterPage && (
            <Button
              asChild
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href={ROUTES.register}>{copy.auth.signUp}</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
