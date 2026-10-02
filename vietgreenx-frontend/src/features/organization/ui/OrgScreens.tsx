"use client";

import Link from "next/link";
import {
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  FileText,
  Globe,
  Hash,
  Heart,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Users,
} from "lucide-react";
import { useState } from "react";

import {
  isOrganizationVerified,
  organizationMemberDisplayName,
  organizationTypeSchema,
} from "@/entities/organization";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { formatAbsoluteTime } from "@/shared/lib/format-relative-time";
import { ROUTES } from "@/shared/routing";
import { Button } from "@/shared/ui/button";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { ModulePageHeader } from "@/shared/ui/module-page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";

import { useUser } from "@/shared/auth";

import {
  useActiveOrganizationId,
  useOrganization,
  useOrganizationMembers,
} from "../api/organization.queries";
import { useProvinces } from "@/entities/location/api/location.queries";
import { getOrganizationCopy, getMemberRoleLabel } from "../organization.constants";
import { OrgCreateForm } from "./OrgCreateForm";
import { OrgEditForm } from "./OrgEditForm";
import { InviteMemberDialog } from "./InviteMemberDialog";
import { OrgSubNav } from "./OrgSubNav";
import { OrgVerificationCard } from "./OrgVerificationCard";
import { RemoveMemberDialog } from "./RemoveMemberDialog";

function orgTypeLabel(orgType: string, locale: AppLocale): string {
  const copy = getOrganizationCopy(locale).dashboard;
  if (orgType === organizationTypeSchema.enum.cooperative) return copy.typeCooperative;
  if (orgType === organizationTypeSchema.enum.enterprise) return copy.typeEnterprise;
  return orgType;
}

function memberStatusLabel(status: string, locale: AppLocale): string {
  const labels = getOrganizationCopy(locale).members.status;
  if (status === "invited") return labels.invited;
  return labels.active;
}

interface OrgDashboardShellProps {
  locale?: AppLocale;
}

export function OrgDashboardShell({ locale = getClientLocale() }: OrgDashboardShellProps) {
  const copy = getOrganizationCopy(locale).dashboard;
  const orgId = useActiveOrganizationId();
  const { data: org, isLoading, isError } = useOrganization(orgId);
  const { data: membersPage } = useOrganizationMembers(orgId, 1, 1);
  const { data: provinces } = useProvinces();

  if (!orgId) {
    return (
      <div className="w-full space-y-4">
        <ModulePageHeader
          title={copy.title}
          description={copy.subtitle}
          icon={Building2}
          iconTileClassName="bg-secondary-50 text-secondary-700"
          toolbar={<OrgSubNav locale={locale} active="dashboard" />}
        />
        <ElevatedCard>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{copy.emptyTitle}</p>
            <p className="mt-2">{copy.emptyDescription}</p>
          </CardContent>
        </ElevatedCard>
        <OrgCreateForm locale={locale} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <ElevatedCard>
        <CardContent className="flex items-center justify-center gap-2 py-14 text-sm text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden />
          {copy.loading}
        </CardContent>
      </ElevatedCard>
    );
  }

  if (isError || !org) {
    return (
      <ElevatedCard className="border border-dashed border-border">
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          {copy.loadError}
        </CardContent>
      </ElevatedCard>
    );
  }

  const verified = isOrganizationVerified(org.verificationLevel);
  const memberCount = membersPage?.total ?? 0;

  const provinceName = provinces?.find((p) => String(p.code) === String(org.provinceCode))?.name;

  return (
    <div className="w-full space-y-4">
      {/* Main Org Card — header + tabs + info all in one */}
      <ElevatedCard className="overflow-hidden border border-border/60 shadow-sm">
        {/* Top strip: icon + title + description + actions */}
        <div className="flex items-start justify-between gap-4 border-b border-border/50 px-5 pb-4 pt-5">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/30">
              <Building2 className="size-6" aria-hidden />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold leading-tight tracking-tight text-foreground">
                {copy.title}
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground">{copy.subtitle}</p>
            </div>
          </div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="shrink-0 gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <Link href={ROUTES.publicOrg(org.id)} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-4" />
              <span className="hidden sm:inline">{copy.viewPublic}</span>
            </Link>
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-1">
          <OrgSubNav locale={locale} active="dashboard" />
        </div>

        <CardContent className="space-y-5 px-5 pb-5 pt-4">
          {/* Org identity block */}
          <div className="flex items-center gap-3.5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted/80 text-foreground ring-1 ring-border">
              <Building2 className="size-5 text-muted-foreground" aria-hidden />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base font-semibold text-foreground">{org.name}</span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold",
                    verified
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-300/60 dark:bg-emerald-950 dark:text-emerald-400 dark:ring-emerald-700/40"
                      : "bg-muted text-muted-foreground ring-1 ring-border",
                  )}
                >
                  <CheckCircle2 className="size-3" />
                  {verified ? copy.verified : copy.notVerified}
                </span>
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {provinceName && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3 text-primary/60" />
                    {provinceName}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Building2 className="size-3 text-primary/60" />
                  {orgTypeLabel(org.orgType, locale)}
                </span>
                {org.taxCode && (
                  <span className="font-mono text-[11px] text-muted-foreground/80">
                    MST: {org.taxCode}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Detail info grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              {
                icon: MapPin,
                label: copy.details.province,
                value: org.province ?? null,
              },
              {
                icon: MapPin,
                label: copy.details.address,
                value: org.address ?? null,
              },
              {
                icon: Heart,
                label: copy.details.followerCount,
                value: String(org.followerCount ?? 0),
              },
              {
                icon: Calendar,
                label: copy.details.createdAt,
                value: org.createdAt
                  ? new Date(org.createdAt).toLocaleDateString(
                      locale === "vi" ? "vi-VN" : "en-US",
                      { year: "numeric", month: "long", day: "numeric" },
                    )
                  : null,
              },
              {
                icon: FileText,
                label: copy.details.description,
                value: org.description ?? null,
                fullWidth: true,
              },
            ].map(({ icon: Icon, label, value, fullWidth }) => (
              <div
                key={label}
                className={cn(
                  "flex items-start gap-2.5 rounded-lg border border-border/50 bg-muted/10 px-3.5 py-3",
                  fullWidth && "sm:col-span-2",
                )}
              >
                <Icon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/70" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {label}
                  </p>
                  {value ? (
                    <p className="mt-0.5 text-sm text-foreground">{value}</p>
                  ) : (
                    <p className="mt-0.5 text-sm italic text-muted-foreground/60">
                      {copy.details.notProvided}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 divide-x divide-border/60 overflow-hidden rounded-xl border border-border/60 bg-muted/20">
            <div className="px-4 py-3.5 text-center">
              <div className="mb-1 flex items-center justify-center gap-1.5 text-muted-foreground">
                <Users className="size-3.5 text-primary" />
                <span className="text-[11px] font-medium uppercase tracking-wider">
                  {copy.stats.members}
                </span>
              </div>
              <p className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
                {memberCount}
              </p>
            </div>
            <div className="px-4 py-3.5 text-center">
              <div className="mb-1 flex items-center justify-center gap-1.5 text-muted-foreground">
                <ShoppingBag className="size-3.5 text-amber-600" />
                <span className="text-[11px] font-medium uppercase tracking-wider">
                  {copy.stats.listings}
                </span>
              </div>
              <p className="text-2xl font-bold tabular-nums tracking-tight text-foreground">—</p>
            </div>
            <div className="px-4 py-3.5 text-center">
              <div className="mb-1 flex items-center justify-center gap-1.5 text-muted-foreground">
                <ShieldCheck className="size-3.5 text-emerald-600" />
                <span className="text-[11px] font-medium uppercase tracking-wider">
                  {copy.stats.verified}
                </span>
              </div>
              <p
                className={cn(
                  "text-sm font-bold",
                  verified ? "text-emerald-600 dark:text-emerald-400" : "text-foreground",
                )}
              >
                {verified ? copy.verified : copy.notVerified}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="sm" className="gap-1.5 font-medium">
              <Link href={ROUTES.orgMembers}>
                <Users className="size-4" />
                {copy.manageMembers}
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-1.5 font-medium">
              <Link href={ROUTES.orgEdit}>
                <Pencil className="size-4" />
                {copy.editOrg}
              </Link>
            </Button>
          </div>
        </CardContent>
      </ElevatedCard>

      <OrgVerificationCard locale={locale} />
    </div>
  );
}

interface OrgEditFormShellProps {
  locale?: AppLocale;
}

export function OrgEditFormShell({ locale = getClientLocale() }: OrgEditFormShellProps) {
  return <OrgEditForm locale={locale} />;
}

interface MemberListShellProps {
  locale?: AppLocale;
}

export function MemberListShell({ locale = getClientLocale() }: MemberListShellProps) {
  const copy = getOrganizationCopy(locale).members;
  const orgId = useActiveOrganizationId();
  const { user } = useUser();
  const { data, isLoading, isError } = useOrganizationMembers(orgId);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<{
    userId: string;
    name: string;
  } | null>(null);

  return (
    <div className="w-full space-y-4">
      <ElevatedCard className="overflow-hidden border border-border/60 shadow-sm">
        {/* Header strip */}
        <div className="flex items-start justify-between gap-4 border-b border-border/50 px-5 pb-4 pt-5">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/30">
              <Users className="size-6" aria-hidden />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold leading-tight tracking-tight text-foreground">
                {copy.title}
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground">{copy.subtitle}</p>
            </div>
          </div>
          {!isLoading && (
            <Button
              type="button"
              size="sm"
              className="shrink-0 gap-1.5"
              disabled={!orgId}
              onClick={() => setInviteOpen(true)}
            >
              <Plus className="size-4" />
              <span className="hidden sm:inline">{copy.inviteCta}</span>
            </Button>
          )}
        </div>

        {/* Tab navigation */}
        <div className="px-5 pt-1">
          <OrgSubNav locale={locale} active="members" />
        </div>

        {/* Content area */}
        {!orgId ? (
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            {copy.emptyDescription}
          </CardContent>
        ) : isLoading ? (
          <CardContent className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin" aria-hidden />
            {copy.loading}
          </CardContent>
        ) : isError ? (
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            {copy.loadError}
          </CardContent>
        ) : !data || data.items.length === 0 ? (
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{copy.emptyTitle}</p>
            <p className="mt-1">{copy.emptyDescription}</p>
          </CardContent>
        ) : (
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-[480px]">
                <TableHeader>
                  <TableRow className="bg-muted/30 text-left">
                    <TableHead className="pl-5">{copy.columns.name}</TableHead>
                    <TableHead>{copy.columns.role}</TableHead>
                    <TableHead>{copy.columns.status}</TableHead>
                    <TableHead>{copy.columns.joined}</TableHead>
                    <TableHead>{copy.columns.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((member) => (
                    <TableRow key={member.id} className="border-border/60">
                      <TableCell className="py-3 pl-5 font-medium text-foreground">
                        {organizationMemberDisplayName(member)}
                      </TableCell>
                      <TableCell className="py-3 text-sm text-muted-foreground">
                        {getMemberRoleLabel(member.orgRole, locale)}
                      </TableCell>
                      <TableCell className="py-3">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
                            member.status === "active"
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-300/50 dark:bg-emerald-950 dark:text-emerald-400"
                              : "bg-muted text-muted-foreground ring-1 ring-border",
                          )}
                        >
                          {memberStatusLabel(member.status, locale)}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 text-sm text-muted-foreground">
                        {formatAbsoluteTime(new Date(member.joinedAt), locale)}
                      </TableCell>
                      <TableCell className="py-3 pr-5">
                        {member.userId !== user?.id ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() =>
                              setRemoveTarget({
                                userId: member.userId,
                                name: organizationMemberDisplayName(member),
                              })
                            }
                          >
                            {copy.remove.action}
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        )}
      </ElevatedCard>

      <InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} locale={locale} />
      <RemoveMemberDialog
        orgId={orgId}
        memberUserId={removeTarget?.userId ?? null}
        memberName={removeTarget?.name ?? ""}
        open={Boolean(removeTarget)}
        onOpenChange={(open) => {
          if (!open) setRemoveTarget(null);
        }}
        locale={locale}
      />
    </div>
  );
}
