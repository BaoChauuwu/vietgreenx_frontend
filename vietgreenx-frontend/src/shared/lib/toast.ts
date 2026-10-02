// src/shared/lib/toast.ts
// -----------------------------------------------------------------------------
// Framework-agnostic toast facade over Sonner.
//
// WHY a wrapper instead of importing `sonner` directly everywhere?
//   1. Decoupling: if we swap Sonner for another lib, we change ONE file.
//   2. Callable from non-React code: API interceptors, service factories,
//      and plain utilities can trigger toasts without hooks.
//   3. Consistent UX: centralized default durations / copy / promise handling.
// -----------------------------------------------------------------------------
import { toast as sonner, type ExternalToast } from "sonner";

export const toastService = {
  success(message: string, opts?: ExternalToast) {
    return sonner.success(message, opts);
  },

  error(message: string, opts?: ExternalToast) {
    return sonner.error(message, { duration: 6000, ...opts });
  },

  info(message: string, opts?: ExternalToast) {
    return sonner.info(message, opts);
  },

  loading(message: string, opts?: ExternalToast) {
    return sonner.loading(message, opts);
  },

  /**
   * Bind a toast lifecycle to a promise: loading -> success | error.
   * Great for mutations: `toastService.promise(createPost(data), {...})`.
   */
  promise<T>(
    promise: Promise<T>,
    msgs: { loading: string; success: string; error: string },
  ) {
    return sonner.promise(promise, msgs);
  },

  dismiss(id?: string | number) {
    return sonner.dismiss(id);
  },
};
