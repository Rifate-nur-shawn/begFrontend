"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminOrders, updateOrderStatus } from "@/lib/api/orders-hooks";
import { OrderFilter, OrderStatus, PaymentStatus } from "@/types/admin-types";
import { formatCurrency } from "@/lib/utils";
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Eye,
  Loader2,
  Package,
  RefreshCw
} from "lucide-react";
import clsx from "clsx";

const ORDER_STATUSES: { value: OrderStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PAYMENT_STATUSES: { value: PaymentStatus | ''; label: string }[] = [
  { value: '', label: 'All Payments' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'verified', label: 'Verified' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const paymentColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  verified: 'bg-emerald-100 text-emerald-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
  partial_refund: 'bg-orange-100 text-orange-800',
};

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState<OrderFilter>({
    page: 1,
    limit: 20,
    status: '',
    payment_status: '',
    search: '',
  });
  
  const [searchInput, setSearchInput] = useState('');
  const { orders, total, page, limit, isLoading, isError, mutate } = useAdminOrders(filter);
  
  const totalPages = Math.ceil(total / limit);

  const handleSearch = () => {
    setFilter(prev => ({ ...prev, search: searchInput, page: 1 }));
  };

  const handleStatusFilter = (status: OrderStatus | '') => {
    setFilter(prev => ({ ...prev, status, page: 1 }));
  };

  const handlePaymentFilter = (payment_status: PaymentStatus | '') => {
    setFilter(prev => ({ ...prev, payment_status, page: 1 }));
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilter(prev => ({ ...prev, page: newPage }));
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleQuickStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, { status: newStatus });
      mutate();
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update order status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display">Orders</h1>
          <p className="text-neutral-500 text-sm mt-1">
            Manage customer orders and fulfillment
          </p>
        </div>
        <button 
          onClick={() => mutate()}
          className="px-4 py-2 border border-neutral-200 rounded-sm hover:bg-neutral-50 transition-colors flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 border border-neutral-200 rounded-sm mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-neutral-400" />
            <select
              value={filter.status || ''}
              onChange={(e) => handleStatusFilter(e.target.value as OrderStatus | '')}
              className="px-3 py-2 border border-neutral-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
            >
              {ORDER_STATUSES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter */}
          <select
            value={filter.payment_status || ''}
            onChange={(e) => handlePaymentFilter(e.target.value as PaymentStatus | '')}
            className="px-3 py-2 border border-neutral-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
          >
            {PAYMENT_STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-neutral-900 text-white rounded-sm text-sm hover:bg-neutral-800 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-neutral-400" size={32} />
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-sm text-center">
          Failed to load orders. Please try again.
        </div>
      )}

      {/* Orders Table */}
      {!isLoading && !isError && (
        <>
          <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Order</th>
                  <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Customer</th>
                  <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                  <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="text-left p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Payment</th>
                  <th className="text-right p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Total</th>
                  <th className="text-right p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center">
                      <Package size={48} className="mx-auto text-neutral-200 mb-4" />
                      <p className="text-neutral-500">No orders found</p>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="p-4">
                        <div className="font-mono text-sm">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </div>
                        {order.isPreOrder && (
                          <span className="text-[10px] px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full uppercase">
                            Pre-order
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium">
                          {order.user?.firstName || ''} {order.user?.lastName || order.user?.email}
                        </div>
                        <div className="text-xs text-neutral-500">{order.user?.email}</div>
                      </td>
                      <td className="p-4 text-sm text-neutral-600">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleQuickStatusUpdate(order.id, e.target.value as OrderStatus)}
                          className={clsx(
                            'px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer',
                            statusColors[order.status] || 'bg-gray-100 text-gray-800'
                          )}
                        >
                          {ORDER_STATUSES.filter(s => s.value).map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4">
                        <span className={clsx(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          paymentColors[order.paymentStatus] || 'bg-gray-100 text-gray-800'
                        )}>
                          {order.paymentStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-right font-medium">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                        >
                          <Eye size={16} />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-neutral-500">
                Showing {((page - 1) * limit) + 1} - {Math.min(page * limit, total)} of {total} orders
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className="p-2 border border-neutral-200 rounded-sm hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm px-3">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  className="p-2 border border-neutral-200 rounded-sm hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
