import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";
import { PublicPageShell } from "@/widgets/public-layout";
import { LegalClient, LegalHeroCarousel } from "./LegalClient";
import { getLegalCopy } from "./legal.constants";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale();
  const copy = getLegalCopy(locale);
  return {
    title: copy.meta.title,
    description: copy.meta.description,
  };
}

export default function LegalPage() {
  const locale = getRequestLocale();
  const copy = getLegalCopy(locale);

  return (
    <PublicPageShell locale={locale}>
      <div className="min-h-[100dvh] bg-muted/30 pb-20">
        {/* Hero section with gradient */}
        <div className="relative overflow-hidden border-b border-border bg-background">
          {/* Decorative background gradient */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-emerald-500/5 opacity-50" />

          {/* Decorative blobs */}
          <div className="absolute -right-24 -top-24 size-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-secondary/10 blur-3xl" />

          <div className="relative mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              {copy.hero.backHome}
            </Link>

            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center lg:gap-12">
              <div className="max-w-xl flex-1 lg:max-w-2xl">
                <div className="mb-6 flex items-center gap-4">
                  <div className="rounded-2xl border border-border bg-white p-3 shadow-sm">
                    <Image
                      src="/images/logo.svg"
                      alt="VietGreenX Logo"
                      width={48}
                      height={48}
                      className="size-12 object-contain"
                    />
                  </div>
                  <div className="flex items-center text-sm font-medium text-muted-foreground">
                    <span className="font-bold text-primary">VietGreenX</span>
                    <ChevronRight className="mx-2 size-4 text-muted-foreground/50" />
                    <span>{copy.hero.breadcrumb}</span>
                  </div>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                  {copy.hero.titleStart}{" "}
                  <span className="text-primary">{copy.hero.titleHighlight}</span>
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  {copy.hero.description}
                </p>
              </div>
              <div className="relative hidden aspect-[16/10] w-full max-w-lg flex-1 overflow-hidden rounded-2xl bg-muted shadow-2xl ring-1 ring-border/50 md:block lg:max-w-2xl xl:max-w-3xl">
                <LegalHeroCarousel />
              </div>
            </div>
          </div>
        </div>

        <LegalClient locale={locale} />
      </div>
    </PublicPageShell>
  );
}
