"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { client } from "@/lib/sanity";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Package, AlertTriangle, Users, DollarSign } from "lucide-react";

const ADMIN_EMAILS = ["sachirathnayake9@gmail.com", "amilafashion@gmail.com"];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Security Check
  useEffect(() => {
    if (status === "authenticated") {
      if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
        router.push("/"); 
      }
    } else if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, session, router]);

  // Fetch Data from Sanity (Orders & Products)
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch Paid Orders & Products at the same time
        const [ordersData, productsData] = await Promise.all([
          client.fetch(`*[_type == "order" && status == 'paid'] | order(createdAt desc)`),
          client.fetch(`*[_type == "product"] { title, stock }`)
        ]);

        setOrders(ordersData);

        // 2. Calculate Total Revenue
        const revenue = ordersData.reduce((acc: number, order: any) => acc + (order.totalAmount || 0), 0);
        setTotalRevenue(revenue);

        // 3. Calculate Low Stock Items (Quantity <= 5)
        let lowStockItems = 0;
        productsData.forEach((product: any) => {
          if (product.stock) {
            product.stock.forEach((variant: any) => {
              if (variant.quantity <= 5) lowStockItems++;
            });
          }
        });
        setLowStockCount(lowStockItems);

        // 4. Calculate Top Selling Products
        const productSales: Record<string, number> = {};
        ordersData.forEach((order: any) => {
          order.items?.forEach((item: any) => {
            if (item.title) {
              productSales[item.title] = (productSales[item.title] || 0) + item.quantity;
            }
          });
        });

        // Convert to array and sort by top 5
        const sortedTopProducts = Object.entries(productSales)
          .map(([title, qty]) => ({ title, qty }))
          .sort((a, b) => b.qty - a.qty)
          .slice(0, 5);
        
        setTopProducts(sortedTopProducts);
        setLoading(false);

      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchDashboardData();
    }
  }, [status]);

  if (loading || status === "loading") {
    return <div className="flex h-screen items-center justify-center font-bold text-gray-500 animate-pulse">Loading Analytics...</div>;
  }

  // Prepare Chart Data (Last 5 Orders trend)
  const chartData = orders.slice(0, 7).reverse().map(order => ({
    name: new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'short' }),
    amount: order.totalAmount
  }));

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 font-medium mt-1">Welcome back! Here's what's happening in your store today.</p>
        </div>

        {/* --- STAT CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-indigo-500 transition-colors">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Total Revenue</p>
              <h3 className="text-2xl font-black text-slate-800">Rs. {totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="h-12 w-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <DollarSign size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-blue-500 transition-colors">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Paid Orders</p>
              <h3 className="text-2xl font-black text-slate-800">{orders.length}</h3>
            </div>
            <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <Package size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-red-500 transition-colors">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Low Stock Alerts</p>
              <h3 className="text-2xl font-black text-red-600">{lowStockCount} Variants</h3>
            </div>
            <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform animate-pulse">
              <AlertTriangle size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-green-500 transition-colors">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Customers</p>
              <h3 className="text-2xl font-black text-slate-800">Active</h3>
            </div>
            <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
          </div>

        </div>

        {/* --- CHARTS & TOP SELLERS SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <TrendingUp size={20} className="text-indigo-500"/> Revenue Trend
              </h2>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0"/>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="amount" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products List */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-black text-slate-800 mb-6">Top Selling Items 🔥</h2>
            <div className="space-y-4">
              {topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm">
                        {index + 1}
                      </div>
                      <p className="font-bold text-slate-700 text-sm">{product.title}</p>
                    </div>
                    <span className="text-xs font-black bg-white px-2 py-1 rounded-md border border-slate-200 text-slate-600">
                      {product.qty} Sold
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-10">No sales data yet.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}