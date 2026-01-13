import useSWR from 'swr';
import api from './axios';

// Types
interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    salePrice?: number;
    media?: {
        images?: string[];
    };
    category?: {
        id: string;
        name: string;
        slug: string;
    };
    specifications?: Record<string, string>;
}

interface PaginatedResponse {
    data: Product[];
    pagination: {
        page: number;
        size: number;
        total: number;
        totalPages: number;
    };
}

// SWR fetcher using axios
const fetcher = async (url: string) => {
    const { data } = await api.get(url);
    return data;
};

// Configuration for SWR - aggressive caching for performance
const swrConfig = {
    revalidateOnFocus: false,  // Don't refetch when window regains focus
    revalidateIfStale: false,  // Use cached data even if stale
    dedupingInterval: 60000,   // Dedupe requests for 60 seconds
    focusThrottleInterval: 60000,
    keepPreviousData: true,    // Keep showing old data while loading new
};

/**
 * Hook to fetch all products with optional category filter
 * Uses SWR for caching and automatic revalidation
 */
export function useProducts(categorySlug?: string, limit: number = 50) {
    const params = new URLSearchParams();
    if (categorySlug) params.set('category_slug', categorySlug);
    params.set('limit', limit.toString());
    
    const key = `/products?${params.toString()}`;
    
    const { data, error, isLoading, mutate } = useSWR<PaginatedResponse>(
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

/**
 * Hook to fetch a single product by slug
 * Uses SWR for caching
 */
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

/**
 * Hook to fetch featured products for homepage
 * Cached aggressively since homepage loads frequently
 */
export function useFeaturedProducts(limit: number = 4) {
    const { data, error, isLoading } = useSWR<PaginatedResponse>(
        `/products?limit=${limit}`,
        fetcher,
        {
            ...swrConfig,
            dedupingInterval: 120000,  // Cache for 2 minutes
        }
    );
    
    return {
        products: data?.data || [],
        isLoading,
        isError: !!error
    };
}

/**
 * Prefetch products for a category
 * Call this on hover/mouse enter to preload data
 */
export async function prefetchProducts(categorySlug: string) {
    try {
        await api.get(`/products?category_slug=${categorySlug}&limit=50`);
    } catch (e) {
        // Silent fail for prefetch
        console.debug('Prefetch failed:', e);
    }
}
