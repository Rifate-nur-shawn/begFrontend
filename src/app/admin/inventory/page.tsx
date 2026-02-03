"use client";

import { useState } from "react";
import {
  useProductStats,
  useInventoryLogs,
  useVariantInventory,
  adjustStock,
  StockAdjustmentPayload,
} from "@/lib/api/inventory-hooks";
import { formatCurrency } from "@/lib/utils";
import {
  Package,
  Loader2,
  RefreshCw,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  X,
  Check,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  Box,
  Clock,
} from "lucide-react";
import clsx from "clsx";

type TabType = "overview" | "variants" | "logs";

export default function AdminInventoryPage() {
  const { stats, isLoading: statsLoading, mutate: mutateStats } = useProductStats();
  const [logsPage, setLogsPage] = useState(1);
  const { logs, total: logsTotal, isLoading: logsLoading, mutate: mutateLogs } = useInventoryLogs(logsPage, 15);
  const { variants, isLoading: variantsLoading, mutate: mutateVariants } = useVariantInventory();

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // Adjustment modal
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjusting, setAdjusting] = useState(false);
  const [adjustError, setAdjustError] = useState<string | null>(null);
  const [adjustForm, setAdjustForm] = useState<StockAdjustmentPayload>({
    variantId: "",
    quantity: 0,
    reason: "restock",
    note: "",
  });

  const openAdjustModal = (variantId: string) => {
    setAdjustForm({ variantId, quantity: 0, reason: "restock", note: "" });
    setAdjustError(null);
    setShowAdjustModal(true);
  };

  const handleAdjust = async () => {
    if (!adjustForm.variantId || adjustForm.quantity === 0) {
      setAdjustError("Quantity must be non-zero");
      return;
    }

    setAdjusting(true);
    setAdjustError(null);

    try {
      await adjustStock(adjustForm);
      setShowAdjustModal(false);
      mutateVariants();
      mutateLogs();
      mutateStats();
    } catch (err) {
      console.error(err);
      setAdjustError("Failed to adjust stock");
    } finally {
      setAdjusting(false);
    }
  };

  const refreshAll = () => {
    mutateStats();
    mutateLogs();
    mutateVariants();
  };

  const filteredVariants = variants.filter(v =>
    v.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const logsTotalPages = Math.ceil(logsTotal / 15);

  const tabs = [
    { key: "overview" as const, label: "Overview" },
    { key: "variants" as const, label: "Stock Levels" },
    { key: "logs" as const, label: "History" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display flex items-center gap-3">
            <Package size={24} />
            Inventory
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Track stock levels, adjustments, and inventory value
          </p>
        </div>
        <button
          onClick={refreshAll}
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
              "px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === tab.key
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* === OVERVIEW TAB === */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {statsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-neutral-400" size={32} />
            </div>
          ) : stats ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-white border border-neutral-200 rounded-sm p-4">
                  <p className="text-xs text-neutral-500 uppercase">Total Products</p>
                  <p className="text-2xl font-display mt-1">{stats.totalProducts}</p>
                </div>
                <div className="bg-white border border-neutral-200 rounded-sm p-4">
                  <p className="text-xs text-neutral-500 uppercase">Active</p>
                  <p className="text-2xl font-display mt-1 text-green-600">{stats.activeProducts}</p>
                </div>
                <div className="bg-white border border-neutral-200 rounded-sm p-4">
                  <p className="text-xs text-neutral-500 uppercase">Inactive</p>
                  <p className="text-2xl font-display mt-1 text-neutral-400">{stats.inactiveProducts}</p>
                </div>
                <div className="bg-white border border-neutral-200 rounded-sm p-4 border-red-200">
                  <p className="text-xs text-red-500 uppercase flex items-center gap-1">
                    <AlertTriangle size={12} /> Out of Stock
                  </p>
                  <p className="text-2xl font-display mt-1 text-red-600">{stats.outOfStock}</p>
                </div>
                <div className="bg-white border border-neutral-200 rounded-sm p-4 border-amber-200">
                  <p className="text-xs text-amber-600 uppercase flex items-center gap-1">
                    <TrendingDown size={12} /> Low Stock
                  </p>
                  <p className="text-2xl font-display mt-1 text-amber-600">{stats.lowStock}</p>
                </div>
                <div className="bg-white border border-neutral-200 rounded-sm p-4">
                  <p className="text-xs text-neutral-500 uppercase">Inventory Value</p>
                  <p className="text-xl font-display mt-1">{formatCurrency(stats.totalInventoryValue)}</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-blue-50 border border-blue-100 rounded-sm p-6">
                <h3 className="font-medium text-blue-900 mb-2">Quick Actions</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveTab("variants")}
                    className="px-4 py-2 bg-white border border-blue-200 rounded-sm text-sm hover:bg-blue-50"
                  >
                    View Stock Levels
                  </button>
                  <button
                    onClick={() => setActiveTab("logs")}
                    className="px-4 py-2 bg-white border border-blue-200 rounded-sm text-sm hover:bg-blue-50"
                  >
                    View Adjustment History
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-neutral-500">
              Unable to load stats
            </div>
          )}
        </div>
      )}

      {/* === VARIANTS TAB === */}
      {activeTab === "variants" && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by product or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          {variantsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-neutral-400" size={32} />
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase">Product</th>
                    <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase">SKU</th>
                    <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase">Variant</th>
                    <th className="text-right p-4 text-xs font-medium text-neutral-500 uppercase">Stock</th>
                    <th className="text-center p-4 text-xs font-medium text-neutral-500 uppercase">Status</th>
                    <th className="text-right p-4 text-xs font-medium text-neutral-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredVariants.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-neutral-500">
                        No variants found
                      </td>
                    </tr>
                  ) : (
                    filteredVariants.map((v) => (
                      <tr key={v.variantId} className="hover:bg-neutral-50">
                        <td className="p-4 font-medium">{v.productName}</td>
                        <td className="p-4 font-mono text-sm text-neutral-500">{v.sku}</td>
                        <td className="p-4 text-sm">
                          {v.size && <span className="mr-2">{v.size}</span>}
                          {v.color && <span className="text-neutral-500">{v.color}</span>}
                        </td>
                        <td className="p-4 text-right font-medium">{v.stock}</td>
                        <td className="p-4 text-center">
                          {v.stock === 0 ? (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Out</span>
                          ) : v.stock <= v.lowStockThreshold ? (
                            <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">Low</span>
                          ) : (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">OK</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => openAdjustModal(v.variantId)}
                            className="px-3 py-1 border border-neutral-200 rounded-sm text-xs hover:bg-neutral-50 flex items-center gap-1 ml-auto"
                          >
                            <TrendingUp size={12} /> Adjust
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* === LOGS TAB === */}
      {activeTab === "logs" && (
        <div className="space-y-4">
          {logsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-neutral-400" size={32} />
            </div>
          ) : (
            <>
              <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                      <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase">Date</th>
                      <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase">Product</th>
                      <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase">Reason</th>
                      <th className="text-right p-4 text-xs font-medium text-neutral-500 uppercase">Change</th>
                      <th className="text-right p-4 text-xs font-medium text-neutral-500 uppercase">Stock After</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {logs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-neutral-500">
                          <Clock size={32} className="mx-auto mb-2 text-neutral-300" />
                          No adjustment history
                        </td>
                      </tr>
                    ) : (
                      logs.map((log) => (
                        <tr key={log.id} className="hover:bg-neutral-50">
                          <td className="p-4 text-sm text-neutral-500">
                            {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </td>
                          <td className="p-4">
                            <p className="font-medium">{log.productName}</p>
                            <p className="text-xs text-neutral-500">{log.sku}</p>
                          </td>
                          <td className="p-4 text-sm capitalize">{log.reason.replace("_", " ")}</td>
                          <td className="p-4 text-right">
                            <span className={clsx(
                              "font-medium",
                              log.quantity > 0 ? "text-green-600" : "text-red-600"
                            )}>
                              {log.quantity > 0 ? "+" : ""}{log.quantity}
                            </span>
                          </td>
                          <td className="p-4 text-right font-mono">{log.stockAfter}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {logsTotalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-500">
                    Page {logsPage} of {logsTotalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLogsPage(p => Math.max(1, p - 1))}
                      disabled={logsPage === 1}
                      className="p-2 border border-neutral-200 rounded-sm hover:bg-neutral-50 disabled:opacity-50"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setLogsPage(p => Math.min(logsTotalPages, p + 1))}
                      disabled={logsPage === logsTotalPages}
                      className="p-2 border border-neutral-200 rounded-sm hover:bg-neutral-50 disabled:opacity-50"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Adjustment Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm max-w-md w-full mx-4">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="font-display text-lg">Adjust Stock</h3>
              <button onClick={() => setShowAdjustModal(false)} className="p-1 hover:bg-neutral-100 rounded-sm">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {adjustError && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {adjustError}
                </div>
              )}

              <div>
                <label className="text-sm text-neutral-500 block mb-1">Quantity Change</label>
                <input
                  type="number"
                  value={adjustForm.quantity}
                  onChange={(e) => setAdjustForm({ ...adjustForm, quantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  placeholder="Use positive to add, negative to subtract"
                />
                <p className="text-xs text-neutral-400 mt-1">
                  Use positive numbers to add stock, negative to remove
                </p>
              </div>

              <div>
                <label className="text-sm text-neutral-500 block mb-1">Reason</label>
                <select
                  value={adjustForm.reason}
                  onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                >
                  <option value="restock">Restock</option>
                  <option value="return">Customer Return</option>
                  <option value="damaged">Damaged</option>
                  <option value="lost">Lost/Missing</option>
                  <option value="correction">Inventory Correction</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-neutral-500 block mb-1">Note (Optional)</label>
                <textarea
                  value={adjustForm.note}
                  onChange={(e) => setAdjustForm({ ...adjustForm, note: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div className="p-6 bg-neutral-50 border-t border-neutral-100 flex gap-3">
              <button
                onClick={() => setShowAdjustModal(false)}
                className="flex-1 px-4 py-2 border border-neutral-200 rounded-sm hover:bg-neutral-100 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAdjust}
                disabled={adjusting}
                className="flex-1 px-4 py-2 bg-neutral-900 text-white rounded-sm hover:bg-neutral-800 text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {adjusting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
