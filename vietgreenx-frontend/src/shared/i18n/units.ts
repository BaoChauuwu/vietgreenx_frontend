import type { AppLocale } from "./locale";

export interface UnitOption {
  value: string;
  label: string;
}

export const UNIT_OPTIONS: Record<AppLocale, UnitOption[]> = {
  vi: [
    { value: "kg", label: "kg" },
    { value: "tấn", label: "tấn" },
    { value: "tạ", label: "tạ" },
    { value: "yến", label: "yến" },
    { value: "thùng", label: "thùng" },
    { value: "bao", label: "bao" },
    { value: "hộp", label: "hộp" },
    { value: "túi", label: "túi" },
    { value: "chùm", label: "chùm" },
    { value: "quả", label: "quả" },
  ],
  en: [
    { value: "kg", label: "kg" },
    { value: "tấn", label: "ton" },
    { value: "tạ", label: "quintal (100kg)" },
    { value: "yến", label: "10kg" },
    { value: "thùng", label: "box" },
    { value: "bao", label: "bag" },
    { value: "hộp", label: "box" },
    { value: "túi", label: "bag/pouch" },
    { value: "chùm", label: "bunch" },
    { value: "quả", label: "piece" },
  ],
};

export function getUnitOptions(locale: AppLocale = "vi"): UnitOption[] {
  return UNIT_OPTIONS[locale] ?? UNIT_OPTIONS.vi;
}
