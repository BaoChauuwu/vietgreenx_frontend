"use client";

import { Award, ExternalLink, Loader2, Pencil, Plus, Trash2 } from "lucide-react";

import type { Certification } from "@/entities/certification";
import { useDeleteCertification } from "../api/certification.queries";
import { certificationService } from "../api/certification.service";
import { getCertificationCopy } from "../certification.constants";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";
import { cn } from "@/shared/lib/cn";
import { toIntlLocale } from "@/shared/lib/format-relative-time";
import { toastService } from "@/shared/lib/toast";
import { Button } from "@/shared/ui/button";
import { CardContent } from "@/shared/ui/card";
import { ElevatedCard } from "@/shared/ui/elevated-card";
import { ModulePageHeader } from "@/shared/ui/module-page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";

function statusClassName(status: Certification["status"]): string {
  switch (status) {
    case "valid":
    case "approved":
      return "bg-primary/10 text-primary";
    case "pending":
      return "bg-amber-500/10 text-amber-700 dark:text-amber-400";
    case "rejected":
    case "expired":
      return "bg-destructive/10 text-destructive";
    case "pending_renewal":
      return "bg-amber-500/10 text-amber-700 dark:text-amber-400";
    case "revoked":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}

interface CertificationListShellProps {
  locale?: AppLocale;
  greenProfileId?: string;
  certifications?: Certification[];
  isLoading?: boolean;
  isError?: boolean;
  onAddClick?: () => void;
  onEditClick?: (certification: Certification) => void;
}

export function CertificationListShell({
  locale = getClientLocale(),
  greenProfileId,
  certifications = [],
  isLoading = false,
  isError = false,
  onAddClick,
  onEditClick,
}: CertificationListShellProps) {
  const copy = getCertificationCopy(locale);
  const listCopy = copy.list;
  const { mutate: deleteCert, isPending: isDeleting } = useDeleteCertification(
    greenProfileId ?? "none",
  );

  const handleViewDocument = async (documentUrl: string) => {
    try {
      await certificationService.openDocument(documentUrl);
    } catch {
      toastService.error(listCopy.loadError);
    }
  };

  const handleDelete = (id: string) => {
    if (!window.confirm(listCopy.deleteConfirm)) return;
    deleteCert(id);
  };

  return (
    <div className="shadow-2xs overflow-hidden rounded-2xl border border-border/60 bg-card">
      <ModulePageHeader
        elevated={false}
        className="mb-0 border-b border-border/50 bg-muted/20 p-5 px-6"
        title={copy.section.title}
        description={copy.section.subtitle}
        icon={Award}
        iconTileClassName="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
        actions={
          onAddClick ? (
            <Button type="button" onClick={onAddClick} className="shrink-0 gap-1.5 shadow-sm">
              <Plus className="size-4" />
              {listCopy.addCta}
            </Button>
          ) : null
        }
      />

      {isLoading ? (
        <CardContent className="flex items-center justify-center gap-2 py-14 text-sm text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden />
          {listCopy.loading}
        </CardContent>
      ) : isError ? (
        <CardContent className="border-t border-dashed border-border py-12 text-center text-sm text-muted-foreground">
          {listCopy.loadError}
        </CardContent>
      ) : certifications.length ? (
        <CardContent className="overflow-x-auto p-0">
          <Table className="min-w-[720px]">
            <TableHeader className="bg-muted/50">
              <TableRow className="whitespace-nowrap text-muted-foreground hover:bg-transparent">
                <TableHead className="h-12 pl-6 font-medium">{listCopy.columns.type}</TableHead>
                <TableHead className="h-12 font-medium">{listCopy.columns.authority}</TableHead>
                <TableHead className="h-12 font-medium">{listCopy.columns.expiry}</TableHead>
                <TableHead className="h-12 font-medium">{listCopy.columns.status}</TableHead>
                <TableHead className="h-12 pr-6 font-medium">{listCopy.columns.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certifications.map((cert) => (
                <TableRow
                  key={cert.id}
                  className="border-border/60 transition-colors hover:bg-muted/30"
                >
                  <TableCell className="px-6 py-4 font-semibold text-foreground">
                    {copy.types[cert.certType]}
                    {cert.certNumber ? (
                      <p className="mt-1 text-xs font-medium text-muted-foreground/70">
                        {cert.certNumber}
                      </p>
                    ) : null}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-[13px] font-medium text-muted-foreground">
                    {cert.issuingAuthority}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-[13px] font-medium text-muted-foreground">
                    {new Date(cert.expiryDate).toLocaleDateString(toIntlLocale(locale))}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide",
                        statusClassName(cert.status),
                      )}
                    >
                      {copy.status[cert.status]}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 rounded-md px-3 text-xs font-semibold shadow-sm"
                        onClick={() => void handleViewDocument(cert.documentUrl)}
                      >
                        <ExternalLink className="size-3.5" />
                        {listCopy.viewDocument}
                      </Button>
                      {onEditClick ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1.5 rounded-md px-3 text-xs font-semibold shadow-sm"
                          onClick={() => onEditClick(cert)}
                        >
                          <Pencil className="size-3.5" />
                          {listCopy.edit}
                        </Button>
                      ) : null}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1.5 rounded-md px-3 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
                        disabled={isDeleting}
                        onClick={() => handleDelete(cert.id)}
                      >
                        <Trash2 className="size-3.5" />
                        {listCopy.delete}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      ) : (
        <CardContent className="flex flex-col items-center gap-4 px-6 py-14 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <Award className="size-7" />
          </span>
          <div className="max-w-sm space-y-2">
            <p className="text-base font-bold text-foreground">{listCopy.emptyTitle}</p>
            <p className="text-[13px] font-medium leading-relaxed text-muted-foreground">
              {listCopy.emptyDescription}
            </p>
          </div>
          {onAddClick ? (
            <Button
              type="button"
              onClick={onAddClick}
              className="mt-2 gap-1.5 rounded-lg font-semibold shadow-sm"
            >
              <Plus className="size-4" />
              {listCopy.addCta}
            </Button>
          ) : null}
        </CardContent>
      )}
    </div>
  );
}
