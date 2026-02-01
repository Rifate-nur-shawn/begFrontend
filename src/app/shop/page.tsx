"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { productApi } from "@/lib/api/products";
import { Category, Product } from "@/types/api";
import ProductCard from "@/components/shop/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

export default function ShopPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // URL Params
    const categoryParam = searchParams?.get("category");
    const sortParam = searchParams?.get("sort") || "newest";
    const minPriceParam = searchParams?.get("min_price");
    const maxPriceParam = searchParams?.get("max_price");
    const searchQuery = searchParams?.get("q");

    // State
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const limit = 20;

    // Filters State (Local)
    const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || "");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [sort, setSort] = useState(sortParam);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Initial Data Fetch (Categories)
    useEffect(() => {
        const loadCategories = async () => {
             try {
                 const data = await productApi.getCategories();
                 setCategories(data);
             } catch (err) {
                 console.error("Failed to load categories", err);
             }
        };
        loadCategories();
    }, []);

    // Sync URL to Local State
    useEffect(() => {
        setSelectedCategory(categoryParam || "");
        setSort(sortParam);
        if (minPriceParam && maxPriceParam) {
            setPriceRange([Number(minPriceParam), Number(maxPriceParam)]);
        }
    }, [categoryParam, sortParam, minPriceParam, maxPriceParam]);

    // Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const params: any = {
                    page,
                    limit,
                    sort,
                };
                
                if (selectedCategory && selectedCategory !== 'all') {
                    params.category_slug = selectedCategory;
                }
                
                if (searchQuery) {
                    params.q = searchQuery;
                }

                // Only send price params if modified from default/0
                if (priceRange[0] > 0) params.min_price = priceRange[0];
                if (priceRange[1] < 1000) params.max_price = priceRange[1]; // Assuming 1000 is generic max

                const response = await productApi.getAll(params);
                setProducts(response.data);
                setTotal(response.pagination.total);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setIsLoading(false);
            }
        };

        // Debounce to prevent rapid calls during slider move (if we had live slider)
        const timeout = setTimeout(() => {
            fetchProducts();
        }, 300);

        return () => clearTimeout(timeout);
    }, [page, selectedCategory, sort, priceRange, searchQuery]);

    // Handlers
    const handleCategoryChange = (slug: string) => {
        setSelectedCategory(slug);
        setPage(1);
        updateUrl({ category: slug === 'all' ? null : slug, page: "1" });
    };

    const handleSortChange = (newSort: string) => {
        setSort(newSort);
        updateUrl({ sort: newSort });
    };

    const updateUrl = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams?.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        router.push(`/shop?${params.toString()}`);
    };

    return (
        <div className="min-h-screen pt-32 pb-24 px-4 md:px-8 max-w-[1920px] mx-auto bg-white text-black">
            
            {/* Header */}
            <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-neutral-100 pb-8">
                <div>
                    <span className="font-utility text-[10px] tracking-widest uppercase text-neutral-400 mb-2 block">
                        {searchQuery ? `Search Results: "${searchQuery}"` : "Shop All"}
                    </span>
                    <h1 className="font-display text-4xl md:text-5xl">
                        {selectedCategory && selectedCategory !== 'all' 
                            ? categories.find(c => c.slug === selectedCategory)?.name || "Category" 
                            : "All Products"}
                    </h1>
                     <p className="font-utility text-xs text-neutral-500 mt-2">
                        {total} {total === 1 ? 'Product' : 'Products'} Found
                    </p>
                </div>

                <div className="flex gap-4">
                     {/* Mobile Filter Toggle */}
                     <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="md:hidden flex items-center gap-2 px-4 py-2 border border-neutral-200 text-[10px] uppercase tracking-widest hover:border-black transition-colors"
                     >
                        Filters <span className="text-neutral-400">+</span>
                     </button>

                     {/* Sort Dropdown */}
                     <div className="relative group">
                         <select 
                            value={sort}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="appearance-none bg-transparent border-none outline-none font-utility text-[10px] uppercase tracking-widest cursor-pointer pr-6 py-2 text-right hover:text-neutral-600"
                         >
                             <option value="newest">Newest</option>
                             <option value="price_asc">Price: Low to High</option>
                             <option value="price_desc">Price: High to Low</option>
                         </select>
                         <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                             <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                             </svg>
                         </div>
                     </div>
                </div>
            </div>

            <div className="flex gap-12">
                {/* Sidebar Filters - Desktop */}
                <aside className={`
                    fixed inset-y-0 left-0 z-40 w-80 bg-white p-8 shadow-2xl transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:w-64 md:shadow-none md:p-0 md:bg-transparent
                    ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}
                `}>
                    <div className="flex justify-between items-center md:hidden mb-8">
                        <span className="font-display text-xl">Filters</span>
                        <button onClick={() => setIsFilterOpen(false)} className="p-2">✕</button>
                    </div>

                    <div className="space-y-10">
                        {/* Categories */}
                        <div>
                            <h3 className="font-utility text-[10px] uppercase tracking-widest text-neutral-400 mb-4">Categories</h3>
                            <ul className="space-y-3">
                                <li>
                                    <button 
                                        onClick={() => handleCategoryChange('all')}
                                        className={`text-sm transition-colors text-left w-full hover:text-black ${!selectedCategory || selectedCategory === 'all' ? 'text-black font-medium' : 'text-neutral-500'}`}
                                    >
                                        All Products
                                    </button>
                                </li>
                                {categories.map(cat => (
                                    <li key={cat.id}>
                                         <button 
                                            onClick={() => handleCategoryChange(cat.slug)}
                                            className={`text-sm transition-colors text-left w-full hover:text-black ${selectedCategory === cat.slug ? 'text-black font-medium' : 'text-neutral-500'}`}
                                        >
                                            {cat.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Price Filter (Simplified for now - can be Range Slider later) */}
                        {/* <div>
                            <h3 className="font-utility text-[10px] uppercase tracking-widest text-neutral-400 mb-4">Price</h3>
                            <div className="space-y-3">
                                // ... range slider inputs if needed
                            </div>
                        </div> */}
                    </div>
                </aside>

                {/* Overlay for mobile */}
                {isFilterOpen && (
                    <div 
                        className="fixed inset-0 bg-black/20 z-30 md:hidden backdrop-blur-sm"
                        onClick={() => setIsFilterOpen(false)}
                    />
                )}

                {/* Product Grid */}
                <div className="flex-1">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="space-y-4 animate-pulse">
                                    <div className="aspect-[3/4] bg-neutral-100" />
                                    <div className="h-4 w-2/3 bg-neutral-100" />
                                    <div className="h-3 w-1/3 bg-neutral-100" />
                                </div>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                                <AnimatePresence mode='popLayout'>
                                    {products.map((product) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Pagination */}
                            {/* Assuming total & limit are working, we can add pagination controls here */}
                             <div className="mt-16 flex justify-center gap-2">
                                {[...Array(Math.ceil(total / limit))].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPage(i + 1)}
                                        className={`w-8 h-8 flex items-center justify-center text-[10px] border transition-colors ${
                                            page === i + 1 
                                                ? "border-black bg-black text-white" 
                                                : "border-neutral-200 text-neutral-500 hover:border-black hover:text-black"
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="py-24 text-center">
                            <h3 className="font-display text-xl mb-2">No products found</h3>
                            <p className="text-neutral-500 text-sm">Try adjusting your filters or search query.</p>
                            <button 
                                onClick={() => {
                                    setSelectedCategory('');
                                    updateUrl({ category: null, q: null });
                                }}
                                className="mt-6 text-[10px] uppercase tracking-widest border-b border-black pb-1 hover:text-neutral-600 transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
