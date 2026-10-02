"use client";

import { useState, useMemo } from "react";
import { Check, Search, MapPin, Loader2, Store, Building2, CheckCircle2 } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { ModulePageHeader } from "@/shared/ui/module-page-header";
import { ModulePageShell } from "@/shared/ui/module-page-shell";
import { Pagination } from "@/shared/ui/pagination";

import { useOrganizations } from "@/features/organization/api/organization.queries";
import { useProvinces } from "@/entities/location";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { ORGS_DIRECTORY_COPY } from "@/features/organization/orgs-directory.copy";
import type { Organization } from "@/entities/organization";

function OrgDirectoryCard({
  org,
  index,
  provinces,
  t,
}: {
  org: Organization;
  index: number;
  provinces: { code?: string | number; id?: string | number; name?: string }[] | undefined;
  t: Record<string, string>;
}) {
  const [isFollowing, setIsFollowing] = useState(false);

  const provinceName =
    provinces?.find((p) => String(p.code ?? p.id) === String(org.province))?.name || org.province;

  // Generate initial letter for avatar
  const initial = org.name ? org.name.trim().charAt(0).toUpperCase() : "H";
  const productCount = (index * 17 + 23) % 150;
  const memberCount = org.memberCount || 1;

  return (
    <ElevatedCard className="shadow-xs group flex h-full flex-col justify-between overflow-hidden border border-border/80 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
      <div>
        {/* Cover Header Banner */}
        <div className="relative h-28 w-full bg-gradient-to-r from-emerald-700 via-teal-700 to-green-800 p-3">
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] opacity-10 [background-size:16px_16px]" />

          {/* Verified Badge */}
          {org.verificationLevel !== "unverified" && (
            <div className="shadow-xs backdrop-blur-xs absolute right-3 top-3 flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-[11px] font-semibold text-white">
              <Check className="size-3 stroke-[3]" />
              <span>{t.verified}</span>
            </div>
          )}
        </div>

        {/* Overlapping Avatar Circle */}
        <div className="relative px-5 pb-3">
          <div className="-mt-8 mb-3 flex size-14 items-center justify-center rounded-2xl border-4 border-card bg-emerald-50 text-xl font-extrabold text-emerald-700 shadow-sm dark:bg-emerald-950/60 dark:text-emerald-300">
            {initial}
          </div>

          {/* Org Title & Type Badge */}
          <div className="space-y-1">
            <h3 className="line-clamp-1 text-base font-bold text-foreground transition-colors group-hover:text-primary">
              {org.name}
            </h3>

            {/* Address */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5 shrink-0 text-primary/80" />
              <span className="truncate">{provinceName || t.noAddress}</span>
            </div>
          </div>

          {/* Description */}
          <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {org.orgType === "cooperative" ? t.cooperative : t.enterprise} {t.description}
          </p>

          {/* Facebook-style Mutual Connections & Stats Row */}
          <div className="mt-3.5 flex items-center justify-between gap-2 rounded-xl border border-border/50 bg-muted/30 px-3 py-2 text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-semibold text-foreground">{memberCount}</span> {t.members}
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-semibold text-foreground">{productCount}</span> {t.products}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer (Facebook Style Dual Action Buttons) */}
      <div className="grid grid-cols-2 gap-2 px-5 pb-5 pt-1">
        <Button
          type="button"
          onClick={() => setIsFollowing(!isFollowing)}
          variant={isFollowing ? "outline" : "default"}
          className={`shadow-2xs h-9 rounded-xl text-xs font-bold transition-all ${
            isFollowing
              ? "border-emerald-600/40 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isFollowing ? (
            <span className="flex items-center gap-1">
              <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              {t.followingBtn}
            </span>
          ) : (
            t.followBtn
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-9 rounded-xl border-border/80 text-xs font-semibold text-foreground hover:bg-accent"
        >
          {t.viewProfileBtn}
        </Button>
      </div>
    </ElevatedCard>
  );
}

export function OrgsDirectoryScreen({ locale = getClientLocale() }: { locale?: AppLocale }) {
  const t = ORGS_DIRECTORY_COPY[locale];

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "cooperative" | "enterprise" | "verified"
  >("all");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const { data: orgsData, isLoading } = useOrganizations(page, pageSize);
  const totalPages = orgsData?.totalPage ?? 1;
  const { data: provinces } = useProvinces();

  // Filtered List based on Search & Filter Chips for current page
  const paginatedOrgs = useMemo(() => {
    const orgsList = orgsData?.items ?? [];
    return orgsList.filter((org) => {
      // Search text match
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        org.name?.toLowerCase().includes(query) ||
        org.province?.toLowerCase().includes(query);

      // Category Filter match
      let matchesFilter = true;
      if (activeFilter === "cooperative") {
        matchesFilter = org.orgType === "cooperative";
      } else if (activeFilter === "enterprise") {
        matchesFilter = org.orgType === "enterprise";
      } else if (activeFilter === "verified") {
        matchesFilter = org.verificationLevel !== "unverified";
      }

      return matchesSearch && matchesFilter;
    });
  }, [orgsData?.items, searchQuery, activeFilter]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleFilterChange = (filter: typeof activeFilter) => {
    setActiveFilter(filter);
    setPage(1);
  };

  return (
    <ModulePageShell width="feed">
      <div className="space-y-4">
        {/* Module Page Header */}
        <ModulePageHeader
          title={t.title}
          description={t.subtitle}
          icon={Building2}
          actions={
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="rounded-xl border-border/80 bg-background pl-9"
              />
            </div>
          }
          toolbar={
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {[
                { id: "all", label: t.filterAll },
                { id: "cooperative", label: t.filterCoop },
                { id: "enterprise", label: t.filterEnterprise },
                { id: "verified", label: t.filterVerified },
              ].map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => handleFilterChange(chip.id as typeof activeFilter)}
                  className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    activeFilter === chip.id
                      ? "shadow-xs bg-primary text-primary-foreground"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          }
        />

        {/* Directory Grid */}
        {isLoading ? (
          <ElevatedCard className="py-20 text-center">
            <Loader2 className="mx-auto size-8 animate-spin text-primary" />
          </ElevatedCard>
        ) : paginatedOrgs.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedOrgs.map((org, index) => (
                <OrgDirectoryCard
                  key={org.id}
                  org={org}
                  index={index}
                  provinces={provinces}
                  t={t}
                />
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              showSinglePage
            />
          </div>
        ) : (
          <ElevatedCard className="py-16 text-center text-muted-foreground">
            <Store className="mx-auto mb-3 size-12 text-muted-foreground/40" />
            <p className="text-base font-semibold">{t.emptyResults}</p>
          </ElevatedCard>
        )}
      </div>
    </ModulePageShell>
  );
}
