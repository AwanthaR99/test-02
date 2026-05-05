"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { client } from "@/lib/sanity";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// admins mails here but this is not the final stage for the userrole login
const ADMIN_EMAILS = ["sachirathnayake9@gmail.com", "amilafashion@gmail.com"];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  // 1. Security Check if the logged persons email not matching to the admins mail,throws to the home page
  useEffect(() => {
    if (status === "authenticated") {
      if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
        router.push("/"); // redirect to the home
      }
    } else if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, session, router]);

  // 2. Data Fetching: getting orders from Sanity 
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Paid Orders getting
        const query = `*[_type == "order" && status == 'paid'] | order(createdAt desc)`;
        const data = await client.fetch(query);
        setOrders(data);

        // creale whole Revenue
        const total = data.reduce((acc: number, order: any) => acc + (order.totalAmount || 0), 0);
        setTotalRevenue(total);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  if (loading || status === "loading") {
    return <div className="flex h-screen items-center justify-center">Loading Dashboard...</div>;
  }

  // creating data that needs to the chart, as a example using 5 data
  const chartData = orders.slice(0, 5).map(order => ({
    name: order.orderId.slice(-4), 
    amount: order.totalAmount
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard 📊</h1>

        {/* 3. Stat Cards  */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Card 1: Total Revenue */}
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-800">Rs. {totalRevenue.toLocaleString()}</p>
          </div>

          {/* Card 2: Total Orders */}
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-medium">Total Orders (Paid)</h3>
            <p className="text-3xl font-bold text-gray-800">{orders.length}</p>
          </div>

          {/* Card 3: Pending Orders (Placeholder Logic) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
            <h3 className="text-gray-500 text-sm font-medium">System Status</h3>
            <p className="text-xl font-bold text-green-600">Active ✅</p>
          </div>
        </div>

        {/* 4. Chart Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
            <h2 className="text-xl font-bold mb-4">Recent Sales Performance</h2>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="amount" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* 5. Recent Orders Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-bold">Recent Transactions</h2>
            </div>
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                    <tr>
                        <th className="px-6 py-3">Order ID</th>
                        <th className="px-6 py-3">Customer</th>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {order.orderId}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {order.customerName || order.email}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                                Rs. {order.totalAmount}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

      </div>
    </div>
  );
}