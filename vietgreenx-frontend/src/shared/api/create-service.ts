import type { AxiosRequestConfig } from "axios";
import type { ZodType, ZodTypeDef } from "zod";

import { request, publicRequest } from "./api";
import { type CursorPaginatedResult, type PaginatedResult } from "./unwrap-response";

export function parseApiResponse<T>(data: unknown, schema?: ZodType<T, ZodTypeDef, unknown>): T {
  if (!schema) return data as T;

  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(
      "[API contract violation details]:",
      JSON.stringify(result.error.errors, null, 2),
    );
    throw new Error("Data returned from the server is not valid.");
  }
  return result.data;
}

function parsePaginated<T>(data: unknown, itemSchema: ZodType<T>): PaginatedResult<T> {
  const raw = data as {
    data?: unknown[] | null;
    items?: unknown[] | null;
    pagination?: {
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
      totalPage?: number;
    };
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    totalPage?: number;
  };

  const itemsArr = raw.data ?? raw.items ?? [];
  const items = itemsArr.map((item) => parseApiResponse<T>(item, itemSchema));

  const page = raw.pagination?.page ?? raw.page ?? 1;
  const limit = raw.pagination?.limit ?? raw.limit ?? 20;
  const total = raw.pagination?.total ?? raw.total ?? items.length;
  const totalPages =
    raw.pagination?.totalPages ??
    raw.pagination?.totalPage ??
    raw.totalPages ??
    raw.totalPage ??
    (limit > 0 ? Math.ceil(total / limit) : 1);

  return {
    data: items,
    pagination: { page, limit, total, totalPages },
  };
}

function parseCursorPaginated<T>(data: unknown, itemSchema: ZodType<T>): CursorPaginatedResult<T> {
  // BE returns flat shape: { items: T[], nextCursor: string | null, hasNext: boolean, limit: number }
  const raw = data as {
    items: unknown[] | null;
    nextCursor: string | null;
    hasNext: boolean;
    limit: number;
  };
  const items = (raw.items ?? []).map((item) => parseApiResponse<T>(item, itemSchema));
  return {
    data: items,
    pagination: { nextCursor: raw.nextCursor ?? null, hasMore: raw.hasNext, limit: raw.limit },
  };
}

export interface ServiceMethodOptions<T> {
  schema?: ZodType<T, ZodTypeDef, unknown>;
}

export function createService(resource: string, serviceConfig?: { auth?: boolean }) {
  const url = (path = "") => `${resource}${path}`;
  const req = serviceConfig?.auth === false ? publicRequest : request;

  return {
    async get<T>(path = "", config?: AxiosRequestConfig, opts?: ServiceMethodOptions<T>) {
      return parseApiResponse<T>(
        await req({ method: "GET", url: url(path), ...config }),
        opts?.schema,
      );
    },

    async getPaginated<T>(
      path = "",
      itemSchema: ZodType<T>,
      config?: AxiosRequestConfig,
    ): Promise<PaginatedResult<T>> {
      const data = await req({ method: "GET", url: url(path), ...config });
      return parsePaginated<T>(data, itemSchema);
    },

    async getCursorPaginated<T>(
      path = "",
      itemSchema: ZodType<T>,
      config?: AxiosRequestConfig,
    ): Promise<CursorPaginatedResult<T>> {
      const data = await req({ method: "GET", url: url(path), ...config });
      return parseCursorPaginated<T>(data, itemSchema);
    },

    async post<T, B = unknown>(path = "", body?: B, opts?: ServiceMethodOptions<T>) {
      return parseApiResponse<T>(
        await req({ method: "POST", url: url(path), data: body }),
        opts?.schema,
      );
    },

    async put<T, B = unknown>(path = "", body?: B, opts?: ServiceMethodOptions<T>) {
      return parseApiResponse<T>(
        await req({ method: "PUT", url: url(path), data: body }),
        opts?.schema,
      );
    },

    async patch<T, B = unknown>(path = "", body?: B, opts?: ServiceMethodOptions<T>) {
      return parseApiResponse<T>(
        await req({ method: "PATCH", url: url(path), data: body }),
        opts?.schema,
      );
    },

    async delete<T>(path = "", config?: AxiosRequestConfig, opts?: ServiceMethodOptions<T>) {
      return parseApiResponse<T>(
        await req({ method: "DELETE", url: url(path), ...config }),
        opts?.schema,
      );
    },
  };
}

export function createPublicService(resource: string) {
  return createService(resource, { auth: false });
}
