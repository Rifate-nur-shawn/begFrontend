"use client";

import React, { useState } from "react";
import {
  useAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  CreateCategoryPayload,
} from "@/lib/api/categories-hooks";
import { AdminCategory } from "@/types/admin-types";
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  RefreshCw,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Star,
  Menu,
} from "lucide-react";
import clsx from "clsx";

export default function AdminCategoriesPage() {
  const { categories, isLoading, isError, mutate } = useAdminCategories();
  
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [form, setForm] = useState<CreateCategoryPayload>({
    name: "",
    slug: "",
    parentId: null,
    icon: "",
    image: "",
    isFeatured: false,
    isActive: true,
    showInNav: true,
    metaTitle: "",
    metaDescription: "",
    keywords: "",
  });

  const resetForm = () => {
    setForm({
      name: "",
      slug: "",
      parentId: null,
      icon: "",
      image: "",
      isFeatured: false,
      isActive: true,
      showInNav: true,
      metaTitle: "",
      metaDescription: "",
      keywords: "",
    });
    setEditingCategory(null);
    setError(null);
  };

  const openCreateModal = (parentId?: string) => {
    resetForm();
    if (parentId) {
      setForm(prev => ({ ...prev, parentId }));
    }
    setShowModal(true);
  };

  const openEditModal = (cat: AdminCategory) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parentId || null,
      icon: cat.icon || "",
      image: cat.image || "",
      isFeatured: cat.isFeatured,
      isActive: cat.isActive,
      showInNav: cat.showInNav,
      metaTitle: cat.metaTitle || "",
      metaDescription: cat.metaDescription || "",
      keywords: cat.keywords || "",
    });
    setError(null);
    setShowModal(true);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }

    const slug = form.slug || generateSlug(form.name);
    
    setSaving(true);
    setError(null);

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, { ...form, slug });
      } else {
        await createCategory({ ...form, slug });
      }
      setShowModal(false);
      resetForm();
      mutate();
    } catch (err) {
      console.error(err);
      setError("Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: AdminCategory) => {
    const hasChildren = categories.some(c => c.parentId === cat.id);
    if (hasChildren) {
      alert("Cannot delete category with sub-categories. Delete children first.");
      return;
    }
    if (!confirm(`Delete category "${cat.name}"?`)) return;

    try {
      await deleteCategory(cat.id);
      mutate();
    } catch (err) {
      console.error(err);
      alert("Failed to delete category");
    }
  };

  // Build tree structure for display
  const rootCategories = categories.filter(c => !c.parentId);
  const getChildren = (parentId: string) => categories.filter(c => c.parentId === parentId);

  const renderCategoryRow = (cat: AdminCategory, level: number = 0): React.ReactNode => (
    <React.Fragment key={cat.id}>
      <tr className="hover:bg-neutral-50 transition-colors">
        <td className="p-4">
          <div className="flex items-center gap-2" style={{ paddingLeft: level * 24 }}>
            {level > 0 && <span className="text-neutral-300">└</span>}
            <span className="font-medium">{cat.name}</span>
          </div>
        </td>
        <td className="p-4 font-mono text-sm text-neutral-500">{cat.slug}</td>
        <td className="p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            {cat.isActive ? (
              <Eye size={16} className="text-green-600" />
            ) : (
              <EyeOff size={16} className="text-neutral-400" />
            )}
            {cat.isFeatured && <Star size={16} className="text-yellow-500 fill-yellow-500" />}
            {cat.showInNav && <Menu size={16} className="text-blue-500" />}
          </div>
        </td>
        <td className="p-4 text-center text-sm text-neutral-500">{cat.orderIndex}</td>
        <td className="p-4 text-right">
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => openCreateModal(cat.id)}
              className="p-2 hover:bg-neutral-100 rounded-sm transition-colors"
              title="Add Sub-category"
            >
              <Plus size={16} className="text-neutral-600" />
            </button>
            <button
              onClick={() => openEditModal(cat)}
              className="p-2 hover:bg-neutral-100 rounded-sm transition-colors"
              title="Edit"
            >
              <Edit2 size={16} className="text-neutral-600" />
            </button>
            <button
              onClick={() => handleDelete(cat)}
              className="p-2 hover:bg-red-50 rounded-sm transition-colors"
              title="Delete"
            >
              <Trash2 size={16} className="text-red-600" />
            </button>
          </div>
        </td>
      </tr>
      {getChildren(cat.id).map(child => renderCategoryRow(child, level + 1))}
    </React.Fragment>
  );



  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display flex items-center gap-3">
            <FolderTree size={24} />
            Categories
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Organize products into categories and sub-categories
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => mutate()}
            className="px-4 py-2 border border-neutral-200 rounded-sm hover:bg-neutral-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            onClick={() => openCreateModal()}
            className="px-4 py-2 bg-neutral-900 text-white rounded-sm hover:bg-neutral-800 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Add Category
          </button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-neutral-400" size={32} />
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-sm text-center">
          Failed to load categories
        </div>
      )}

      {/* Categories Table */}
      {!isLoading && !isError && (
        <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase">Name</th>
                <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase">Slug</th>
                <th className="text-center p-4 text-xs font-medium text-neutral-500 uppercase">Status</th>
                <th className="text-center p-4 text-xs font-medium text-neutral-500 uppercase">Order</th>
                <th className="text-right p-4 text-xs font-medium text-neutral-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <FolderTree size={48} className="mx-auto text-neutral-200 mb-4" />
                    <p className="text-neutral-500">No categories yet</p>
                    <button
                      onClick={() => openCreateModal()}
                      className="mt-4 text-sm text-neutral-900 underline"
                    >
                      Create your first category
                    </button>
                  </td>
                </tr>
              ) : (
                rootCategories.map(cat => renderCategoryRow(cat))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex gap-6 text-xs text-neutral-500">
        <span className="flex items-center gap-1"><Eye size={14} className="text-green-600" /> Active</span>
        <span className="flex items-center gap-1"><Star size={14} className="text-yellow-500 fill-yellow-500" /> Featured</span>
        <span className="flex items-center gap-1"><Menu size={14} className="text-blue-500" /> In Nav</span>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8">
          <div className="bg-white rounded-sm max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="font-display text-lg">
                {editingCategory ? "Edit Category" : "Create Category"}
              </h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-1 hover:bg-neutral-100 rounded-sm">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm text-neutral-500 block mb-1">Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) });
                    }}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm text-neutral-500 block mb-1">Slug</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-sm text-sm font-mono focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm text-neutral-500 block mb-1">Parent Category</label>
                  <select
                    value={form.parentId || ""}
                    onChange={(e) => setForm({ ...form, parentId: e.target.value || null })}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  >
                    <option value="">None (Root Category)</option>
                    {categories.filter(c => c.id !== editingCategory?.id).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-neutral-500 block mb-1">Icon URL</label>
                  <input
                    type="text"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-neutral-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="text-sm text-neutral-500 block mb-1">Image URL</label>
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-neutral-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.showInNav}
                    onChange={(e) => setForm({ ...form, showInNav: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Show in Nav</span>
                </label>
              </div>

              {/* SEO Fields */}
              <div className="border-t border-neutral-100 pt-4 mt-4">
                <p className="text-xs text-neutral-500 uppercase mb-3">SEO</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-neutral-500 block mb-1">Meta Title</label>
                    <input
                      type="text"
                      value={form.metaTitle}
                      onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-neutral-500 block mb-1">Meta Description</label>
                    <textarea
                      value={form.metaDescription}
                      onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-neutral-500 block mb-1">Keywords</label>
                    <input
                      type="text"
                      value={form.keywords}
                      onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                      placeholder="keyword1, keyword2, ..."
                      className="w-full px-3 py-2 border border-neutral-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-neutral-50 border-t border-neutral-100 flex gap-3 sticky bottom-0">
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="flex-1 px-4 py-2 border border-neutral-200 rounded-sm hover:bg-neutral-100 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-neutral-900 text-white rounded-sm hover:bg-neutral-800 text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {editingCategory ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
