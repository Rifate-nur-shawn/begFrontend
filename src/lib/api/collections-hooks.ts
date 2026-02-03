"use client";

import useSWR from "swr";
import api from "./axios";
import { AdminCollection } from "@/types/admin-types";

const swrConfig = {
  revalidateOnFocus: true,
  revalidateOnMount: true,
  dedupingInterval: 5000,
};

const fetcher = (url: string) => api.get(url).then((res) => res.data);

// Get all collections
export function useAdminCollections() {
  const { data, error, isLoading, mutate } = useSWR<AdminCollection[]>(
    "/admin/collections",
    fetcher,
    swrConfig
  );

  return {
    collections: data || [],
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Create/Update payload
export interface CollectionPayload {
  title: string;
  slug: string;
  description?: string;
  image?: string;
  story?: string;
  isActive?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
}

export async function createCollection(payload: CollectionPayload): Promise<AdminCollection> {
  const res = await api.post("/admin/collections", payload);
  return res.data;
}

export async function updateCollection(id: string, payload: Partial<CollectionPayload>): Promise<AdminCollection> {
  const res = await api.put(`/admin/collections/${id}`, payload);
  return res.data;
}

export async function deleteCollection(id: string): Promise<void> {
  await api.delete(`/admin/collections/${id}`);
}

// Manage products in collection
export async function manageCollectionProducts(
  collectionId: string,
  action: "add" | "remove",
  productIds: string[]
): Promise<void> {
  await api.post(`/admin/collections/${collectionId}/products`, {
    action,
    productIds,
  });
}
