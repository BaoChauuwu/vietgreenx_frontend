import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

import { authTokenResponseSchema } from "@/shared/auth/auth-token.schema";
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  persistAuthSession,
} from "@/shared/auth/token-storage";
import { env } from "@/shared/config/env.mjs";
import { toastService } from "@/shared/lib/toast";
import { ROUTES } from "@/shared/routing";

import { unwrapResponseData } from "./unwrap-response";

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

function attachAuthHeader(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

function unwrapSuccessResponse<T>(payload: unknown): T {
  return unwrapResponseData<T>(payload);
}

export const api: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 15_000,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

export const publicApi: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 15_000,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(attachAuthHeader);

for (const client of [api, publicApi]) {
  client.interceptors.response.use((response) => {
    response.data = unwrapSuccessResponse(response.data);
    return response;
  });
}

let isRefreshing = false;
let pendingQueue: Array<(ok: boolean) => void> = [];

function flushQueue(ok: boolean) {
  pendingQueue.forEach((resolve) => resolve(ok));
  pendingQueue = [];
}

async function refreshSession(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const { data } = await publicApi.post<unknown>("/auth/refresh", { refreshToken });
    const tokens = authTokenResponseSchema.parse(data);
    persistAuthSession(tokens);
    return true;
  } catch {
    return false;
  }
}

function isAuthEndpoint(url: string | undefined): boolean {
  return Boolean(url?.includes("/auth/"));
}

function shouldGlobalToast(error: AxiosError, status: number | undefined): boolean {
  if (axios.isCancel(error)) return false;
  if (status === 400 || status === 422 || status === 401 || status === 404) return false;
  const url = error.config?.url;
  if (isAuthEndpoint(url) && status && status >= 400 && status < 500) return false;
  return true;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;

    const authEndpoint = isAuthEndpoint(original?.url);

    if (status === 401 && original && !original._retry && !authEndpoint) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push((ok) => (ok ? resolve(api(original)) : reject(error)));
        });
      }

      isRefreshing = true;
      const ok = await refreshSession();
      isRefreshing = false;
      flushQueue(ok);

      if (!ok) {
        clearAuthSession();
        toastService.error("Login session has expired. Please login again.");
        if (typeof window !== "undefined") window.location.assign(ROUTES.login);
        return Promise.reject(normalizeError(error, "Unauthorized"));
      }

      return api(original);
    }

    const message = resolveErrorMessage(error);
    if (shouldGlobalToast(error, status)) {
      toastService.error(message);
    }
    return Promise.reject(normalizeError(error, message));
  },
);

publicApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message = resolveErrorMessage(error);
    return Promise.reject(normalizeError(error, message));
  },
);

export interface NormalizedApiError {
  status?: number;
  message: string;
  raw: unknown;
}

export function resolveErrorMessage(error: AxiosError): string {
  const data = error.response?.data as { message?: string; error?: string } | undefined;
  if (data?.message) return data.message;
  if (data?.error) return data.error;
  if (error.code === "ECONNABORTED") return "Request timed out.";
  if (!error.response) return "Cannot connect to server.";
  return "An error occurred. Please try again.";
}

export function normalizeError(error: AxiosError, message: string): NormalizedApiError {
  return { status: error.response?.status, message, raw: error };
}

export function toNormalizedApiError(error: unknown): NormalizedApiError {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "raw" in error &&
    typeof (error as NormalizedApiError).message === "string"
  ) {
    return error as NormalizedApiError;
  }

  if (axios.isAxiosError(error)) {
    return normalizeError(error, resolveErrorMessage(error));
  }

  if (error instanceof Error) {
    return { message: error.message, raw: error };
  }

  return { message: "An error occurred. Please try again.", raw: error };
}

export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const res = await api.request<T>(config);
  return res.data;
}

export async function publicRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const res = await publicApi.request<T>(config);
  return res.data;
}
