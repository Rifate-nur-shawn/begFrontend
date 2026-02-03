"use client";

import { useState } from "react";
import Image from "next/image";
import {
  useAdminCollections,
  createCollection,
  updateCollection,
  deleteCollection,
  CollectionPayload,
} from "@/lib/api/collections-hooks";
import { AdminCollection } from "@/types/admin-types";
import {
  Layers,
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
  ImageIcon,
} from "lucide-react";
import clsx from "clsx";

export default function AdminCollectionsPage() {
  const { collections, isLoading, isError, mutate } = useAdminCollections();
  
  const [showModal, setShowModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState<AdminCollection | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [form, setForm] = useState<CollectionPayload>({
    title: "",
    slug: "",
    description: "",
    image: "",
    story: "",
    isActive: true,
    metaTitle: "",
    metaDescription: "",
    keywords: "",
  });

  const resetForm = () => {
    setForm({
      title: "",
      slug: "",
      description: "",
      image: "",
      story: "",
      isActive: true,
      metaTitle: "",
      metaDescription: "",
      keywords: "",
    });
    setEditingCollection(null);
    setError(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (col: AdminCollection) => {
    setEditingCollection(col);
    setForm({
      title: col.title,
      slug: col.slug,
      description: col.description || "",
      image: col.image || "",
      story: col.story || "",
      isActive: col.isActive,
      metaTitle: col.metaTitle || "",
      metaDescription: col.metaDescription || "",
      keywords: col.keywords || "",
    });
    setError(null);
    setShowModal(true);
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }

    const slug = form.slug || generateSlug(form.title);
    
    setSaving(true);
    setError(null);

    try {
      if (editingCollection) {
        await updateCollection(editingCollection.id, { ...form, slug });
      } else {
        await createCollection({ ...form, slug });
      }
      setShowModal(false);
      resetForm();
      mutate();
    } catch (err) {
      console.error(err);
      setError("Failed to save collection");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (col: AdminCollection) => {
    if (!confirm(`Delete collection "${col.title}"?`)) return;

    try {
      await deleteCollection(col.id);
      mutate();
    } catch (err) {
      console.error(err);
      alert("Failed to delete collection");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display flex items-center gap-3">
            <Layers size={24} />
            Collections
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Curated product collections and editorial stories
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
            onClick={openCreateModal}
            className="px-4 py-2 bg-neutral-900 text-white rounded-sm hover:bg-neutral-800 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Add Collection
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
          Failed to load collections
        </div>
      )}

      {/* Collections Grid */}
      {!isLoading && !isError && (
        <>
          {collections.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-sm p-12 text-center">
              <Layers size={48} className="mx-auto text-neutral-200 mb-4" />
              <p className="text-neutral-500">No collections yet</p>
              <button
                onClick={openCreateModal}
                className="mt-4 text-sm text-neutral-900 underline"
              >
                Create your first collection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((col) => (
                <div
                  key={col.id}
                  className="bg-white border border-neutral-200 rounded-sm overflow-hidden group"
                >
                  {/* Image */}
                  <div className="aspect-video bg-neutral-100 relative">
                    {col.image ? (
                      <Image
                        src={col.image}
                        alt={col.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={32} className="text-neutral-300" />
                      </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <span className={clsx(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        col.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-neutral-100 text-neutral-600"
                      )}>
                        {col.isActive ? <Eye size={12} className="inline mr-1" /> : <EyeOff size={12} className="inline mr-1" />}
                        {col.isActive ? "Active" : "Draft"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-medium text-lg">{col.title}</h3>
                    <p className="text-sm text-neutral-500 font-mono">{col.slug}</p>
                    {col.description && (
                      <p className="text-sm text-neutral-600 mt-2 line-clamp-2">{col.description}</p>
                    )}
                    {col.products && col.products.length > 0 && (
                      <p className="text-xs text-neutral-400 mt-2">
                        {col.products.length} products
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="px-4 pb-4 flex gap-2">
                    <button
                      onClick={() => openEditModal(col)}
                      className="flex-1 px-3 py-2 border border-neutral-200 rounded-sm text-sm hover:bg-neutral-50 flex items-center justify-center gap-2"
                    >
                      <Edit2 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(col)}
                      className="px-3 py-2 border border-red-200 text-red-600 rounded-sm text-sm hover:bg-red-50 flex items-center justify-center gap-2"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8">
          <div className="bg-white rounded-sm max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="font-display text-lg">
                {editingCollection ? "Edit Collection" : "Create Collection"}
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
                  <label className="text-sm text-neutral-500 block mb-1">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => {
                      setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) });
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
                  <label className="text-sm text-neutral-500 block mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm text-neutral-500 block mb-1">Image URL</label>
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-neutral-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm text-neutral-500 block mb-1">Story (Rich Narrative)</label>
                  <textarea
                    value={form.story}
                    onChange={(e) => setForm({ ...form, story: e.target.value })}
                    rows={4}
                    placeholder="Tell the story behind this collection..."
                    className="w-full px-3 py-2 border border-neutral-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Active (visible to customers)</span>
              </label>

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
                {editingCollection ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
