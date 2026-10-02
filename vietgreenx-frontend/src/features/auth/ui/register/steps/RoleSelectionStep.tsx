"use client";

import { Combobox } from "@/shared/ui/combobox";
import { Label } from "@/shared/ui/label";

import { getAuthCopy, getRegisterRoles, type RegisterRoleId } from "../../../auth.constants";
import type { AppLocale } from "@/shared/i18n/locale";

interface RoleSelectionStepProps {
  locale: AppLocale;
  value?: RegisterRoleId;
  error?: string;
  onSelect?: (id: RegisterRoleId) => void;
}

export function RoleSelectionStep({ locale, value, error, onSelect }: RoleSelectionStepProps) {
  const { roleSelection } = getAuthCopy(locale).register;
  const roles = getRegisterRoles(locale);

  const options = roles.map((r) => ({ value: r.id, label: r.title }));

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{roleSelection.title}</Label>
      <Combobox
        options={options}
        value={value ?? ""}
        onValueChange={(v) => onSelect?.(v as RegisterRoleId)}
        placeholder={roleSelection.placeholder}
        searchPlaceholder={roleSelection.searchPlaceholder}
        emptyText={roleSelection.emptyText}
        className="[&_button]:h-[56px] [&_button]:rounded-[14px] [&_button]:border-border [&_button]:bg-neutral-100 [&_button]:px-4 [&_button]:text-sm"
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
