"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, Plus, X, Image as ImageIcon, Loader2 } from "lucide-react";
import api from "@/lib/api/axios";
import { AdminProduct, AdminCategory, AdminCollection, AdminVariant, CreateProductPayload } from "@/types/admin-types";
import clsx from "clsx";

interface PageProps {
  params: Promise<{ id: string }>;
}

const EMPTY_VARIANT: Omit<AdminVariant, 'id' | 'productId'> = {
  name: "Default",
  stock: 0,
  sku: "",
  lowStockThreshold: 5,
};

export default function ProductEditorPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [collections, setCollections] = useState<AdminCollection[]>([]);

  // Form state
  const [form, setForm] = useState<CreateProductPayload>({
    name: "",
    slug: "",
    description: "",
    basePrice: 0,
    salePrice: null,
    isFeatured: false,
    isActive: true,
    images: [],
    categoryIds: [],
    collectionIds: [],
    variants: [{ ...EMPTY_VARIANT }],
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    brand: "",
    tags: [],
  });

  const [mediaInput, setMediaInput] = useState("");

  // Fetch product data if editing
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories and collections for dropdowns
        const [catRes, colRes] = await Promise.all([
          api.get<AdminCategory[]>("/admin/categories"),
          api.get<AdminCollection[]>("/admin/collections"),
        ]);
        setCategories(catRes.data || []);
        setCollections(colRes.data || []);

        // Fetch product if editing
        if (!isNew) {
          const { data: product } = await api.get<AdminProduct>(`/admin/products/${id}`);
          setForm({
            name: product.name || "",
            slug: product.slug || "",
            description: product.description || "",
            basePrice: product.basePrice || 0,
            salePrice: product.salePrice || null,
            isFeatured: product.isFeatured || false,
            isActive: product.isActive ?? true,
            images: product.images || (Array.isArray(product.images) ? product.images : []),
            categoryIds: product.categories?.map(c => c.id) || [],
            collectionIds: product.collections?.map(c => c.id) || [],
            variants: product.variants?.length > 0 
              ? product.variants.map(v => ({
                  name: v.name,
                  stock: v.stock,
                  sku: v.sku || "",
                  lowStockThreshold: v.lowStockThreshold || 5,
                }))
              : [{ ...EMPTY_VARIANT }],
            metaTitle: product.metaTitle || "",
            metaDescription: product.metaDescription || "",
            keywords: product.keywords || "",
            brand: product.brand || "",
            tags: product.tags || [],
          });
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        alert("Failed to load product data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isNew]);

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (name: string) => {
    setForm(prev => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name),
    }));
  };

  // Add images? URL
  const handleAddMedia = () => {
    if (!mediaInput.trim()) return;
    setForm(prev => ({
      ...prev,
      images: [...(prev.images || []), mediaInput.trim()],
    }));
    setMediaInput("");
  };

  // Upload file from local device
  const [uploading, setUploading] = useState(false);
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Allowed: JPEG, PNG, WebP, GIF');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('File too large. Maximum size is 10MB.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Don't set Content-Type manually - axios auto-sets with correct boundary for FormData
      const { data } = await api.post<{ url: string }>('/upload', formData);

      if (data.url) {
        setForm(prev => ({
          ...prev,
          images: [...(prev.images || []), data.url],
        }));
      }
    } catch (error: unknown) {
      console.error('Failed to upload file', error);
      // Show more specific error message
      const message = error instanceof Error ? error.message : 
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 
        'Failed to upload image. Please try again.';
      alert(message);
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  // Remove images?
  const handleRemoveMedia = (index: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index),
    }));
  };

  // Variant management
  const handleVariantChange = (index: number, field: string, value: string | number) => {
    setForm(prev => ({
      ...prev,
      variants: prev.variants?.map((v, i) => 
        i === index ? { ...v, [field]: value } : v
      ),
    }));
  };

  const handleAddVariant = () => {
    setForm(prev => ({
      ...prev,
      variants: [...(prev.variants || []), { ...EMPTY_VARIANT, name: `Variant ${(prev.variants?.length || 0) + 1}` }],
    }));
  };

  const handleRemoveVariant = (index: number) => {
    if ((form.variants?.length || 0) <= 1) {
      alert("Product must have at least one variant");
      return;
    }
    setForm(prev => ({
      ...prev,
      variants: prev.variants?.filter((_, i) => i !== index),
    }));
  };

  // Category toggle
  const handleCategoryToggle = (categoryId: string) => {
    setForm(prev => ({
      ...prev,
      categoryIds: prev.categoryIds?.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...(prev.categoryIds || []), categoryId],
    }));
  };

  // Collection toggle
  const handleCollectionToggle = (collectionId: string) => {
    setForm(prev => ({
      ...prev,
      collectionIds: prev.collectionIds?.includes(collectionId)
        ? prev.collectionIds.filter(id => id !== collectionId)
        : [...(prev.collectionIds || []), collectionId],
    }));
  };

  // Save product
  const handleSave = async () => {
    if (!form.name.trim()) {
      alert("Product name is required");
      return;
    }
    if (form.basePrice <= 0) {
      alert("Base price must be greater than 0");
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        await api.post("/admin/products", form);
      } else {
        await api.put(`/admin/products/${id}`, { ...form, id });
      }
      router.push("/admin/products");
    } catch (error: unknown) {
      console.error("Failed to save product", error);
      alert(error instanceof Error ? error.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  // Delete product
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    
    try {
      await api.delete(`/admin/products/${id}`);
      router.push("/admin/products");
    } catch (error) {
      console.error("Failed to delete", error);
      alert("Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-neutral-400" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/products"
            className="p-2 hover:bg-neutral-100 rounded-md transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-display text-2xl text-neutral-900">
              {isNew ? "New Product" : "Edit Product"}
            </h1>
            <p className="text-neutral-500 text-sm">
              {isNew ? "Create a new product" : form.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isNew && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-sm text-xs uppercase tracking-widest transition-colors"
            >
              <Trash2 size={14} className="inline mr-2" />
              Delete
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-black text-white hover:bg-neutral-800 rounded-sm text-xs uppercase tracking-widest transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Basic Information */}
        <section className="bg-white p-6 border border-neutral-200 rounded-sm">
          <h2 className="font-display text-lg mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-sm focus:ring-1 focus:ring-neutral-400"
                placeholder="e.g. Classic Leather Tote"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">
                Slug
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3 py-2 border border-neutral-200 rounded-sm focus:ring-1 focus:ring-neutral-400 font-mono text-sm"
                placeholder="classic-leather-tote"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-neutral-200 rounded-sm focus:ring-1 focus:ring-neutral-400 resize-none"
                placeholder="Product description..."
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">
                Brand
              </label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm(prev => ({ ...prev, brand: e.target.value }))}
                className="w-full px-3 py-2 border border-neutral-200 rounded-sm focus:ring-1 focus:ring-neutral-400"
                placeholder="e.g. BEG"
              />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-white p-6 border border-neutral-200 rounded-sm">
          <h2 className="font-display text-lg mb-4">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">
                Base Price (৳) *
              </label>
              <input
                type="number"
                value={form.basePrice}
                onChange={(e) => setForm(prev => ({ ...prev, basePrice: parseFloat(e.target.value) || 0 }))}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-neutral-200 rounded-sm focus:ring-1 focus:ring-neutral-400"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">
                Sale Price (৳)
              </label>
              <input
                type="number"
                value={form.salePrice || ""}
                onChange={(e) => setForm(prev => ({ ...prev, salePrice: e.target.value ? parseFloat(e.target.value) : null }))}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-neutral-200 rounded-sm focus:ring-1 focus:ring-neutral-400"
                placeholder="Leave empty if no sale"
              />
            </div>
          </div>
        </section>

        {/* Media */}
        <section className="bg-white p-6 border border-neutral-200 rounded-sm">
          <h2 className="font-display text-lg mb-4">Media</h2>
          
          {/* URL Input Row */}
          <div className="flex gap-2 mb-4">
            <input
              type="url"
              value={mediaInput}
              onChange={(e) => setMediaInput(e.target.value)}
              className="flex-1 px-3 py-2 border border-neutral-200 rounded-sm focus:ring-1 focus:ring-neutral-400"
              placeholder="https://example.com/image.jpg"
              onKeyDown={(e) => e.key === "Enter" && handleAddMedia()}
            />
            <button
              onClick={handleAddMedia}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-sm transition-colors"
              title="Add URL"
            >
              <Plus size={16} />
            </button>
          </div>
          
          {form.images && form.images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {form.images.map((url, index) => (
                <div key={index} className="relative aspect-square bg-neutral-100 rounded-sm overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleRemoveMedia(index)}
                    className="absolute top-2 right-2 p-1 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                  >
                    <X size={14} className="text-red-600" />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-[10px] uppercase">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-neutral-50 rounded-sm border-2 border-dashed border-neutral-200">
              <ImageIcon size={32} className="text-neutral-300 mb-2" />
              <p className="text-neutral-400 text-sm">Add image URLs above</p>
            </div>
          )}
        </section>

        {/* Variants */}
        <section className="bg-white p-6 border border-neutral-200 rounded-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg">Variants & Inventory</h2>
            <button
              onClick={handleAddVariant}
              className="px-3 py-1 text-xs uppercase tracking-widest border border-neutral-200 hover:bg-neutral-50 transition-colors flex items-center gap-1"
            >
              <Plus size={14} />
              Add Variant
            </button>
          </div>
          
          <div className="space-y-4">
            {form.variants?.map((variant, index) => (
              <div key={index} className="p-4 bg-neutral-50 rounded-sm border border-neutral-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-widest text-neutral-500">
                    Variant {index + 1}
                  </span>
                  {(form.variants?.length || 0) > 1 && (
                    <button
                      onClick={() => handleRemoveVariant(index)}
                      className="text-red-500 hover:text-red-600 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={variant.name}
                      onChange={(e) => handleVariantChange(index, "name", e.target.value)}
                      className="w-full px-2 py-1.5 border border-neutral-200 rounded-sm text-sm"
                      placeholder="e.g. Black / Large"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                      className="w-full px-2 py-1.5 border border-neutral-200 rounded-sm text-sm font-mono"
                      placeholder="BEG-001-BLK"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={(e) => handleVariantChange(index, "stock", parseInt(e.target.value) || 0)}
                      min="0"
                      className="w-full px-2 py-1.5 border border-neutral-200 rounded-sm text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                      Low Stock Alert
                    </label>
                    <input
                      type="number"
                      value={variant.lowStockThreshold}
                      onChange={(e) => handleVariantChange(index, "lowStockThreshold", parseInt(e.target.value) || 5)}
                      min="0"
                      className="w-full px-2 py-1.5 border border-neutral-200 rounded-sm text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories & Collections */}
        <section className="bg-white p-6 border border-neutral-200 rounded-sm">
          <h2 className="font-display text-lg mb-4">Organization</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categories */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-3">
                Categories
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories.map(cat => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-neutral-50 rounded">
                    <input
                      type="checkbox"
                      checked={form.categoryIds?.includes(cat.id) || false}
                      onChange={() => handleCategoryToggle(cat.id)}
                      className="rounded border-neutral-300"
                    />
                    <span className="text-sm">{cat.name}</span>
                  </label>
                ))}
                {categories.length === 0 && (
                  <p className="text-neutral-400 text-sm">No categories available</p>
                )}
              </div>
            </div>

            {/* Collections */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-3">
                Collections
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {collections.map(col => (
                  <label key={col.id} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-neutral-50 rounded">
                    <input
                      type="checkbox"
                      checked={form.collectionIds?.includes(col.id) || false}
                      onChange={() => handleCollectionToggle(col.id)}
                      className="rounded border-neutral-300"
                    />
                    <span className="text-sm">{col.title}</span>
                  </label>
                ))}
                {collections.length === 0 && (
                  <p className="text-neutral-400 text-sm">No collections available</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Status & Settings */}
        <section className="bg-white p-6 border border-neutral-200 rounded-sm">
          <h2 className="font-display text-lg mb-4">Status & Settings</h2>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded border-neutral-300 w-5 h-5"
              />
              <div>
                <span className="font-images?um text-sm">Active</span>
                <p className="text-xs text-neutral-400">Product is visible on store</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                className="rounded border-neutral-300 w-5 h-5"
              />
              <div>
                <span className="font-images?um text-sm">Featured</span>
                <p className="text-xs text-neutral-400">Show on homepage</p>
              </div>
            </label>
          </div>
        </section>

        {/* SEO */}
        <section className="bg-white p-6 border border-neutral-200 rounded-sm">
          <h2 className="font-display text-lg mb-4">SEO</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">
                Meta Title
              </label>
              <input
                type="text"
                value={form.metaTitle}
                onChange={(e) => setForm(prev => ({ ...prev, metaTitle: e.target.value }))}
                className="w-full px-3 py-2 border border-neutral-200 rounded-sm focus:ring-1 focus:ring-neutral-400"
                placeholder="Leave empty to use product name"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">
                Meta Description
              </label>
              <textarea
                value={form.metaDescription}
                onChange={(e) => setForm(prev => ({ ...prev, metaDescription: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-neutral-200 rounded-sm focus:ring-1 focus:ring-neutral-400 resize-none"
                placeholder="Brief description for search engines..."
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">
                Keywords
              </label>
              <input
                type="text"
                value={form.keywords}
                onChange={(e) => setForm(prev => ({ ...prev, keywords: e.target.value }))}
                className="w-full px-3 py-2 border border-neutral-200 rounded-sm focus:ring-1 focus:ring-neutral-400"
                placeholder="luxury, leather, tote, bag"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
