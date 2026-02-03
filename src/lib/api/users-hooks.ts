"use client";

import useSWR from "swr";
import api from "./axios";
import { UserFilter, UsersResponse } from "@/types/admin-types";

const swrConfig = {
  revalidateOnFocus: true,
  revalidateOnMount: true,
  dedupingInterval: 5000,
  keepPreviousData: true,
};

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useAdminUsers(filter: UserFilter = {}) {
  const params = new URLSearchParams();
  if (filter.page) params.set("page", String(filter.page));
  if (filter.limit) params.set("limit", String(filter.limit));

  const queryString = params.toString();
  const url = `/admin/users${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<UsersResponse>(
    url,
    fetcher,
    swrConfig
  );

  return {
    users: data?.users || [],
    meta: data?.meta || { total: 0, page: 1, limit: 10, totalPages: 0 },
    isLoading,
    isError: !!error,
    mutate,
  };
}
