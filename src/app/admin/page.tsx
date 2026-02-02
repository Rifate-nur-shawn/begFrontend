"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api/axios";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, Users, ShoppingBag, DollarSign, Package, RefreshCw } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  uniqueCustomers: number;
  totalProducts: number;
  lowStockCount: number;
}

interface RecentOrder {
  id: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  user?: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

interface DailySale {
  date: string;
  order_count: number;
  total_revenue: string;
  avg_order_value: string;
}

function StatCard({ title, value, growth, icon: Icon, subValue, loading }: any) {
    const isPositive = growth >= 0;
    
    return (
        <div className="bg-white p-6 rounded-sm border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-neutral-50 rounded-sm text-neutral-600">
                    <Icon size={20} strokeWidth={1.5} />
                </div>
                {growth !== undefined && growth !== null && (
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
            {loading ? (
                <div className="h-8 bg-neutral-100 animate-pulse rounded w-24 mb-1"></div>
            ) : (
                <p className="text-2xl font-display text-neutral-900 mb-1">{value}</p>
            )}
            {subValue && <p className="text-xs text-neutral-400">{subValue}</p>}
        </div>
    );
}

function getDateRange(days: number) {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
    };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [chartData, setChartData] = useState<{name: string, revenue: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchDashboardData() {
    setLoading(true);
    setError(null);
    
    const { start, end } = getDateRange(30);
    const chartRange = getDateRange(180); // Last 6 months for chart
    
    console.log('Fetching dashboard data with date range:', { start, end });
    
    try {
      // Fetch KPIs
      const [kpisRes, ordersRes, productsRes, usersRes, lowStockRes, revenueRes] = await Promise.allSettled([
        api.get(`/admin/stats/kpis?start=${start}&end=${end}`),
        api.get('/admin/orders?limit=5'),
        api.get('/admin/products?limit=1'),
        api.get('/admin/users?limit=1'),
        api.get('/admin/stats/inventory/low-stock?threshold=10&limit=50'),
        api.get(`/admin/stats/revenue?start=${chartRange.start}&end=${chartRange.end}&limit=180`)
      ]);
      
      // Debug log all responses
      console.log('API Responses:', {
        kpis: kpisRes.status === 'fulfilled' ? kpisRes.value.data : kpisRes.reason?.message,
        orders: ordersRes.status === 'fulfilled' ? ordersRes.value.data : ordersRes.reason?.message,
        products: productsRes.status === 'fulfilled' ? productsRes.value.data : productsRes.reason?.message,
        users: usersRes.status === 'fulfilled' ? usersRes.value.data : usersRes.reason?.message,
        lowStock: lowStockRes.status === 'fulfilled' ? lowStockRes.value.data : lowStockRes.reason?.message,
        revenue: revenueRes.status === 'fulfilled' ? revenueRes.value.data : revenueRes.reason?.message,
      });
      
      // Check if most APIs failed (likely auth issue)
      const failedCount = [kpisRes, ordersRes, productsRes].filter(r => r.status === 'rejected').length;
      if (failedCount >= 2) {
        setError('Unable to fetch admin data. Please ensure you are logged in as an admin user.');
      }
      
      // Parse KPIs
      let kpis = { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0, uniqueCustomers: 0 };
      if (kpisRes.status === 'fulfilled' && kpisRes.value.data) {
        const data = kpisRes.value.data;
        kpis = {
          totalOrders: Number(data.total_orders) || 0,
          totalRevenue: parseFloat(data.total_revenue) || 0,
          avgOrderValue: parseFloat(data.avg_order_value) || 0,
          uniqueCustomers: Number(data.unique_customers) || 0
        };
      }
      
      // Parse products count
      let totalProducts = 0;
      if (productsRes.status === 'fulfilled') {
        totalProducts = productsRes.value.data?.total || productsRes.value.data?.data?.length || 0;
      }
      
      // Parse low stock count
      let lowStockCount = 0;
      if (lowStockRes.status === 'fulfilled') {
        lowStockCount = Array.isArray(lowStockRes.value.data) ? lowStockRes.value.data.length : 0;
      }
      
      setStats({
        totalRevenue: kpis.totalRevenue,
        totalOrders: kpis.totalOrders,
        avgOrderValue: kpis.avgOrderValue,
        uniqueCustomers: kpis.uniqueCustomers,
        totalProducts,
        lowStockCount
      });
      
      // Parse recent orders
      if (ordersRes.status === 'fulfilled') {
        const ordersData = ordersRes.value.data?.orders || ordersRes.value.data?.data || ordersRes.value.data || [];
        console.log('Parsed orders:', ordersData);
        setRecentOrders(Array.isArray(ordersData) ? ordersData.slice(0, 5) : []);
      }
      
      // Parse chart data - aggregate by month
      if (revenueRes.status === 'fulfilled') {
        const salesData: DailySale[] = revenueRes.value.data || [];
        
        // Group by month
        const monthlyData: Record<string, number> = {};
        salesData.forEach((sale: DailySale) => {
          const date = new Date(sale.date);
          const monthKey = date.toLocaleString('default', { month: 'short' });
          monthlyData[monthKey] = (monthlyData[monthKey] || 0) + parseFloat(sale.total_revenue || '0');
        });
        
        // Convert to chart format
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        
        // Get last 7 months
        const chartPoints = [];
        for (let i = 6; i >= 0; i--) {
          const monthIdx = (currentMonth - i + 12) % 12;
          const monthName = monthNames[monthIdx];
          chartPoints.push({
            name: monthName,
            revenue: Math.round(monthlyData[monthName] || 0)
          });
        }
        
        setChartData(chartPoints);
      }
      
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  function formatRelativeTime(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

  function getStatusColor(status: string) {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('paid') || statusLower.includes('completed') || statusLower.includes('delivered')) {
      return 'bg-green-50 text-green-600';
    }
    if (statusLower.includes('pending') || statusLower.includes('processing')) {
      return 'bg-yellow-50 text-yellow-600';
    }
    if (statusLower.includes('cancel') || statusLower.includes('fail')) {
      return 'bg-red-50 text-red-600';
    }
    return 'bg-neutral-50 text-neutral-600';
  }

  return (
    <div>
        <div className="mb-8 flex justify-between items-start">
            <div>
                <h1 className="font-display text-3xl text-neutral-900 mb-2">Dashboard</h1>
                <p className="text-neutral-500 text-sm">Overview of your store&apos;s performance.</p>
            </div>
            <button 
                onClick={fetchDashboardData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest border border-neutral-300 hover:bg-neutral-50 transition-colors disabled:opacity-50"
            >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                Refresh
            </button>
        </div>

        {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
                {error}
            </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
                title="Total Revenue" 
                value={formatCurrency(stats?.totalRevenue || 0)} 
                icon={DollarSign}
                subValue="Last 30 days"
                loading={loading}
            />
            <StatCard 
                title="Total Orders" 
                value={stats?.totalOrders || 0} 
                icon={ShoppingBag}
                subValue={`Avg: ${formatCurrency(stats?.avgOrderValue || 0)}`}
                loading={loading}
            />
            <StatCard 
                title="Unique Customers" 
                value={stats?.uniqueCustomers || 0} 
                icon={Users}
                subValue="Last 30 days"
                loading={loading}
            />
             <StatCard 
                title="Inventory" 
                value={stats?.totalProducts || 0} 
                icon={Package}
                subValue={`${stats?.lowStockCount || 0} low stock items`}
                loading={loading}
            />
        </div>

        {/* Charts & Recent Orders Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sales Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-sm border border-neutral-100 shadow-sm min-h-[400px]">
                <h3 className="font-display text-lg mb-6">Revenue Over Time</h3>
                <div className="h-[300px] w-full">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0a0a0a" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#0a0a0a" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} tickFormatter={(value) => `৳${value}`} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '4px' }} 
                                    formatter={(value) => [`৳${(value as number || 0).toLocaleString()}`, 'Revenue']}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#0a0a0a" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-neutral-400">
                            {loading ? 'Loading chart data...' : 'No revenue data available'}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-sm border border-neutral-100 shadow-sm">
                <h3 className="font-display text-lg mb-6">Recent Orders</h3>
                <div className="space-y-4">
                    {loading ? (
                        // Skeleton loader
                        [...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between py-3 border-b border-neutral-50 last:border-0">
                                <div className="space-y-2">
                                    <div className="h-4 bg-neutral-100 rounded w-24 animate-pulse"></div>
                                    <div className="h-3 bg-neutral-100 rounded w-16 animate-pulse"></div>
                                </div>
                                <div className="h-6 bg-neutral-100 rounded w-12 animate-pulse"></div>
                            </div>
                        ))
                    ) : recentOrders.length > 0 ? (
                        recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between py-3 border-b border-neutral-50 last:border-0">
                                <div>
                                    <p className="text-sm font-medium text-neutral-900">
                                        Order #{order.id.slice(0, 8)}...
                                    </p>
                                    <p className="text-xs text-neutral-500">
                                        {formatRelativeTime(order.createdAt)} • {formatCurrency(order.totalAmount)}
                                    </p>
                                </div>
                                <span className={clsx(
                                    "text-xs font-medium px-2 py-1 rounded-sm capitalize",
                                    getStatusColor(order.paymentStatus || order.status)
                                )}>
                                    {order.paymentStatus || order.status}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-neutral-400 py-4 text-center">No recent orders</p>
                    )}
                </div>
                <Link 
                    href="/admin?tab=orders"
                    className="block w-full mt-6 py-2 border border-neutral-200 text-xs uppercase tracking-widest hover:bg-neutral-50 transition-colors text-center"
                >
                    View All Orders
                </Link>
            </div>
        </div>
    </div>
  );
}
