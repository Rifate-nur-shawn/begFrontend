"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import api from "@/lib/api/axios";
import { motion } from "framer-motion";
import WishlistTab from "@/components/account/WishlistTab";

export default function AccountPage() {
    const { isAuthenticated, user, isLoading, logout } = useAuthStore();
    const { openLogin } = useUIStore();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "wishlist">("orders");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [orders, setOrders] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [addresses, setAddresses] = useState<any[]>([]);
    
    // Form state - using backend field names
    const [isEditingAddress, setIsEditingAddress] = useState<string | null>(null);
    const [addressForm, setAddressForm] = useState({
        label: "",
        firstName: "",
        lastName: "",
        phone: "",
        addressLine: "",
        district: "",
        division: "",
        thana: "",
        postalCode: "",
        isDefault: false
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

    async function handleAddressSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            // Backend expects camelCase JSON field names
            const payload = {
                label: addressForm.label,
                firstName: addressForm.firstName,
                lastName: addressForm.lastName,
                phone: addressForm.phone,
                addressLine: addressForm.addressLine,
                district: addressForm.district,
                division: addressForm.division,
                thana: addressForm.thana,
                postalCode: addressForm.postalCode,
                isDefault: addressForm.isDefault
            };
            
            if (isEditingAddress) {
                await api.put(`/user/addresses/${isEditingAddress}`, payload);
            } else {
                await api.post('/user/addresses', payload);
            }
            
            // Reset
            setAddressForm({ 
                label: "", firstName: "", lastName: "", phone: "",
                addressLine: "", district: "", division: "", thana: "", postalCode: "", isDefault: false 
            });
            setIsEditingAddress(null);
            fetchAddresses();
        } catch (error) {
            console.error(error);
        }
    }

    async function handleDeleteAddress(id: string) {
        if (!confirm("Are you sure you want to delete this address?")) return;
        try {
            await api.delete(`/user/addresses/${id}`);
            fetchAddresses();
        } catch (error) {
            console.error(error);
        }
    }

    function startEditAddress(addr: any) {
        setIsEditingAddress(addr.id);
        setAddressForm({
            label: addr.label || "",
            firstName: addr.first_name || addr.firstName || "",
            lastName: addr.last_name || addr.lastName || "",
            phone: addr.phone || "",
            addressLine: addr.address_line || addr.addressLine || "",
            district: addr.district || "",
            division: addr.division || "",
            thana: addr.thana || "",
            postalCode: addr.postal_code || addr.postalCode || "",
            isDefault: addr.is_default || addr.isDefault || false
        });
        // Scroll to form if needed
    }

    if (isLoading || !isAuthenticated) {
        return null; // Or loading spinner
    }

    return (
        <div className="min-h-screen pt-32 pb-24 px-4 md:px-12 bg-canvas text-primary">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 flex justify-between items-start">
                    <div>
                        <h1 className="font-display text-4xl mb-2">My Account</h1>
                        <p className="font-utility text-xs tracking-widest uppercase text-neutral-500">
                            Hello, {user?.email}
                        </p>
                    </div>
                    <button 
                        onClick={() => logout()}
                        className="font-utility text-xs tracking-widest uppercase text-neutral-500 hover:text-primary border border-neutral-300 px-4 py-2 hover:border-primary transition-colors"
                    >
                        Sign Out
                    </button>
                </header>

                <div className="flex gap-8 mb-12 border-b border-neutral-200 pb-4 overflow-x-auto">
                    <button 
                        onClick={() => setActiveTab("orders")}
                        className={`font-utility text-xs tracking-widest uppercase pb-4 -mb-4 transition-colors whitespace-nowrap ${activeTab === 'orders' ? 'border-b-2 border-primary' : 'text-neutral-400'}`}
                    >
                        Order History
                    </button>
                    <button 
                        onClick={() => setActiveTab("wishlist")}
                        className={`font-utility text-xs tracking-widest uppercase pb-4 -mb-4 transition-colors whitespace-nowrap ${activeTab === 'wishlist' ? 'border-b-2 border-primary' : 'text-neutral-400'}`}
                    >
                        Wishlist
                    </button>
                    <button 
                         onClick={() => setActiveTab("addresses")}
                         className={`font-utility text-xs tracking-widest uppercase pb-4 -mb-4 transition-colors whitespace-nowrap ${activeTab === 'addresses' ? 'border-b-2 border-primary' : 'text-neutral-400'}`}
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

                    {activeTab === 'wishlist' && <WishlistTab />}

                    {activeTab === 'addresses' && (
                         <div className="space-y-12">
                             {/* List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {addresses.length === 0 ? (
                                    <p className="font-utility text-xs tracking-widest text-neutral-500">No addresses saved yet.</p>
                                ) : addresses.map((addr) => (
                                    <div key={addr.id} className="border border-neutral-200 p-6 relative group">
                                        {addr.label && (
                                            <p className="font-utility text-[10px] uppercase tracking-wider text-neutral-500 mb-2">
                                                {addr.label} {addr.is_default && <span className="text-green-600">• Default</span>}
                                            </p>
                                        )}
                                        <p className="font-utility text-sm font-medium mb-1">
                                            {addr.first_name || addr.firstName} {addr.last_name || addr.lastName}
                                        </p>
                                        {addr.phone && (
                                            <p className="font-utility text-xs text-neutral-500 mb-3">{addr.phone}</p>
                                        )}
                                        <p className="font-utility text-xs leading-relaxed mb-4">
                                            {addr.address_line || addr.addressLine}<br/>
                                            {addr.thana && `${addr.thana}, `}{addr.district}<br/>
                                            {addr.division} {addr.postal_code || addr.postalCode}
                                        </p>
                                        <div className="flex gap-4 pt-4 border-t border-neutral-100">
                                            <button 
                                                onClick={() => startEditAddress(addr)}
                                                className="text-[10px] uppercase tracking-wider text-neutral-400 hover:text-black"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteAddress(addr.id)}
                                                className="text-[10px] uppercase tracking-wider text-neutral-400 hover:text-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add/Edit Form */}
                            <div className="max-w-lg">
                                <h3 className="font-display text-2xl mb-6">{isEditingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                                <form onSubmit={handleAddressSubmit} className="space-y-4">
                                    <input 
                                        type="text" 
                                        placeholder="Label (e.g., Home, Office)" 
                                        className="w-full bg-neutral-50 border border-neutral-200 p-3 font-utility text-xs outline-none focus:border-black"
                                        value={addressForm.label}
                                        onChange={e => setAddressForm({...addressForm, label: e.target.value})}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input 
                                            type="text" 
                                            placeholder="First Name" 
                                            className="w-full bg-neutral-50 border border-neutral-200 p-3 font-utility text-xs outline-none focus:border-black"
                                            value={addressForm.firstName}
                                            onChange={e => setAddressForm({...addressForm, firstName: e.target.value})}
                                            required
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="Last Name" 
                                            className="w-full bg-neutral-50 border border-neutral-200 p-3 font-utility text-xs outline-none focus:border-black"
                                            value={addressForm.lastName}
                                            onChange={e => setAddressForm({...addressForm, lastName: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <input 
                                        type="tel" 
                                        placeholder="Phone Number" 
                                        className="w-full bg-neutral-50 border border-neutral-200 p-3 font-utility text-xs outline-none focus:border-black"
                                        value={addressForm.phone}
                                        onChange={e => setAddressForm({...addressForm, phone: e.target.value})}
                                        required
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Address Line (Street, House No.)" 
                                        className="w-full bg-neutral-50 border border-neutral-200 p-3 font-utility text-xs outline-none focus:border-black"
                                        value={addressForm.addressLine}
                                        onChange={e => setAddressForm({...addressForm, addressLine: e.target.value})}
                                        required
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input 
                                            type="text" 
                                            placeholder="Thana / Upazila" 
                                            className="w-full bg-neutral-50 border border-neutral-200 p-3 font-utility text-xs outline-none focus:border-black"
                                            value={addressForm.thana}
                                            onChange={e => setAddressForm({...addressForm, thana: e.target.value})}
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="District" 
                                            className="w-full bg-neutral-50 border border-neutral-200 p-3 font-utility text-xs outline-none focus:border-black"
                                            value={addressForm.district}
                                            onChange={e => setAddressForm({...addressForm, district: e.target.value})}
                                            required
                                        />
                                    </div>
                                     <div className="grid grid-cols-2 gap-4">
                                        <input 
                                            type="text" 
                                            placeholder="Division" 
                                            className="w-full bg-neutral-50 border border-neutral-200 p-3 font-utility text-xs outline-none focus:border-black"
                                            value={addressForm.division}
                                            onChange={e => setAddressForm({...addressForm, division: e.target.value})}
                                            required
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="Postal Code" 
                                            className="w-full bg-neutral-50 border border-neutral-200 p-3 font-utility text-xs outline-none focus:border-black"
                                            value={addressForm.postalCode}
                                            onChange={e => setAddressForm({...addressForm, postalCode: e.target.value})}
                                        />
                                    </div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="checkbox"
                                            checked={addressForm.isDefault}
                                            onChange={e => setAddressForm({...addressForm, isDefault: e.target.checked})}
                                            className="w-4 h-4"
                                        />
                                        <span className="font-utility text-xs">Set as default address</span>
                                    </label>
                                    <div className="flex gap-4 pt-2">
                                        <button type="submit" className="bg-primary text-white px-8 py-3 font-utility text-xs uppercase tracking-widest hover:opacity-90">
                                            {isEditingAddress ? 'Update Address' : 'Save Address'}
                                        </button>
                                        {isEditingAddress && (
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    setIsEditingAddress(null);
                                                    setAddressForm({ 
                                                        label: "", firstName: "", lastName: "", phone: "",
                                                        addressLine: "", district: "", division: "", thana: "", postalCode: "", isDefault: false 
                                                    });
                                                }}
                                                className="text-neutral-500 font-utility text-xs uppercase tracking-widest hover:text-black"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
