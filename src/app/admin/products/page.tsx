"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import api from "@/lib/api/axios";
import { formatCurrency } from "@/lib/utils";
import { AdminProduct, AdminCategory, PaginatedResponse, ProductFilter } from "@/types/admin-types";
import clsx from "clsx";

const ITEMS_PER_PAGE = 20;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  
  // Filters
  const [filters, setFilters] = useState<ProductFilter>({
    page: 1,
    limit: ITEMS_PER_PAGE,
    search: "",
    category: "",
    isActive: "all",
    sort: "created_at desc"
  });

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // Fetch products with filters
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.page) params.set("page", String(filters.page));
      if (filters.limit) params.set("limit", String(filters.limit));
      if (filters.search) params.set("search", filters.search);
      if (filters.category) params.set("category", filters.category);
      if (filters.isActive && filters.isActive !== "all") params.set("isActive", filters.isActive);
      if (filters.sort) params.set("sort", filters.sort);

      const { data } = await api.get<PaginatedResponse<AdminProduct>>(`/admin/products?${params.toString()}`);
      setProducts(data.data || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch categories for filter dropdown
  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await api.get<AdminCategory[]>("/admin/categories");
      setCategories(data || []);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Toggle product active status
  const handleToggleStatus = async (product: AdminProduct) => {
    try {
      await api.patch(`/admin/products/${product.id}/status`, { isActive: !product.isActive });
      setProducts(products.map(p => 
        p.id === product.id ? { ...p, isActive: !p.isActive } : p
      ));
    } catch (error) {
      console.error("Failed to toggle status", error);
      alert("Failed to update product status");
    }
  };

  // Delete product
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
      setTotal(t => t - 1);
    } catch (error) {
      console.error("Failed to delete", error);
      alert("Failed to delete product");
    }
  };

  // Calculate total stock from variants
  const getTotalStock = (product: AdminProduct): number => {
    if (product.variants && product.variants.length > 0) {
      return product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
    }
    return product.stock || 0;
  };

  // Get stock status badge
  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <span className="px-2 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium bg-red-100 text-red-700">Out of Stock</span>;
    }
    if (stock < 10) {
      return <span className="px-2 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium bg-yellow-100 text-yellow-700">Low Stock ({stock})</span>;
    }
    return <span className="px-2 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium bg-green-100 text-green-700">In Stock ({stock})</span>;
  };

  const handleFilterChange = (key: keyof ProductFilter, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-neutral-900 mb-2">Products</h1>
          <p className="text-neutral-500 text-sm">
            {total} product{total !== 1 ? 's' : ''} in catalog
          </p>
        </div>
        <Link 
          href="/admin/products/new"
          className="bg-black text-white px-6 py-3 uppercase tracking-widest text-xs font-utility hover:bg-neutral-800 transition-colors flex items-center gap-2 w-fit"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 border border-neutral-200 mb-6 rounded-sm">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 text-sm rounded-sm"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-neutral-400" />
            <select 
              className="bg-neutral-50 border border-neutral-200 px-3 py-2 text-sm rounded-sm focus:ring-1 focus:ring-neutral-400"
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select 
            className="bg-neutral-50 border border-neutral-200 px-3 py-2 text-sm rounded-sm focus:ring-1 focus:ring-neutral-400"
            value={filters.isActive}
            onChange={(e) => handleFilterChange("isActive", e.target.value as 'true' | 'false' | 'all')}
          >
            <option value="all">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          {/* Sort */}
          <select 
            className="bg-neutral-50 border border-neutral-200 px-3 py-2 text-sm rounded-sm focus:ring-1 focus:ring-neutral-400"
            value={filters.sort}
            onChange={(e) => handleFilterChange("sort", e.target.value)}
          >
            <option value="created_at desc">Newest First</option>
            <option value="created_at asc">Oldest First</option>
            <option value="name asc">Name A-Z</option>
            <option value="name desc">Name Z-A</option>
            <option value="base_price asc">Price Low to High</option>
            <option value="base_price desc">Price High to Low</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-xs uppercase tracking-widest font-utility text-neutral-500">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="flex gap-3"><div className="h-12 w-12 bg-neutral-200 rounded"></div><div className="space-y-2"><div className="h-4 w-32 bg-neutral-200 rounded"></div><div className="h-3 w-16 bg-neutral-200 rounded"></div></div></div></td>
                    <td className="p-4"><div className="h-4 w-20 bg-neutral-200 rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-24 bg-neutral-200 rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-16 bg-neutral-200 rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-12 bg-neutral-200 rounded"></div></td>
                    <td className="p-4"></td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-500 text-sm">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const totalStock = getTotalStock(product);
                  const primaryImage = product.images?.[0] || (Array.isArray(product.media) ? product.media[0] : null) || '/placeholder-bag.png';
                  
                  return (
                    <tr key={product.id} className="group hover:bg-neutral-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-neutral-100 rounded-sm overflow-hidden flex-shrink-0 border border-neutral-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={primaryImage} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 text-sm line-clamp-1">{product.name}</p>
                            <p className="text-[10px] text-neutral-500 font-mono uppercase">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-utility text-sm">
                          {product.salePrice && product.salePrice < product.basePrice ? (
                            <>
                              <span className="text-red-600">{formatCurrency(product.salePrice)}</span>
                              <span className="text-neutral-400 line-through ml-2 text-xs">{formatCurrency(product.basePrice)}</span>
                            </>
                          ) : (
                            formatCurrency(product.basePrice)
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-neutral-600">
                        {product.categories?.[0]?.name || "Uncategorized"}
                      </td>
                      <td className="p-4 text-sm">
                        {getStockBadge(totalStock)}
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => handleToggleStatus(product)}
                          className={clsx(
                            "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium transition-colors",
                            product.isActive 
                              ? "bg-green-100 text-green-700 hover:bg-green-200" 
                              : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                          )}
                          title={product.isActive ? "Click to deactivate" : "Click to activate"}
                        >
                          {product.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                          {product.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link 
                            href={`/admin/products/${product.id}`}
                            className="p-2 text-neutral-400 hover:text-black hover:bg-white rounded-md transition-all border border-transparent hover:border-neutral-200"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-white rounded-md transition-all border border-transparent hover:border-neutral-200"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
          <p>
            Showing {((filters.page || 1) - 1) * ITEMS_PER_PAGE + 1} - {Math.min((filters.page || 1) * ITEMS_PER_PAGE, total)} of {total}
          </p>
          <div className="flex items-center gap-2">
            <button 
              className="p-2 border border-neutral-200 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
              onClick={() => handlePageChange((filters.page || 1) - 1)}
              disabled={(filters.page || 1) <= 1}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3">
              Page {filters.page || 1} of {totalPages || 1}
            </span>
            <button 
              className="p-2 border border-neutral-200 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
              onClick={() => handlePageChange((filters.page || 1) + 1)}
              disabled={(filters.page || 1) >= totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
