"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, MoreHorizontal } from "lucide-react";
import api from "@/lib/api/axios";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/lib/api/products-hooks";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/products');
      // Handle both paginated response and direct array
      setProducts(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
      if(!confirm("Are you sure you want to delete this product?")) return;
      try {
          await api.delete(`/admin/products/${id}`);
          setProducts(products.filter(p => p.id !== id));
      } catch (error) {
          console.error("Failed to delete", error);
          alert("Failed to delete product");
      }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="font-display text-3xl text-neutral-900 mb-2">Products</h1>
                <p className="text-neutral-500 text-sm">Manage your catalog, prices, and inventory.</p>
            </div>
            <Link 
                href="/admin/products/new"
                className="bg-black text-white px-6 py-3 uppercase tracking-widest text-xs font-utility hover:bg-neutral-800 transition-colors flex items-center gap-2"
            >
                <Plus size={16} />
                Add Product
            </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 border border-neutral-200 mb-6 flex items-center justify-between rounded-sm">
            <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="w-full pl-10 pr-4 py-2 bg-neutral-50 border-none focus:ring-1 focus:ring-neutral-200 text-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            {/* Can add Category Filter here */}
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
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="p-4"><div className="h-10 w-10 bg-neutral-200 rounded"></div></td>
                                    <td className="p-4"><div className="h-4 w-20 bg-neutral-200 rounded"></div></td>
                                    <td className="p-4"><div className="h-4 w-24 bg-neutral-200 rounded"></div></td>
                                    <td className="p-4"><div className="h-4 w-16 bg-neutral-200 rounded"></div></td>
                                    <td className="p-4"></td>
                                </tr>
                            ))
                        ) : filteredProducts.length === 0 ? (
                             <tr>
                                <td colSpan={5} className="p-8 text-center text-neutral-500 text-sm">
                                    No products found.
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map((product) => (
                                <tr key={product.id} className="group hover:bg-neutral-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 bg-neutral-100 rounded-sm overflow-hidden flex-shrink-0 border border-neutral-200">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img 
                                                    src={product.images?.[0] || product.media?.[0] || '/placeholder-bag.png'} 
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium text-neutral-900 text-sm line-clamp-1">{product.name}</p>
                                                <p className="text-[10px] text-neutral-500 font-mono uppercase">{product.id.slice(0, 8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 font-utility text-sm">
                                        {formatCurrency(product.salePrice || product.basePrice)}
                                    </td>
                                    <td className="p-4 text-sm text-neutral-600">
                                        {/* Handle legacy or new category structure */}
                                        {Array.isArray(product.categories) 
                                            ? product.categories[0]?.name 
                                            : product.category?.name || "Uncategorized"}
                                    </td>
                                    <td className="p-4 text-sm">
                                        <span className={clsx(
                                            "px-2 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium",
                                            // Simple logic for now, ideally check inventory count
                                            "bg-green-100 text-green-700"
                                        )}>
                                            In Stock
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link 
                                                href={`/admin/products/${product.id}`}
                                                className="p-2 text-neutral-400 hover:text-black hover:bg-white rounded-md transition-all"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-neutral-400 hover:text-red-600 hover:bg-white rounded-md transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination (To implement) */}
            <div className="p-4 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
                <p>Showing {filteredProducts.length} items</p>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border border-neutral-200 rounded-sm disabled:opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1 border border-neutral-200 rounded-sm disabled:opacity-50" disabled>Next</button>
                </div>
            </div>
        </div>
    </div>
  );
}
