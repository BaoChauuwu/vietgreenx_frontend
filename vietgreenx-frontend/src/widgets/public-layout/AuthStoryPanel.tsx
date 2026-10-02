"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/shared/lib/cn";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { getPublicLayoutCopy } from "./public-layout.constants";

const DESKTOP_IMAGES = [
  "/images/auth-hero-desktop.jpg",
  "/images/auth-hero-desktop-bc.jpg",
] as const;

interface AuthStoryPanelProps {
  className?: string;
}

export function AuthStoryPanel({ className }: AuthStoryPanelProps) {
  const copy = getPublicLayoutCopy(getClientLocale()).authStoryPanel;
  const [desktopSrc] = useState(
    () => DESKTOP_IMAGES[Math.floor(Math.random() * DESKTOP_IMAGES.length)] ?? DESKTOP_IMAGES[0],
  );

  return (
    <aside
      className={cn(
        // mobile: fixed-height banner at top (in-flow)
        "relative h-[260px] w-full flex-shrink-0 overflow-hidden",
        // tablet + desktop: absolute full-screen background
        "md:absolute md:inset-0 md:h-full md:w-full",
        className,
      )}
    >
      {/* Mobile + tablet background */}
      <Image
        src="/images/auth-hero.jpg"
        alt={copy.alt}
        fill
        className="object-cover object-center xl:hidden"
        priority
        sizes="100vw"
      />
      {/* Desktop background — random between 2 images each page load */}
      <Image
        src={desktopSrc}
        alt={copy.alt}
        fill
        className="hidden object-cover object-center xl:block"
        priority
        sizes="100vw"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

      {/* Logo */}
      <div className="absolute left-6 top-6 z-10 md:left-8 md:top-8">
        <Link
          href="/"
          aria-label="VietGreenX Home"
          className="block transition-opacity hover:opacity-80"
        >
          <Image src="/images/logo.svg" alt="VietGreenX" width={140} height={42} priority />
        </Link>
      </div>

      {/* Tagline — hidden on mobile; shown on tablet (top) and desktop (bottom-left) */}
      <div
        className={cn(
          "absolute z-10 hidden px-8",
          "md:left-0 md:top-28 md:block",
          "xl:bottom-12 xl:left-10 xl:top-auto",
        )}
      >
        <p
          className="font-bold leading-tight text-white md:text-[1.5rem] lg:text-[2.4rem]"
          style={{ textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
        >
          {copy.tagline1}
        </p>
        <p
          className="mt-0.5 font-bold leading-tight md:text-[1.5rem] lg:text-[2.4rem]"
          style={{ textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
        >
          <span className="text-secondary">{copy.tagline2a}</span>
          <span className="text-white">{copy.tagline2b}</span>
        </p>
      </div>
    </aside>
  );
}
