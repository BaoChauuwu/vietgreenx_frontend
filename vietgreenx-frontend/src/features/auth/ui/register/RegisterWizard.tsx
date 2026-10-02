"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import type { AppLocale } from "@/shared/i18n/locale";
import { ROUTES } from "@/shared/routing";
import { cn } from "@/shared/lib/cn";

import { getAuthCopy } from "../../auth.constants";
import { AuthFormPanel } from "../AuthFormPanel";
import { EmailRegisterTab } from "./EmailRegisterTab";
import { PhoneRegisterTab } from "./PhoneRegisterTab";

type RegisterTab = "phone" | "email";

interface RegisterWizardProps {
  locale: AppLocale;
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function RegisterWizard({ locale }: RegisterWizardProps) {
  const copy = getAuthCopy(locale).register;
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "email" ? "email" : "phone";
  const [tab, setTab] = useState<RegisterTab>(initialTab);

  return (
    <>
      {/* Community pill — hidden on tablet (card centered on bg, no outside content) */}
      <div className="mb-5 flex justify-center md:hidden xl:flex">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-gradient-to-r from-primary/10 to-tertiary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <span>🌱</span>
          {copy.communityPill}
        </span>
      </div>

      <AuthFormPanel>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{copy.title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{copy.subtitle}</p>
        </div>

        {/* Social login — coming soon */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            disabled
            title={copy.social.featureComingSoon}
            className="flex h-[52px] w-full cursor-not-allowed items-center justify-center gap-3 rounded-[14px] border border-border bg-white font-medium text-foreground/40"
          >
            <GoogleIcon />
            {copy.social.google}
            <LockIcon />
          </button>
          <button
            type="button"
            disabled
            title={copy.social.featureComingSoon}
            className="flex h-[52px] w-full cursor-not-allowed items-center justify-center gap-3 rounded-[14px] border border-border bg-white font-medium text-foreground/40"
          >
            <FacebookIcon />
            {copy.social.facebook}
            <LockIcon />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">{copy.divider}</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Phone / Email tabs */}
        <div className="flex rounded-lg border border-border bg-muted/30 p-0.5">
          {(["phone", "email"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                tab === id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {copy.tabs[id]}
            </button>
          ))}
        </div>

        {tab === "phone" ? <PhoneRegisterTab locale={locale} /> : <EmailRegisterTab locale={locale} />}

        <p className="text-center text-sm text-muted-foreground">
          {copy.hasAccount}{" "}
          <Link href={ROUTES.login} className="font-semibold text-primary hover:text-primary/80">
            {copy.login}
          </Link>
        </p>
      </AuthFormPanel>
    </>
  );
}
