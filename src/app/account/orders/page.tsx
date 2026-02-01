"use client";

import { useEffect, useState } from "react";
import { orderApi } from "@/lib/api/orders";
import { useAuthStore } from "@/store/auth-store";
import { Order } from "@/types/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        const fetchOrders = async () => {
            try {
                const data = await orderApi.getAll();
                setOrders(data);
            } catch (err) {
                console.error("Failed to fetch orders", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [isAuthenticated, router]);

    if (isLoading) return <div className="min-h-screen pt-32 text-center">Loading orders...</div>;

    return (
        <div className="min-h-screen pt-32 pb-24 px-4 md:px-12 bg-neutral-50">
            <div className="max-w-5xl mx-auto">
                <h1 className="font-display text-4xl mb-8">My Orders</h1>
                
                {orders.length === 0 ? (
                    <div className="bg-white p-12 text-center border border-neutral-200">
                        <p className="text-neutral-500 mb-4">You haven't placed any orders yet.</p>
                        <Link href="/collections/all" className="inline-block bg-black text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-neutral-800">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white p-6 border border-neutral-200">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="font-utility text-xs text-neutral-500 uppercase tracking-widest mb-1">Order ID</p>
                                        <p className="font-mono text-sm">{order.id}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-utility text-xs text-neutral-500 uppercase tracking-widest mb-1">Date</p>
                                        <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center border-t border-neutral-100 pt-4">
                                   <div>
                                       <span className={`inline-block px-3 py-1 text-[10px] uppercase tracking-wider ${
                                           order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-800'
                                       }`}>
                                           {order.status}
                                       </span>
                                   </div>
                                   <div className="font-display text-lg">
                                       Tk {order.totalAmount.toLocaleString()}
                                   </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
