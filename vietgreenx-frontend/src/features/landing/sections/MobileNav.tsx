"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";

import { ROUTES } from "@/shared/routing";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/cn";
import type { AppLocale } from "@/shared/i18n/locale";
import { getLandingCopy } from "../landing.constants";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface MobileNavProps {
  locale: AppLocale;
}

export function MobileNav({ locale }: MobileNavProps) {
  const copy = getLandingCopy(locale);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        aria-label={copy.mobileMenu.openAriaLabel}
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu className="size-6" />
      </Button>

      {mounted &&
        createPortal(
          <div className="md:hidden">
            <div
              className={cn(
                "fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm transition-opacity duration-300",
                open ? "opacity-100" : "pointer-events-none opacity-0",
              )}
              onClick={close}
              aria-hidden
            />

            <nav
              className={cn(
                "fixed right-0 top-0 z-[70] flex h-dvh w-72 max-w-[80%] flex-col gap-1 border-l border-border bg-background p-6 shadow-xl transition-transform duration-300",
                open ? "translate-x-0" : "translate-x-full",
              )}
              aria-hidden={!open}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-semibold">{copy.mobileMenu.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={copy.mobileMenu.closeAriaLabel}
                  onClick={close}
                >
                  <X className="size-5" />
                </Button>
              </div>

              {copy.navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className="rounded-md px-3 py-2.5 text-base font-medium text-foreground hover:bg-accent hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}

              <div className="mt-3">
                <LanguageSwitcher locale={locale} label={copy.localeLabel} />
              </div>

              <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                <Button asChild variant="outline">
                  <Link href={ROUTES.login} onClick={close}>
                    {copy.auth.login}
                  </Link>
                </Button>
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href={ROUTES.register} onClick={close}>
                    {copy.auth.signUp}
                  </Link>
                </Button>
              </div>
            </nav>
          </div>,
          document.body,
        )}
    </div>
  );
}
