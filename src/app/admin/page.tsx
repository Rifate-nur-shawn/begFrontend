"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api/axios";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, Users, ShoppingBag, DollarSign, Package } from "lucide-react";
import clsx from "clsx";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardStats {
  revenue: {
    total: number;
    growth: number;
  };
  orders: {
    total: number;
    pending: number;
    growth: number;
  };
  customers: {
    total: number;
    new: number;
    growth: number;
  };
  inventory: {
    lowStock: number;
    totalProducts: number;
  };
}

const MOCK_CHART_DATA = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
  { name: 'Jul', revenue: 3490 },
];

// Mock data until endpoints are fully integrated
const MOCK_STATS: DashboardStats = {
  revenue: { total: 125430, growth: 12.5 },
  orders: { total: 450, pending: 12, growth: 8.2 },
  customers: { total: 1205, new: 45, growth: 5.3 },
  inventory: { lowStock: 3, totalProducts: 156 },
};

function StatCard({ title, value, growth, icon: Icon, subValue }: any) {
    const isPositive = growth >= 0;
    
    return (
        <div className="bg-white p-6 rounded-sm border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-neutral-50 rounded-sm text-neutral-600">
                    <Icon size={20} strokeWidth={1.5} />
                </div>
                {growth !== undefined && (
                    <div className={clsx(
                        "flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full",
                        isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    )}>
                        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {Math.abs(growth)}%
                    </div>
                )}
            </div>
            
            <h3 className="text-neutral-500 text-xs uppercase tracking-widest font-utility mb-1">{title}</h3>
            <p className="text-2xl font-display text-neutral-900 mb-1">{value}</p>
            {subValue && <p className="text-xs text-neutral-400">{subValue}</p>}
        </div>
    );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch from /api/v1/admin/stats
    // For now, simulate loading
    setTimeout(() => {
        setStats(MOCK_STATS);
        setLoading(false);
    }, 1000);
  }, []);

  if (loading) return null; // Or skeleton

  return (
    <div>
        <div className="mb-8">
            <h1 className="font-display text-3xl text-neutral-900 mb-2">Dashboard</h1>
            <p className="text-neutral-500 text-sm">Overview of your store&apos;s performance.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
                title="Total Revenue" 
                value={formatCurrency(stats?.revenue.total || 0)} 
                growth={stats?.revenue.growth}
                icon={DollarSign}
                subValue="Last 30 days"
            />
            <StatCard 
                title="Total Orders" 
                value={stats?.orders.total} 
                growth={stats?.orders.growth}
                icon={ShoppingBag}
                subValue={`${stats?.orders.pending} pending to ship`}
            />
            <StatCard 
                title="Total Customers" 
                value={stats?.customers.total} 
                growth={stats?.customers.growth}
                icon={Users}
                subValue={`${stats?.customers.new} new this month`}
            />
             <StatCard 
                title="Inventory" 
                value={stats?.inventory.totalProducts} 
                icon={Package}
                subValue={`${stats?.inventory.lowStock} low stock items`}
            />
        </div>

        {/* Charts & Recent Orders Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sales Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-sm border border-neutral-100 shadow-sm min-h-[400px]">
                <h3 className="font-display text-lg mb-6">Revenue Over Time</h3>
                <div className="h-[300px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={MOCK_CHART_DATA}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0a0a0a" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#0a0a0a" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} tickFormatter={(value) => `$${value}`} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '4px' }} 
                                itemStyle={{ color: '#000', fontSize: '12px' }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#0a0a0a" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                     </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-sm border border-neutral-100 shadow-sm">
                <h3 className="font-display text-lg mb-6">Recent Orders</h3>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-neutral-50 last:border-0">
                            <div>
                                <p className="text-sm font-medium text-neutral-900">Order #102{i}</p>
                                <p className="text-xs text-neutral-500">2 min ago</p>
                            </div>
                            <span className="text-xs font-medium bg-green-50 text-green-600 px-2 py-1 rounded-sm">
                                Paid
                            </span>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-6 py-2 border border-neutral-200 text-xs uppercase tracking-widest hover:bg-neutral-50 transition-colors">
                    View All Orders
                </button>
            </div>
        </div>
    </div>
  );
}
