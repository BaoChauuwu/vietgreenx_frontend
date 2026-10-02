"use client";

import {
  useMutation,
  type MutationFunctionContext,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { useRef } from "react";

export function useSingleFlightMutation<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
): UseMutationResult<TData, TError, TVariables, TContext> {
  const inFlightRef = useRef<Promise<TData> | null>(null);
  const { mutationFn, ...rest } = options;

  return useMutation({
    ...rest,
    mutationFn: async (variables: TVariables, context: MutationFunctionContext) => {
      if (!mutationFn) {
        throw new Error("useSingleFlightMutation requires mutationFn");
      }

      if (inFlightRef.current) {
        return inFlightRef.current;
      }

      const promise = Promise.resolve(mutationFn(variables, context)).finally(() => {
        if (inFlightRef.current === promise) {
          inFlightRef.current = null;
        }
      });

      inFlightRef.current = promise;
      return promise;
    },
  });
}
