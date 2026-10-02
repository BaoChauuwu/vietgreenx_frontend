import Link from "next/link";
import { Leaf, Lock } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ROUTES } from "@/shared/routing";
import { getRequestLocale } from "@/shared/i18n/get-request-locale";
import { getForbiddenCopy } from "@/shared/i18n/forbidden.copy";

export async function generateMetadata() {
  const locale = getRequestLocale();
  const copy = getForbiddenCopy(locale);
  return {
    title: copy.metadata.title,
    description: copy.metadata.description,
  };
}

export default function Forbidden() {
  const locale = getRequestLocale();
  const copy = getForbiddenCopy(locale);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/images/bg-403-terraces.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Overlay to darken background slightly */}
      <div className="absolute inset-0 z-0 bg-black/30" />

      {/* Glassmorphism Card */}
      <div className="relative z-10 mx-4 flex max-w-lg flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/10 p-10 text-center shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-md sm:p-16">
        {/* Glow effect inside card */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/10 to-transparent opacity-50" />

        {/* Icon Group */}
        <div className="relative mb-6 flex items-center justify-center">
          <Leaf className="absolute -left-6 -top-4 size-16 text-green-300 opacity-80 drop-shadow-lg" />
          <Lock className="size-20 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
          <Leaf className="absolute -bottom-4 -right-6 size-12 text-green-400 opacity-60 drop-shadow-lg" />
        </div>

        {/* Typography */}
        <h1 className="mb-2 text-7xl font-extrabold tracking-tighter text-white drop-shadow-lg">
          403
        </h1>
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-white drop-shadow-md sm:text-3xl">
          {copy.title}
        </h2>
        <p className="mb-10 max-w-[280px] text-sm font-medium uppercase tracking-widest text-green-100/90 drop-shadow">
          {copy.subtitle}
        </p>

        {/* Action Button */}
        <Button
          asChild
          size="lg"
          className="rounded-full bg-primary/90 px-8 text-base font-semibold text-primary-foreground shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all hover:scale-105 hover:bg-primary hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]"
        >
          <Link href={ROUTES.home}>{copy.button}</Link>
        </Button>
      </div>
    </div>
  );
}
