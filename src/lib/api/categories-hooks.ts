"use client";

import useSWR from "swr";
import api from "./axios";
import { AdminCategory } from "@/types/admin-types";

const swrConfig = {
  revalidateOnFocus: true,
  revalidateOnMount: true,
  dedupingInterval: 5000,
};

const fetcher = (url: string) => api.get(url).then((res) => res.data);

// Get all categories (flat list)
export function useAdminCategories() {
  const { data, error, isLoading, mutate } = useSWR<AdminCategory[]>(
    "/admin/categories",
    fetcher,
    swrConfig
  );

  return {
    categories: data || [],
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Get category tree (nested structure)
export function useCategoryTree() {
  const { data, error, isLoading, mutate } = useSWR<AdminCategory[]>(
    "/admin/categories/tree",
    fetcher,
    swrConfig
  );

  return {
    tree: data || [],
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Create category
export interface CreateCategoryPayload {
  name: string;
  slug: string;
  parentId?: string | null;
  icon?: string;
  image?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  showInNav?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
}

export async function createCategory(payload: CreateCategoryPayload): Promise<AdminCategory> {
  const res = await api.post("/admin/categories", payload);
  return res.data;
}

// Update category
export async function updateCategory(id: string, payload: Partial<CreateCategoryPayload>): Promise<AdminCategory> {
  const res = await api.put(`/admin/categories/${id}`, payload);
  return res.data;
}

// Delete category
export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/admin/categories/${id}`);
}

// Reorder categories
export interface CategoryReorderItem {
  id: string;
  parentId: string | null;
  orderIndex: number;
}

export async function reorderCategories(items: CategoryReorderItem[]): Promise<void> {
  await api.post("/admin/categories/reorder", { items });
}
