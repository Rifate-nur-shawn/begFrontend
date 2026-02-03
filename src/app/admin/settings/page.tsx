"use client";

import { useState } from "react";
import {
  useShippingZones,
  useConfigEnums,
  createShippingZone,
  updateShippingZone,
  deleteShippingZone,
  upsertContent,
} from "@/lib/api/settings-hooks";
import { ShippingZone, CreateShippingZonePayload } from "@/types/admin-types";
import { formatCurrency } from "@/lib/utils";
import {
  Settings,
  Truck,
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  RefreshCw,
  Check,
  AlertCircle,
  List,
  FileText,
  Tag,
  CreditCard,
  ShoppingCart,
  Save,
} from "lucide-react";
import clsx from "clsx";

// Common content keys
const CONTENT_KEYS = [
  { key: "hero_banner", label: "Hero Banner", description: "Homepage main banner" },
  { key: "announcement", label: "Announcement Bar", description: "Top announcement bar" },
  { key: "promo_banner", label: "Promo Banner", description: "Promotional banner" },
];

export default function AdminSettingsPage() {
  const { zones, isLoading: zonesLoading, isError: zonesError, mutate: mutateZones } = useShippingZones();
  const { enums, isLoading: enumsLoading } = useConfigEnums();
  
  const [activeTab, setActiveTab] = useState<"shipping" | "enums" | "content" | "coupons">("shipping");
  
  // Shipping zone modal state
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zoneForm, setZoneForm] = useState<CreateShippingZonePayload>({
    key: "",
    label: "",
    cost: 0,
    isActive: true,
  });

  // Content state
  const [selectedContentKey, setSelectedContentKey] = useState<string | null>(null);
  const [contentJson, setContentJson] = useState<string>("");
  const [savingContent, setSavingContent] = useState(false);

  // === Shipping Zone Functions ===
  const resetZoneForm = () => {
    setZoneForm({ key: "", label: "", cost: 0, isActive: true });
    setEditingZone(null);
    setError(null);
  };

  const openCreateZoneModal = () => {
    resetZoneForm();
    setShowZoneModal(true);
  };

  const openEditZoneModal = (zone: ShippingZone) => {
    setEditingZone(zone);
    setZoneForm({
      key: zone.key,
      label: zone.label,
      cost: zone.cost,
      isActive: zone.isActive,
    });
    setError(null);
    setShowZoneModal(true);
  };

  const handleZoneSubmit = async () => {
    if (!zoneForm.key.trim() || !zoneForm.label.trim()) {
      setError("Key and Label are required");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (editingZone) {
        await updateShippingZone(editingZone.id, {
          label: zoneForm.label,
          cost: zoneForm.cost,
          isActive: zoneForm.isActive,
        });
      } else {
        await createShippingZone(zoneForm);
      }
      setShowZoneModal(false);
      resetZoneForm();
      mutateZones();
    } catch (err) {
      console.error(err);
      setError("Failed to save shipping zone");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteZone = async (zone: ShippingZone) => {
    if (!confirm(`Delete shipping zone "${zone.label}"?`)) return;

    try {
      await deleteShippingZone(zone.id);
      mutateZones();
    } catch (err) {
      console.error(err);
      alert("Failed to delete shipping zone");
    }
  };

  // === Content Functions ===
  const handleSaveContent = async () => {
    if (!selectedContentKey) return;

    try {
      const parsed = JSON.parse(contentJson);
      setSavingContent(true);
      await upsertContent(selectedContentKey, parsed);
      alert("Content saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Invalid JSON or failed to save content");
    } finally {
      setSavingContent(false);
    }
  };

  const tabs = [
    { key: "shipping" as const, label: "Shipping Zones", icon: <Truck size={18} /> },
    { key: "enums" as const, label: "System Config", icon: <List size={18} /> },
    { key: "content" as const, label: "Content", icon: <FileText size={18} /> },
    { key: "coupons" as const, label: "Coupons", icon: <Tag size={18} /> },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display flex items-center gap-3">
            <Settings size={24} />
            Settings
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Manage store configuration, shipping, and content
          </p>
        </div>
        <button
          onClick={() => {
            mutateZones();
          }}
          className="px-4 py-2 border border-neutral-200 rounded-sm hover:bg-neutral-50 transition-colors flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-neutral-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={clsx(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === tab.key
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* === SHIPPING ZONES TAB === */}
      {activeTab === "shipping" && (
        <section className="bg-white border border-neutral-200 rounded-sm">
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg">Shipping Zones</h2>
              <p className="text-sm text-neutral-500">Configure delivery areas and costs</p>
            </div>
            <button
              onClick={openCreateZoneModal}
              className="px-4 py-2 bg-neutral-900 text-white rounded-sm text-sm hover:bg-neutral-800 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Add Zone
            </button>
          </div>

          {zonesLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-neutral-400" size={32} />
            </div>
          )}

          {zonesError && (
            <div className="p-6 text-center text-red-600">
              <AlertCircle size={32} className="mx-auto mb-2" />
              Failed to load shipping zones
            </div>
          )}

          {!zonesLoading && !zonesError && (
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase">Key</th>
                  <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase">Label</th>
                  <th className="text-right p-4 text-xs font-medium text-neutral-500 uppercase">Cost</th>
                  <th className="text-center p-4 text-xs font-medium text-neutral-500 uppercase">Status</th>
                  <th className="text-right p-4 text-xs font-medium text-neutral-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {zones.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-neutral-500">
                      No shipping zones configured
                    </td>
                  </tr>
                ) : (
                  zones.map((zone) => (
                    <tr key={zone.id} className="hover:bg-neutral-50">
                      <td className="p-4 font-mono text-sm">{zone.key}</td>
                      <td className="p-4 font-medium">{zone.label}</td>
                      <td className="p-4 text-right">{formatCurrency(zone.cost)}</td>
                      <td className="p-4 text-center">
                        <span className={clsx(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          zone.isActive ? "bg-green-100 text-green-800" : "bg-neutral-100 text-neutral-600"
                        )}>
                          {zone.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditZoneModal(zone)} className="p-2 hover:bg-neutral-100 rounded-sm">
                            <Edit2 size={16} className="text-neutral-600" />
                          </button>
                          <button onClick={() => handleDeleteZone(zone)} className="p-2 hover:bg-red-50 rounded-sm">
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </section>
      )}

      {/* === SYSTEM CONFIG TAB === */}
      {activeTab === "enums" && (
        <div className="space-y-6">
          {enumsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-neutral-400" size={32} />
            </div>
          ) : enums ? (
            <>
              {/* Order Statuses */}
              <section className="bg-white border border-neutral-200 rounded-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-50 rounded-sm">
                    <ShoppingCart size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-display">Order Statuses</h3>
                    <p className="text-xs text-neutral-500">Available order status values</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {enums.orderStatuses?.map((status) => (
                    <span key={status} className="px-3 py-1 bg-neutral-100 rounded-full text-sm capitalize">
                      {status.replace("_", " ")}
                    </span>
                  ))}
                </div>
              </section>

              {/* Payment Statuses */}
              <section className="bg-white border border-neutral-200 rounded-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-50 rounded-sm">
                    <CreditCard size={18} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-display">Payment Statuses</h3>
                    <p className="text-xs text-neutral-500">Available payment status values</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {enums.paymentStatuses?.map((status) => (
                    <span key={status} className="px-3 py-1 bg-neutral-100 rounded-full text-sm capitalize">
                      {status.replace("_", " ")}
                    </span>
                  ))}
                </div>
              </section>

              {/* Payment Methods */}
              <section className="bg-white border border-neutral-200 rounded-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-50 rounded-sm">
                    <CreditCard size={18} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-display">Payment Methods</h3>
                    <p className="text-xs text-neutral-500">Accepted payment methods</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {enums.paymentMethods?.map((method) => (
                    <span key={method} className="px-3 py-1 bg-neutral-100 rounded-full text-sm uppercase">
                      {method}
                    </span>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <div className="text-center py-12 text-neutral-500">
              Unable to load system configuration
            </div>
          )}
        </div>
      )}

      {/* === CONTENT TAB === */}
      {activeTab === "content" && (
        <section className="bg-white border border-neutral-200 rounded-sm">
          <div className="p-6 border-b border-neutral-100">
            <h2 className="font-display text-lg">Content Management</h2>
            <p className="text-sm text-neutral-500">
              Manage dynamic content blocks (hero banners, announcements, etc.)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
            {/* Content Keys List */}
            <div className="p-4 space-y-2">
              {CONTENT_KEYS.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setSelectedContentKey(item.key);
                    setContentJson(JSON.stringify({ title: "", subtitle: "", image: "" }, null, 2));
                  }}
                  className={clsx(
                    "w-full text-left p-3 rounded-sm transition-colors",
                    selectedContentKey === item.key
                      ? "bg-neutral-900 text-white"
                      : "hover:bg-neutral-50"
                  )}
                >
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className={clsx(
                    "text-xs mt-1",
                    selectedContentKey === item.key ? "text-neutral-300" : "text-neutral-500"
                  )}>
                    {item.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Content Editor */}
            <div className="md:col-span-2 p-4">
              {selectedContentKey ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">
                      Editing: <span className="font-mono text-sm">{selectedContentKey}</span>
                    </h3>
                    <button
                      onClick={handleSaveContent}
                      disabled={savingContent}
                      className="px-4 py-2 bg-neutral-900 text-white rounded-sm text-sm hover:bg-neutral-800 disabled:opacity-50 flex items-center gap-2"
                    >
                      {savingContent ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      Save
                    </button>
                  </div>
                  <textarea
                    value={contentJson}
                    onChange={(e) => setContentJson(e.target.value)}
                    className="w-full h-80 font-mono text-sm p-4 border border-neutral-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    placeholder="Enter JSON content..."
                  />
                  <p className="text-xs text-neutral-500">
                    Enter valid JSON. Structure depends on content type.
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-80 text-neutral-400">
                  Select a content key to edit
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* === COUPONS TAB === */}
      {activeTab === "coupons" && (
        <section className="bg-white border border-neutral-200 rounded-sm">
          <div className="p-6 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-sm">
                <Tag size={20} className="text-orange-600" />
              </div>
              <div>
                <h2 className="font-display text-lg">Coupons</h2>
                <p className="text-sm text-neutral-500">Manage discount codes and promotions</p>
              </div>
            </div>
          </div>

          <div className="p-12 text-center">
            <Tag size={48} className="mx-auto text-neutral-200 mb-4" />
            <h3 className="font-medium text-lg mb-2">Coupons Feature</h3>
            <p className="text-neutral-500 text-sm max-w-md mx-auto">
              The coupons API is currently disabled in the backend. 
              Enable the coupon routes in <code className="bg-neutral-100 px-1 py-0.5 rounded text-xs">main.go</code> to activate this feature.
            </p>
            <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-sm inline-block text-left">
              <p className="text-xs text-amber-800 font-mono">
                // Uncomment lines 207-211 in main.go:
                <br />
                mux.Handle(&quot;GET /api/v1/admin/coupons&quot;, ...)
                <br />
                mux.Handle(&quot;POST /api/v1/admin/coupons&quot;, ...)
              </p>
            </div>
          </div>
        </section>
      )}

      {/* === ZONE MODAL === */}
      {showZoneModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="font-display text-lg">
                {editingZone ? "Edit Shipping Zone" : "Create Shipping Zone"}
              </h3>
              <button onClick={() => { setShowZoneModal(false); resetZoneForm(); }} className="p-1 hover:bg-neutral-100 rounded-sm">
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

              <div>
                <label className="text-sm text-neutral-500 block mb-1">Key *</label>
                <input
                  type="text"
                  value={zoneForm.key}
                  onChange={(e) => setZoneForm({ ...zoneForm, key: e.target.value.toLowerCase().replace(/\s+/g, "_") })}
                  disabled={!!editingZone}
                  placeholder="e.g., inside_dhaka"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 disabled:bg-neutral-100 font-mono"
                />
              </div>

              <div>
                <label className="text-sm text-neutral-500 block mb-1">Label *</label>
                <input
                  type="text"
                  value={zoneForm.label}
                  onChange={(e) => setZoneForm({ ...zoneForm, label: e.target.value })}
                  placeholder="e.g., Inside Dhaka"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="text-sm text-neutral-500 block mb-1">Cost (৳)</label>
                <input
                  type="number"
                  value={zoneForm.cost}
                  onChange={(e) => setZoneForm({ ...zoneForm, cost: parseFloat(e.target.value) || 0 })}
                  min={0}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className={clsx("w-10 h-6 rounded-full relative transition-colors", zoneForm.isActive ? "bg-green-500" : "bg-neutral-300")}
                  onClick={() => setZoneForm({ ...zoneForm, isActive: !zoneForm.isActive })}
                >
                  <div className={clsx("absolute top-1 w-4 h-4 bg-white rounded-full transition-transform", zoneForm.isActive ? "left-5" : "left-1")} />
                </div>
                <span className="text-sm">Active</span>
              </label>
            </div>

            <div className="p-6 bg-neutral-50 border-t border-neutral-100 flex gap-3">
              <button onClick={() => { setShowZoneModal(false); resetZoneForm(); }} className="flex-1 px-4 py-2 border border-neutral-200 rounded-sm hover:bg-neutral-100 text-sm">
                Cancel
              </button>
              <button onClick={handleZoneSubmit} disabled={saving} className="flex-1 px-4 py-2 bg-neutral-900 text-white rounded-sm hover:bg-neutral-800 text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {editingZone ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
