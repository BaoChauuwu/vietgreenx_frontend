export const PHONE_REGEX = /^(0|\+84)[3-9]\d{8}$/;

export function normalizePhone(raw: string): string {
  const trimmed = raw.trim().replace(/\s/g, "");
  if (trimmed.startsWith("+84")) return `0${trimmed.slice(3)}`;
  if (/^84[3-9]\d{8}$/.test(trimmed)) return `0${trimmed.slice(2)}`;
  return trimmed;
}

export function isValidPhone(raw: string): boolean {
  return PHONE_REGEX.test(normalizePhone(raw));
}

export function isPhoneIdentifier(identifier: string): boolean {
  return /^[0-9+]/.test(identifier.trim());
}
