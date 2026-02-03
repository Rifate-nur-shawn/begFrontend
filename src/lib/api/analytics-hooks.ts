"use client";

import useSWR from "swr";
import api from "./axios";

const swrConfig = {
  revalidateOnFocus: true,
  dedupingInterval: 30000, // Cache analytics data longer
};

const fetcher = (url: string) => api.get(url).then((res) => res.data);

// Daily sales/revenue
export interface DailySales {
  date: string;
  revenue: number;
  orderCount: number;
}

export function useDailySales(days = 30) {
  const { data, error, isLoading } = useSWR<DailySales[]>(
    `/admin/stats/revenue?days=${days}`,
    fetcher,
    swrConfig
  );

  return {
    sales: data || [],
    isLoading,
    isError: !!error,
  };
}

// Revenue KPIs
export interface RevenueKPIs {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  todayRevenue: number;
  todayOrders: number;
  weekRevenue: number;
  weekOrders: number;
  monthRevenue: number;
  monthOrders: number;
}

export function useRevenueKPIs() {
  const { data, error, isLoading, mutate } = useSWR<RevenueKPIs>(
    "/admin/stats/kpis",
    fetcher,
    swrConfig
  );

  return {
    kpis: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Low stock products
export interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  threshold: number;
}

export function useLowStockProducts(limit = 10) {
  const { data, error, isLoading } = useSWR<LowStockProduct[]>(
    `/admin/stats/inventory/low-stock?limit=${limit}`,
    fetcher,
    swrConfig
  );

  return {
    products: data || [],
    isLoading,
    isError: !!error,
  };
}

// Dead stock products
export interface DeadStockProduct {
  id: string;
  name: string;
  stock: number;
  lastSoldAt: string | null;
}

export function useDeadStockProducts(limit = 10) {
  const { data, error, isLoading } = useSWR<DeadStockProduct[]>(
    `/admin/stats/inventory/dead-stock?limit=${limit}`,
    fetcher,
    swrConfig
  );

  return {
    products: data || [],
    isLoading,
    isError: !!error,
  };
}

// Top selling products
export interface TopSellingProduct {
  id: string;
  name: string;
  totalSold: number;
  revenue: number;
}

export function useTopSellingProducts(limit = 10, period = "month") {
  const { data, error, isLoading } = useSWR<TopSellingProduct[]>(
    `/admin/stats/products/top-selling?limit=${limit}&period=${period}`,
    fetcher,
    swrConfig
  );

  return {
    products: data || [],
    isLoading,
    isError: !!error,
  };
}

// Top customers
export interface TopCustomer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  totalOrders: number;
  totalSpent: number;
}

export function useTopCustomers(limit = 10) {
  const { data, error, isLoading } = useSWR<TopCustomer[]>(
    `/admin/stats/customers/top?limit=${limit}`,
    fetcher,
    swrConfig
  );

  return {
    customers: data || [],
    isLoading,
    isError: !!error,
  };
}

// Customer retention
export interface CustomerRetention {
  newCustomers: number;
  returningCustomers: number;
  retentionRate: number;
  period: string;
}

export function useCustomerRetention(period = "month") {
  const { data, error, isLoading } = useSWR<CustomerRetention>(
    `/admin/stats/customers/retention?period=${period}`,
    fetcher,
    swrConfig
  );

  return {
    retention: data,
    isLoading,
    isError: !!error,
  };
}
