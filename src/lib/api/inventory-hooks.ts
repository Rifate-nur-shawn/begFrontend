"use client";

import useSWR from "swr";
import api from "./axios";
import { InventoryLog, ProductStats } from "@/types/admin-types";

const swrConfig = {
  revalidateOnFocus: true,
  revalidateOnMount: true,
  dedupingInterval: 5000,
};

const fetcher = (url: string) => api.get(url).then((res) => res.data);

// Get product stats
export function useProductStats() {
  const { data, error, isLoading, mutate } = useSWR<ProductStats>(
    "/admin/products/stats",
    fetcher,
    { ...swrConfig, dedupingInterval: 30000 }
  );

  return {
    stats: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Get inventory logs
export function useInventoryLogs(page = 1, limit = 20) {
  const { data, error, isLoading, mutate } = useSWR<{
    logs: InventoryLog[];
    total: number;
  }>(
    `/admin/inventory/logs?page=${page}&limit=${limit}`,
    fetcher,
    swrConfig
  );

  return {
    logs: data?.logs || [],
    total: data?.total || 0,
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Get variant inventory list
export interface VariantInventory {
  variantId: string;
  productId: string;
  productName: string;
  sku: string;
  size: string;
  color: string;
  stock: number;
  lowStockThreshold: number;
}

export function useVariantInventory() {
  const { data, error, isLoading, mutate } = useSWR<VariantInventory[]>(
    "/admin/inventory/variants",
    fetcher,
    swrConfig
  );

  return {
    variants: data || [],
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Adjust stock
export interface StockAdjustmentPayload {
  variantId: string;
  quantity: number; // positive = add, negative = subtract
  reason: string;
  note?: string;
}

export async function adjustStock(payload: StockAdjustmentPayload): Promise<void> {
  await api.post("/admin/inventory/adjust", payload);
}
