"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  useAdminOrder,
  useOrderHistory,
  updateOrderStatus,
  updatePaymentStatus,
  verifyPayment,
  processRefund,
} from "@/lib/api/orders-hooks";
import { OrderStatus, PaymentStatus, RefundPayload } from "@/types/admin-types";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
  Loader2,
  RefreshCw,
  BadgeCheck,
  Undo,
  History,
} from "lucide-react";
import clsx from "clsx";

const ORDER_STATUSES: { value: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { value: 'pending', label: 'Pending', icon: <Clock size={16} /> },
  { value: 'processing', label: 'Processing', icon: <Package size={16} /> },
  { value: 'shipped', label: 'Shipped', icon: <Truck size={16} /> },
  { value: 'delivered', label: 'Delivered', icon: <CheckCircle size={16} /> },
  { value: 'cancelled', label: 'Cancelled', icon: <XCircle size={16} /> },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  processing: 'bg-blue-100 text-blue-800 border-blue-200',
  shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

const paymentColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  verified: 'bg-emerald-100 text-emerald-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
  partial_refund: 'bg-orange-100 text-orange-800',
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const { order, isLoading, isError, mutate } = useAdminOrder(orderId);
  const { history } = useOrderHistory(orderId);

  const [updating, setUpdating] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundForm, setRefundForm] = useState<RefundPayload>({
    amount: 0,
    reason: '',
    restock: true,
  });
  const [statusNote, setStatusNote] = useState('');

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    setUpdating(true);
    try {
      await updateOrderStatus(orderId, { status: newStatus, note: statusNote });
      setStatusNote('');
      mutate();
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handlePaymentVerify = async () => {
    setUpdating(true);
    try {
      await verifyPayment(orderId);
      mutate();
    } catch (err) {
      console.error(err);
      alert('Failed to verify payment');
    } finally {
      setUpdating(false);
    }
  };

  const handlePaymentStatusUpdate = async (status: PaymentStatus) => {
    setUpdating(true);
    try {
      await updatePaymentStatus(orderId, { status });
      mutate();
    } catch (err) {
      console.error(err);
      alert('Failed to update payment status');
    } finally {
      setUpdating(false);
    }
  };

  const handleRefund = async () => {
    if (!refundForm.amount || !refundForm.reason) {
      alert('Please fill in amount and reason');
      return;
    }
    setUpdating(true);
    try {
      await processRefund(orderId, refundForm);
      setShowRefundModal(false);
      setRefundForm({ amount: 0, reason: '', restock: true });
      mutate();
    } catch (err) {
      console.error(err);
      alert('Failed to process refund');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-neutral-400" size={32} />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <Package size={64} className="mx-auto text-neutral-200 mb-4" />
        <h2 className="text-xl font-medium mb-2">Order Not Found</h2>
        <p className="text-neutral-500 mb-6">The order you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/admin/orders" className="text-neutral-900 underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  const shippingAddr = order.shippingAddress || {};

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-neutral-100 rounded-sm transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-display flex items-center gap-3">
              Order #{order.id.slice(0, 8).toUpperCase()}
              {order.isPreOrder && (
                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full uppercase">
                  Pre-order
                </span>
              )}
            </h1>
            <p className="text-neutral-500 text-sm mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <button
          onClick={() => mutate()}
          className="px-4 py-2 border border-neutral-200 rounded-sm hover:bg-neutral-50 transition-colors flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <section className="bg-white p-6 border border-neutral-200 rounded-sm">
            <h2 className="font-display text-lg mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-neutral-100 last:border-0 last:pb-0">
                  <div className="w-16 h-16 bg-neutral-100 rounded-sm overflow-hidden flex-shrink-0">
                    {item.product?.images?.[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={24} className="text-neutral-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product?.name || 'Product'}</h3>
                    {item.variantId && (
                      <p className="text-xs text-neutral-500">Variant ID: {item.variantId.slice(0, 8)}</p>
                    )}
                    <p className="text-sm text-neutral-600 mt-1">
                      {formatCurrency(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-6 pt-4 border-t border-neutral-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Subtotal</span>
                <span>{formatCurrency(order.totalAmount - order.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Shipping</span>
                <span>{formatCurrency(order.shippingFee)}</span>
              </div>
              {order.refundedAmount > 0 && (
                <div className="flex justify-between text-sm text-red-600">
                  <span>Refunded</span>
                  <span>-{formatCurrency(order.refundedAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-medium pt-2 border-t border-neutral-100">
                <span>Total</span>
                <span>{formatCurrency(order.totalAmount - order.refundedAmount)}</span>
              </div>
            </div>
          </section>

          {/* Status History */}
          <section className="bg-white p-6 border border-neutral-200 rounded-sm">
            <h2 className="font-display text-lg mb-4 flex items-center gap-2">
              <History size={18} />
              Status History
            </h2>
            {history.length === 0 ? (
              <p className="text-neutral-500 text-sm">No history available</p>
            ) : (
              <div className="space-y-4">
                {history.map((entry) => (
                  <div key={entry.id} className="flex gap-4 items-start">
                    <div className="w-2 h-2 mt-2 rounded-full bg-neutral-400" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={clsx(
                          'px-2 py-0.5 rounded text-xs font-medium',
                          statusColors[entry.newStatus] || 'bg-gray-100'
                        )}>
                          {entry.newStatus}
                        </span>
                        {entry.previousStatus && (
                          <span className="text-xs text-neutral-400">
                            from {entry.previousStatus}
                          </span>
                        )}
                      </div>
                      {entry.reason && (
                        <p className="text-sm text-neutral-600 mt-1">{entry.reason}</p>
                      )}
                      <p className="text-xs text-neutral-400 mt-1">
                        {formatDate(entry.createdAt)}
                        {entry.createdName && ` by ${entry.createdName}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Status */}
          <section className="bg-white p-6 border border-neutral-200 rounded-sm">
            <h2 className="font-display text-lg mb-4">Order Status</h2>
            <div className="space-y-3">
              {ORDER_STATUSES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => handleStatusUpdate(s.value)}
                  disabled={updating || order.status === s.value}
                  className={clsx(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-sm border transition-all',
                    order.status === s.value
                      ? statusColors[s.value]
                      : 'border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50',
                    (updating || order.status === s.value) && 'cursor-not-allowed'
                  )}
                >
                  {s.icon}
                  <span className="font-medium">{s.label}</span>
                  {order.status === s.value && (
                    <CheckCircle size={16} className="ml-auto" />
                  )}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <label className="text-xs text-neutral-500 block mb-1">Status Note (optional)</label>
              <textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Add a note for this status change..."
                rows={2}
                className="w-full px-3 py-2 border border-neutral-200 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </section>

          {/* Payment Info */}
          <section className="bg-white p-6 border border-neutral-200 rounded-sm">
            <h2 className="font-display text-lg mb-4 flex items-center gap-2">
              <CreditCard size={18} />
              Payment
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-500 text-sm">Method</span>
                <span className="font-medium capitalize">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 text-sm">Status</span>
                <span className={clsx(
                  'px-2 py-1 rounded text-xs font-medium',
                  paymentColors[order.paymentStatus]
                )}>
                  {order.paymentStatus.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 text-sm">Paid</span>
                <span className="font-medium">{formatCurrency(order.paidAmount)}</span>
              </div>
              {order.refundedAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span className="text-sm">Refunded</span>
                  <span className="font-medium">{formatCurrency(order.refundedAmount)}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-100 space-y-2">
              {order.paymentStatus === 'paid' && (
                <button
                  onClick={handlePaymentVerify}
                  disabled={updating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-sm hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  <BadgeCheck size={16} />
                  Verify Payment
                </button>
              )}
              {(order.paymentStatus === 'verified' || order.paymentStatus === 'paid') && (
                <button
                  onClick={() => {
                    setRefundForm({ ...refundForm, amount: order.totalAmount - order.refundedAmount });
                    setShowRefundModal(true);
                  }}
                  disabled={updating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-sm hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <Undo size={16} />
                  Process Refund
                </button>
              )}
            </div>
          </section>

          {/* Customer Info */}
          <section className="bg-white p-6 border border-neutral-200 rounded-sm">
            <h2 className="font-display text-lg mb-4 flex items-center gap-2">
              <User size={18} />
              Customer
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User size={14} className="text-neutral-400" />
                <span>{order.user?.firstName || ''} {order.user?.lastName || 'Customer'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-neutral-400" />
                <span className="text-sm">{order.user?.email}</span>
              </div>
              {order.user?.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-neutral-400" />
                  <span className="text-sm">{order.user.phone}</span>
                </div>
              )}
            </div>
          </section>

          {/* Shipping Address */}
          <section className="bg-white p-6 border border-neutral-200 rounded-sm">
            <h2 className="font-display text-lg mb-4 flex items-center gap-2">
              <MapPin size={18} />
              Shipping Address
            </h2>
            <div className="text-sm space-y-1">
              <p className="font-medium">{shippingAddr.name || 'N/A'}</p>
              {shippingAddr.phone && <p>{shippingAddr.phone}</p>}
              <p className="text-neutral-600">
                {shippingAddr.address || 'No address provided'}
              </p>
              <p className="text-neutral-600">
                {[shippingAddr.district, shippingAddr.city, shippingAddr.postalCode]
                  .filter(Boolean)
                  .join(', ')}
              </p>
              {shippingAddr.country && (
                <p className="text-neutral-500">{shippingAddr.country}</p>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-sm max-w-md w-full mx-4">
            <h3 className="text-lg font-display mb-4">Process Refund</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-neutral-500 block mb-1">Refund Amount</label>
                <input
                  type="number"
                  value={refundForm.amount}
                  onChange={(e) => setRefundForm({ ...refundForm, amount: parseFloat(e.target.value) || 0 })}
                  max={order.totalAmount - order.refundedAmount}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
                <p className="text-xs text-neutral-400 mt-1">
                  Max: {formatCurrency(order.totalAmount - order.refundedAmount)}
                </p>
              </div>
              <div>
                <label className="text-sm text-neutral-500 block mb-1">Reason</label>
                <textarea
                  value={refundForm.reason}
                  onChange={(e) => setRefundForm({ ...refundForm, reason: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={refundForm.restock}
                  onChange={(e) => setRefundForm({ ...refundForm, restock: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Restock items</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRefundModal(false)}
                className="flex-1 px-4 py-2 border border-neutral-200 rounded-sm hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRefund}
                disabled={updating}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 disabled:opacity-50"
              >
                {updating ? 'Processing...' : 'Process Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
