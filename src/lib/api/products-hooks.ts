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

// Dummy luxury bag products for when backend is unavailable
const DUMMY_BAGS: Product[] = [
    {
        id: "velancis-tote-001",
        name: "Arcadie Leather Tote",
        slug: "arcadie-leather-tote",
        description: "Crafted from the finest Italian calfskin leather, the Arcadie Tote embodies timeless sophistication. Featuring hand-stitched detailing, gold-plated hardware, and a spacious suede-lined interior. Perfect for the modern woman who demands both elegance and functionality.",
        basePrice: 2850,
        salePrice: 2850,
        media: {
            images: [
                "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=1771&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop"
            ]
        },
        category: { id: "1", name: "Totes", slug: "totes" },
        specifications: {
            material: "Italian Calfskin Leather",
            dimensions: "30cm x 25cm x 12cm",
            weight: "680g",
            lining: "Suede",
            hardware: "Gold-plated brass"
        }
    },
    {
        id: "velancis-clutch-002",
        name: "Séraphine Evening Clutch",
        slug: "seraphine-evening-clutch",
        description: "A masterpiece of evening elegance. The Séraphine clutch features an intricately woven leather body with a magnetic closure adorned by a hand-set crystal clasp. An essential companion for galas, operas, and unforgettable nights.",
        basePrice: 1650,
        salePrice: 1485,
        media: {
            images: [
                "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1957&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1575032617751-6ddec2089882?q=80&w=1964&auto=format&fit=crop"
            ]
        },
        category: { id: "2", name: "Clutches", slug: "clutches" },
        specifications: {
            material: "Woven Lambskin",
            dimensions: "22cm x 12cm x 5cm",
            weight: "280g",
            closure: "Magnetic with crystal clasp"
        }
    },
    {
        id: "velancis-shoulder-003",
        name: "Élégance Shoulder Bag",
        slug: "elegance-shoulder-bag",
        description: "The quintessential day-to-evening transition piece. Supple pebbled leather meets architectural design in this versatile shoulder bag. Features an adjustable chain strap that converts to crossbody, and interior pockets for effortless organization.",
        basePrice: 2200,
        salePrice: 2200,
        media: {
            images: [
                "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1887&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1776&auto=format&fit=crop"
            ]
        },
        category: { id: "3", name: "Shoulder Bags", slug: "shoulder-bags" },
        specifications: {
            material: "Pebbled Leather",
            dimensions: "26cm x 18cm x 8cm",
            strap: "Adjustable chain, 45-65cm"
        }
    },
    {
        id: "velancis-mini-004",
        name: "Petite Royale Mini",
        slug: "petite-royale-mini",
        description: "Small in size, grand in presence. The Petite Royale is a micro-bag that makes a macro statement. Crafted from exotic embossed leather with a delicate gold chain, it carries your essentials with unparalleled style.",
        basePrice: 1350,
        salePrice: 1350,
        media: {
            images: [
                "https://images.unsplash.com/photo-1614179689702-355944cd0918?q=80&w=1887&auto=format&fit=crop"
            ]
        },
        category: { id: "4", name: "Mini Bags", slug: "mini-bags" },
        specifications: {
            material: "Exotic Embossed Leather",
            dimensions: "16cm x 10cm x 6cm",
            chain: "Gold-plated, 55cm"
        }
    },
    {
        id: "velancis-hobo-005",
        name: "Silhouette Hobo",
        slug: "silhouette-hobo",
        description: "Relaxed luxury at its finest. The Silhouette Hobo drapes beautifully in butter-soft nappa leather, creating an effortlessly chic crescent shape. A magnetic top closure and hidden interior pocket ensure security without sacrificing style.",
        basePrice: 1980,
        salePrice: 1782,
        media: {
            images: [
                "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1887&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1559563458-527698bf5295?q=80&w=1770&auto=format&fit=crop"
            ]
        },
        category: { id: "5", name: "Hobos", slug: "hobos" },
        specifications: {
            material: "Nappa Leather",
            dimensions: "38cm x 28cm x 10cm",
            closure: "Magnetic"
        }
    },
    {
        id: "velancis-crossbody-006",
        name: "Metropolitan Crossbody",
        slug: "metropolitan-crossbody",
        description: "Designed for the woman on the move. The Metropolitan combines urban practicality with refined aesthetics. Multiple compartments, an anti-theft hidden pocket, and an adjustable strap make it your perfect city companion.",
        basePrice: 1450,
        salePrice: 1450,
        media: {
            images: [
                "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=1963&auto=format&fit=crop"
            ]
        },
        category: { id: "6", name: "Crossbody", slug: "crossbody" },
        specifications: {
            material: "Grained Calfskin",
            dimensions: "24cm x 16cm x 7cm",
            strap: "Adjustable, 90-130cm"
        }
    }
];

// Wrapper function to provide fallback data
const dummyPaginatedResponse: PaginatedResponse = {
    data: DUMMY_BAGS,
    pagination: { page: 1, size: 50, total: DUMMY_BAGS.length, totalPages: 1 }
};

// SWR fetcher using axios with fallback
const fetcher = async (url: string) => {
    try {
        const { data } = await api.get(url);
        return data;
    } catch (error) {
        // Return dummy data on API failure
        console.log('API unavailable, using dummy bag data');
        if (url.includes('/products/')) {
            // Single product request
            const slug = url.split('/products/')[1]?.split('?')[0];
            return DUMMY_BAGS.find(b => b.slug === slug || b.id === slug);
        }
        return dummyPaginatedResponse;
    }
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
        products: data?.data || DUMMY_BAGS,
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
        products: data?.data || DUMMY_BAGS.slice(0, limit),
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

// Export dummy bags for direct access
export { DUMMY_BAGS };
