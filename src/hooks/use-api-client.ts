"use client";

import { useCallback } from "react";
import { useSession } from "next-auth/react";
import { apiRequest, type ApiRequestOptions } from "@/lib/constants";

export function useApiClient() {
  const { data: session, status } = useSession();
  const token = session?.user?.accessToken;

  const request = useCallback(
    (route: string, options: ApiRequestOptions = {}) =>
      apiRequest(route, {
        ...options,
        token: options.token ?? token,
      }),
    [token],
  );

  return {
    request,
    token,
    status,
    isAuthenticated: status === "authenticated" && Boolean(session?.user),
    isSessionLoading: status === "loading",
  };
}
