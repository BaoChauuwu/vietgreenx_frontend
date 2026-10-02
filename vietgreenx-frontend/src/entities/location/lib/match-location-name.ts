import type { AdminUnit } from "../model/location.types";

/** Normalize for fuzzy match between BE free-text and Open API labels. */
export function normalizeLocationName(value: string): string {
  return value.normalize("NFC").trim().toLowerCase().replace(/\s+/g, " ");
}

export function findUnitByName<T extends Pick<AdminUnit, "name">>(
  units: T[] | undefined,
  name: string | null | undefined,
): T | undefined {
  if (!units?.length || !name?.trim()) return undefined;

  const target = normalizeLocationName(name);
  return (
    units.find((unit) => normalizeLocationName(unit.name) === target) ??
    units.find((unit) => normalizeLocationName(unit.name).includes(target)) ??
    units.find((unit) => target.includes(normalizeLocationName(unit.name)))
  );
}

export function toLocationOptions(units: Pick<AdminUnit, "code" | "name">[]): {
  value: string;
  label: string;
}[] {
  return units.map((unit) => ({ value: String(unit.code), label: unit.name }));
}
