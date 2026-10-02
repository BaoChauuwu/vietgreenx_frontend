import { z } from "zod";

import type { AppLocale } from "@/shared/i18n/locale";

import { getCommentValidationCopy } from "../comment.constants";

function commentBodySchema(locale: AppLocale) {
  const validation = getCommentValidationCopy(locale);
  return z
    .string()
    .trim()
    .min(1, validation.bodyRequired)
    .max(500, validation.bodyMax);
}

export function createCommentBodySchema(locale: AppLocale) {
  return commentBodySchema(locale);
}

export function createCreateCommentInputSchema(locale: AppLocale) {
  return z.object({
    postId: z.string().uuid(),
    parentCommentId: z.string().uuid().optional(),
    body: commentBodySchema(locale),
  });
}

export function createUpdateCommentInputSchema(locale: AppLocale) {
  return z.object({
    body: commentBodySchema(locale),
  });
}

export function createCommentComposerSchema(locale: AppLocale) {
  return z.object({
    body: commentBodySchema(locale),
  });
}

export type CreateCommentInput = z.infer<ReturnType<typeof createCreateCommentInputSchema>>;
export type UpdateCommentInput = z.infer<ReturnType<typeof createUpdateCommentInputSchema>>;

export interface ListCommentsParams {
  postId: string;
  parentCommentId?: string;
  cursor?: string;
  limit?: number;
}
