import { z } from "zod";

import { postContentCategorySchema, postTagTypeSchema } from "@/entities/post";
import type { AppLocale } from "@/shared/i18n/locale";

import { getPostsValidationCopy } from "../posts.constants";

export const POST_TAG_MAX = 20;

export const postTagInputSchema = z.object({
  tagType: postTagTypeSchema,
  refId: z.string().uuid().optional(),
  refLabel: z.string().trim().min(1).max(255),
});

export function createPostComposerSchema(locale: AppLocale) {
  const v = getPostsValidationCopy(locale);

  return z.object({
    body: z.string().max(2000, v.bodyMax),
    category: postContentCategorySchema.optional(),
  });
}

export function createCreatePostInputSchema(locale: AppLocale) {
  const v = getPostsValidationCopy(locale);

  return z
    .object({
      body: z.string().max(2000).optional(),
      category: postContentCategorySchema.optional(),
      mediaIds: z.array(z.string().uuid()).max(9).optional(),
      tags: z.array(postTagInputSchema).max(POST_TAG_MAX).optional(),
    })
    .refine((data) => Boolean(data.body?.trim()) || (data.mediaIds?.length ?? 0) > 0, {
      message: v.bodyOrMediaRequired,
    });
}

export function createUpdatePostInputSchema(locale: AppLocale) {
  const v = getPostsValidationCopy(locale);

  return z.object({
    body: z.string().max(2000, v.bodyMax).optional(),
    category: postContentCategorySchema.optional(),
    mediaIds: z.array(z.string().uuid()).max(9).optional(),
    tags: z.array(postTagInputSchema).max(POST_TAG_MAX).optional(),
  });
}

export function createEditPostBodySchema(locale: AppLocale) {
  const v = getPostsValidationCopy(locale);

  return z.object({
    body: z.string().max(2000, v.bodyMax),
    category: postContentCategorySchema.optional(),
  });
}

export type PostTagInput = z.infer<typeof postTagInputSchema>;
export type CreatePostInput = z.infer<ReturnType<typeof createCreatePostInputSchema>>;
export type CreatePostComposerInput = z.infer<ReturnType<typeof createPostComposerSchema>>;
export type UpdatePostInput = z.infer<ReturnType<typeof createUpdatePostInputSchema>>;
export type EditPostBodyInput = z.infer<ReturnType<typeof createEditPostBodySchema>>;

export const POST_IMAGE_ACCEPT = "image/png,image/jpeg,image/webp";
export const POST_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

export function isAllowedPostImage(file: File): boolean {
  return /^image\/(png|jpe?g|webp)$/i.test(file.type);
}
