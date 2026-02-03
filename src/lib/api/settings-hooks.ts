"use client";

import useSWR from "swr";
import api from "./axios";
import { 
  ShippingZone, 
  ConfigEnums, 
  CreateShippingZonePayload, 
  UpdateShippingZonePayload,
  ContentBlock,
  Coupon,
  CreateCouponPayload,
  UpdateCouponPayload,
  CouponsResponse
} from "@/types/admin-types";

const swrConfig = {
  revalidateOnFocus: true,
  revalidateOnMount: true,
  dedupingInterval: 5000,
};

const fetcher = (url: string) => api.get(url).then((res) => res.data);

// ============ SHIPPING ZONES ============

export function useShippingZones() {
  const { data, error, isLoading, mutate } = useSWR<ShippingZone[]>(
    "/admin/config/shipping-zones",
    fetcher,
    swrConfig
  );

  return {
    zones: data || [],
    isLoading,
    isError: !!error,
    mutate,
  };
}

export async function createShippingZone(
  payload: CreateShippingZonePayload
): Promise<ShippingZone> {
  const res = await api.post("/admin/config/shipping-zones", payload);
  return res.data;
}

export async function updateShippingZone(
  id: number,
  payload: UpdateShippingZonePayload
): Promise<ShippingZone> {
  const res = await api.patch(`/admin/config/shipping-zones/${id}`, payload);
  return res.data;
}

export async function deleteShippingZone(id: number): Promise<void> {
  await api.delete(`/admin/config/shipping-zones/${id}`);
}

// ============ CONFIG ENUMS ============

export function useConfigEnums() {
  const { data, error, isLoading } = useSWR<ConfigEnums>(
    "/admin/config/enums",
    fetcher,
    { ...swrConfig, dedupingInterval: 60000 }
  );

  return {
    enums: data,
    isLoading,
    isError: !!error,
  };
}

// ============ CONTENT BLOCKS ============

export function useContentBlock(key: string | null) {
  const { data, error, isLoading, mutate } = useSWR<ContentBlock>(
    key ? `/content/${key}` : null,
    fetcher,
    swrConfig
  );

  return {
    content: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}

export async function upsertContent(
  key: string,
  content: Record<string, unknown>
): Promise<ContentBlock> {
  const res = await api.put(`/admin/content/${key}`, content);
  return res.data;
}

// ============ COUPONS ============
// Note: Backend routes are currently commented out, but we prepare the frontend

export function useCoupons(page = 1, limit = 20) {
  const { data, error, isLoading, mutate } = useSWR<CouponsResponse>(
    `/admin/coupons?page=${page}&limit=${limit}`,
    fetcher,
    swrConfig
  );

  return {
    coupons: data?.coupons || [],
    total: data?.total || 0,
    isLoading,
    isError: !!error,
    mutate,
  };
}

export function useCoupon(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Coupon>(
    id ? `/admin/coupons/${id}` : null,
    fetcher,
    swrConfig
  );

  return {
    coupon: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}

export async function createCoupon(payload: CreateCouponPayload): Promise<Coupon> {
  const res = await api.post("/admin/coupons", payload);
  return res.data;
}

export async function updateCoupon(id: string, payload: UpdateCouponPayload): Promise<Coupon> {
  const res = await api.put(`/admin/coupons/${id}`, payload);
  return res.data;
}

export async function deleteCoupon(id: string): Promise<void> {
  await api.delete(`/admin/coupons/${id}`);
}
