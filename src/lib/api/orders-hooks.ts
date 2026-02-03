"use client";

import useSWR from "swr";
import api from "./axios";
import {
  AdminOrder,
  OrderFilter,
  OrderHistory,
  OrdersResponse,
  UpdateOrderStatusPayload,
  UpdatePaymentStatusPayload,
  RefundPayload,
} from "@/types/admin-types";

const swrConfig = {
  revalidateOnFocus: true,
  revalidateOnMount: true,
  dedupingInterval: 5000,
  keepPreviousData: true,
};

// Fetcher for SWR
const fetcher = (url: string) => api.get(url).then((res) => res.data);

// List orders with filters
export function useAdminOrders(filter: OrderFilter = {}) {
  const params = new URLSearchParams();
  if (filter.page) params.set("page", String(filter.page));
  if (filter.limit) params.set("limit", String(filter.limit));
  if (filter.status) params.set("status", filter.status);
  if (filter.payment_status) params.set("payment_status", filter.payment_status);
  if (filter.search) params.set("search", filter.search);
  if (filter.is_preorder !== undefined) params.set("is_preorder", String(filter.is_preorder));

  const queryString = params.toString();
  const url = `/admin/orders${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<OrdersResponse>(
    url,
    fetcher,
    swrConfig
  );

  return {
    orders: data?.orders || [],
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 20,
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Get single order
export function useAdminOrder(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<AdminOrder>(
    id ? `/admin/orders/${id}` : null,
    fetcher,
    swrConfig
  );

  return {
    order: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Get order history
export function useOrderHistory(orderId: string | null) {
  const { data, error, isLoading } = useSWR<OrderHistory[]>(
    orderId ? `/admin/orders/${orderId}/history` : null,
    fetcher,
    swrConfig
  );

  return {
    history: data || [],
    isLoading,
    isError: !!error,
  };
}

// Mutations
export async function updateOrderStatus(
  id: string,
  payload: UpdateOrderStatusPayload
): Promise<void> {
  await api.patch(`/admin/orders/${id}/status`, payload);
}

export async function updatePaymentStatus(
  id: string,
  payload: UpdatePaymentStatusPayload
): Promise<void> {
  await api.patch(`/admin/orders/${id}/payment-status`, payload);
}

export async function verifyPayment(id: string): Promise<void> {
  await api.post(`/admin/orders/${id}/verify-payment`);
}

export async function processRefund(
  id: string,
  payload: RefundPayload
): Promise<void> {
  await api.post(`/admin/orders/${id}/refund`, payload);
}
