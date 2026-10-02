import type { UseFormSetError, FieldValues, Path } from "react-hook-form";

import { toNormalizedApiError, type NormalizedApiError } from "@/shared/api/api";
import type { AppLocale } from "@/shared/i18n/locale";
import { DEFAULT_LOCALE } from "@/shared/i18n/locale";

import {
  getAuthErrorMessage,
  isEmailAlreadyExistsError,
  isPhoneAlreadyExistsError,
  type AuthErrorContext,
} from "./auth-errors";

type AuthFormField = "email" | "phone" | "identifier";

interface ApplyAuthFormErrorOptions<T extends FieldValues> {
  setError: UseFormSetError<T>;
  field?: AuthFormField;
  context: AuthErrorContext;
  locale?: AppLocale;
  /** Toast for errors that are not mapped to a form field (network, 500). */
  onToast?: (message: string) => void;
}

/** Map API error → inline field error (auth forms). Toast only when no field mapping. */
export function applyAuthFormError<T extends FieldValues>(
  error: unknown,
  { setError, field, context, locale = DEFAULT_LOCALE, onToast }: ApplyAuthFormErrorOptions<T>,
): NormalizedApiError {
  const normalized = toNormalizedApiError(error);
  const message = getAuthErrorMessage(normalized, context, locale);

  const targetField = resolveAuthFormField(normalized, field);
  if (targetField) {
    setError(targetField as Path<T>, { type: "server", message });
    return normalized;
  }

  if (context === "verifyEmail") {
    setError("root" as Path<T>, { type: "server", message });
    return normalized;
  }

  if (onToast) onToast(message);
  return normalized;
}

function resolveAuthFormField(
  error: NormalizedApiError,
  preferred?: AuthFormField,
): AuthFormField | undefined {
  if (isEmailAlreadyExistsError(error)) return "email";
  if (isPhoneAlreadyExistsError(error)) return "phone";
  if (!preferred) return undefined;
  if (!error.status || error.status >= 500) return undefined;
  return preferred;
}

export function shouldShowLoginLink(error: unknown): boolean {
  const normalized = toNormalizedApiError(error);
  return isEmailAlreadyExistsError(normalized) || isPhoneAlreadyExistsError(normalized);
}
