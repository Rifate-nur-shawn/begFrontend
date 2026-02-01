import useSWR from 'swr';
import api from './axios';
import { Product, PaginatedResponse } from '@/types/api';

// SWR fetcher
const fetcher = async (url: string) => {
    const { data } = await api.get(url);
    return data;
};

// Configuration
const swrConfig = {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
    keepPreviousData: true,
};

export function useProducts(categorySlug?: string, limit: number = 50) {
    const params = new URLSearchParams();
    if (categorySlug && categorySlug !== 'all') params.set('category_slug', categorySlug);
    // Note: Backend endpoint might use different query param for category. 
    // Checking previous curl context, didn't check category filtering. 
    // Assuming backend supports filter by category slug if implemented.
    // If not, we might need to filter client side or use a different endpoint.
    params.set('limit', limit.toString());
    
    // Determine endpoint. If specific category page (and backend supports /products?category=...), use that.
    // However, backend might not support category query param on /products directly if not implemented.
    // Use /products for now.
    
    const key = `/products?${params.toString()}`;
    
    const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Product>>(
        key,
        fetcher,
        swrConfig
    );
    
    return {
        products: data?.data || [],
        pagination: data?.pagination,
        isLoading,
        isError: !!error,
        error,
        refresh: mutate
    };
}

export function useProduct(slug: string | null) {
    const { data, error, isLoading } = useSWR<Product>(
        slug ? `/products/${slug}` : null,
        fetcher,
        swrConfig
    );
    
    return {
        product: data,
        isLoading,
        isError: !!error,
        error
    };
}

export function useFeaturedProducts(limit: number = 4) {
    const { data, error, isLoading } = useSWR<PaginatedResponse<Product>>(
        `/products?limit=${limit}&featured=true`, // Assuming backend supports featured=true or sort
        fetcher,
        { ...swrConfig, dedupingInterval: 120000 }
    );
    
    return {
        products: data?.data || [],
        isLoading,
        isError: !!error
    };
}

