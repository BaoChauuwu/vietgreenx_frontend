import { z } from "zod";

export const paginationMetaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export interface PaginatedResult<T> { data: T[]; pagination: PaginationMeta; }

export interface CursorPaginationMeta {
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
}
export interface CursorPaginatedResult<T> { data: T[]; pagination: CursorPaginationMeta; }

export function unwrapResponseData<T>(payload: unknown): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    const p = payload as { data: unknown; pagination?: unknown };
    if (p.pagination !== undefined) {
      return { data: p.data, pagination: p.pagination } as T;
    }
    return p.data as T;
  }
  return payload as T;
}
