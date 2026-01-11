"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import api from "@/lib/api/axios";
import { motion } from "framer-motion";

export default function AccountPage() {
    const { isAuthenticated, user, isLoading } = useAuthStore();
    const { openLogin } = useUIStore();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"orders" | "addresses">("orders");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [orders, setOrders] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [addresses, setAddresses] = useState<any[]>([]);
    
    // Form state
    const [newAddress, setNewAddress] = useState({
        street: "",
        city: "",
        state: "",
        zip: "",
        country: ""
    });

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders');
            setOrders(data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAddresses = async () => {
        try {
            const { data } = await api.get('/user/addresses');
            setAddresses(data || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/');
            setTimeout(() => openLogin(), 300);
        }
    }, [isLoading, isAuthenticated, router, openLogin]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
            fetchAddresses();
        }
    }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

    async function handleAddAddress(e: React.FormEvent) {
        e.preventDefault();
        try {
            await api.post('/user/addresses', newAddress);
            setNewAddress({ street: "", city: "", state: "", zip: "", country: "" });
            fetchAddresses();
        } catch (error) {
            console.error(error);
        }
    }

    if (isLoading || !isAuthenticated) {
        return null; // Or loading spinner
    }

    return (
        <div className="min-h-screen pt-32 pb-24 px-4 md:px-12 bg-canvas text-primary">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12">
                    <h1 className="font-display text-4xl mb-2">My Account</h1>
                    <p className="font-utility text-xs tracking-widest uppercase text-neutral-500">
                        Hello, {user?.email}
                    </p>
                </header>

                <div className="flex gap-8 mb-12 border-b border-neutral-200 pb-4">
                    <button 
                        onClick={() => setActiveTab("orders")}
                        className={`font-utility text-xs tracking-widest uppercase pb-4 -mb-4 transition-colors ${activeTab === 'orders' ? 'border-b-2 border-primary' : 'text-neutral-400'}`}
                    >
                        Order History
                    </button>
                    <button 
                         onClick={() => setActiveTab("addresses")}
                         className={`font-utility text-xs tracking-widest uppercase pb-4 -mb-4 transition-colors ${activeTab === 'addresses' ? 'border-b-2 border-primary' : 'text-neutral-400'}`}
                    >
                        Addresses
                    </button>
                </div>

                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'orders' && (
                        <div className="space-y-6">
                            {orders.length === 0 ? (
                                <p className="font-utility text-xs tracking-widest">No orders found.</p>
                            ) : (
                                orders.map((order) => (
                                    <div key={order.id} className="border border-neutral-200 p-6 flex justify-between items-start">
                                        <div>
                                            <p className="font-utility text-xs font-bold mb-2">Order #{order.id.slice(0, 8)}...</p>
                                            <p className="font-utility text-[10px] text-neutral-500 mb-4">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                            <div className="space-y-1">
                                                {order.items?.map((item: any) => (
                                                    <p key={item.id} className="font-utility text-xs">
                                                        {item.quantity}x {item.product?.name}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-utility text-sm font-bold">${order.totalAmount?.toFixed(2)}</p>
                                            <span className="inline-block mt-2 px-2 py-1 bg-neutral-100 text-[10px] uppercase tracking-widest rounded-sm">
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'addresses' && (
                         <div className="space-y-12">
                             {/* List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {addresses.map((addr) => (
                                    <div key={addr.id} className="border border-neutral-200 p-6">
                                        <p className="font-utility text-xs leading-relaxed">
                                            {addr.street}<br/>
                                            {addr.city}, {addr.state} {addr.zip}<br/>
                                            {addr.country}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Add Form */}
                            <div className="max-w-md">
                                <h3 className="font-display text-2xl mb-6">Add New Address</h3>
                                <form onSubmit={handleAddAddress} className="space-y-4">
                                    <input 
                                        type="text" 
                                        placeholder="Street Address" 
                                        className="w-full bg-neutral-50 border border-neutral-200 p-3 font-utility text-xs outline-none focus:border-black"
                                        value={newAddress.street}
                                        onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                                        required
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input 
                                            type="text" 
                                            placeholder="City" 
                                            className="w-full bg-neutral-50 border border-neutral-200 p-3 font-utility text-xs outline-none focus:border-black"
                                            value={newAddress.city}
                                            onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                                            required
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="State" 
                                            className="w-full bg-neutral-50 border border-neutral-200 p-3 font-utility text-xs outline-none focus:border-black"
                                            value={newAddress.state}
                                            onChange={e => setNewAddress({...newAddress, state: e.target.value})}
                                            required
                                        />
                                    </div>
                                     <div className="grid grid-cols-2 gap-4">
                                        <input 
                                            type="text" 
                                            placeholder="ZIP / Postal Code" 
                                            className="w-full bg-neutral-50 border border-neutral-200 p-3 font-utility text-xs outline-none focus:border-black"
                                            value={newAddress.zip}
                                            onChange={e => setNewAddress({...newAddress, zip: e.target.value})}
                                            required
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="Country" 
                                            className="w-full bg-neutral-50 border border-neutral-200 p-3 font-utility text-xs outline-none focus:border-black"
                                            value={newAddress.country}
                                            onChange={e => setNewAddress({...newAddress, country: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <button className="bg-primary text-white px-8 py-3 font-utility text-xs uppercase tracking-widest hover:opacity-90">
                                        Save Address
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
