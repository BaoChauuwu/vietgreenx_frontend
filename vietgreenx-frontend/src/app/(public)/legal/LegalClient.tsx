"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/shared/lib/cn";
import { ROUTES } from "@/shared/routing";
import { getLegalCopy } from "./legal.constants";
import type { AppLocale } from "@/shared/i18n/locale";

const HERO_IMAGES = ["/images/legal.jpg", "/images/vietshop.jpg", "/images/vietshop2.jpg"];

export function LegalHeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-full w-full">
      {HERO_IMAGES.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Legal illustration ${index + 1}`}
          fill
          className={cn(
            "object-cover transition-all duration-700",
            index === currentIndex ? "scale-100 opacity-100" : "scale-105 opacity-0",
          )}
          priority={index === 0}
        />
      ))}
    </div>
  );
}

export function LegalClient({ locale }: { locale: AppLocale }) {
  const [activeTab, setActiveTab] = useState("terms");
  const copy = getLegalCopy(locale);

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
      <div className="flex flex-col gap-10 md:flex-row lg:gap-16">
        {/* Sidebar Navigation */}
        <aside className="w-full shrink-0 md:w-64">
          <nav className="sticky top-24 flex flex-col gap-2">
            <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {copy.sidebar.category}
            </div>
            {copy.navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium outline-none transition-all focus-visible:ring-2 focus-visible:ring-primary",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon
                    className={cn(
                      "size-4 transition-transform group-hover:scale-110",
                      isActive ? "text-primary-foreground" : "text-muted-foreground",
                    )}
                  />
                  {item.label}
                </button>
              );
            })}

            <div className="mt-8 rounded-xl border border-primary/10 bg-primary/5 p-4">
              <p className="mb-3 text-xs text-muted-foreground">{copy.sidebar.supportHint}</p>
              <Link href={ROUTES.support} className="text-sm font-semibold text-primary hover:underline">
                {copy.sidebar.supportLink} &rarr;
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="min-w-0 flex-1">
          <div className="relative overflow-hidden rounded-2xl bg-card p-8 shadow-sm ring-1 ring-border transition-all sm:p-10 lg:p-12">
            {/* Subtle accent line */}
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-primary via-secondary to-transparent" />

            <div className="prose prose-slate max-w-none text-muted-foreground duration-500 animate-in fade-in slide-in-from-bottom-4">
              {copy.content[activeTab]}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
