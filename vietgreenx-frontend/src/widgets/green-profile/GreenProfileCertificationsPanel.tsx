"use client";

import { useState } from "react";

import type { Certification } from "@/entities/certification";
import type { GreenProfile } from "@/entities/green-profile";
import {
  CertificationCreateDialog,
  CertificationEditDialog,
  CertificationListShell,
  useCertifications,
} from "@/features/certification";
import type { AppLocale } from "@/shared/i18n/locale";
import { getClientLocale } from "@/shared/i18n/get-client-locale";

interface GreenProfileCertificationsPanelProps {
  profile: GreenProfile;
  locale?: AppLocale;
}

export function GreenProfileCertificationsPanel({
  profile,
  locale = getClientLocale(),
}: GreenProfileCertificationsPanelProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const { data: certifications, isLoading, isError } = useCertifications(profile.id);

  return (
    <>
      <CertificationCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        greenProfileId={profile.id}
        locale={locale}
      />
      <CertificationEditDialog
        open={Boolean(editingCertification)}
        onOpenChange={(open) => {
          if (!open) setEditingCertification(null);
        }}
        certification={editingCertification}
        greenProfileId={profile.id}
        locale={locale}
      />
      <CertificationListShell
        locale={locale}
        greenProfileId={profile.id}
        certifications={certifications}
        isLoading={isLoading}
        isError={isError}
        onAddClick={() => setCreateOpen(true)}
        onEditClick={setEditingCertification}
      />
    </>
  );
}
