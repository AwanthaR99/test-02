"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { client } from "@/lib/sanity";
import { Package, LogOut, Heart, Clock, CheckCircle, ShoppingBag, User } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // User Authentication Check
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/");
    }
  }, [status]);

  // Fetch Orders Logic
  useEffect(() => {
    const fetchOrders = async () => {
      if (session?.user?.email) {
        
        
        
        const query = `*[_type == "order" && email == "${session.user.email}"] | order(createdAt desc) {
          _id,
          orderId,
          totalAmount,
          status,
          createdAt,
          items[]{
            title,
            quantity,
            price,
            size,
            color,
            "imageUrl": product->images[0].asset->url
          }
        }`;
        
        try {
          const data = await client.fetch(query);
          setOrders(data);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (session?.user?.email) {
      fetchOrders();
    } else if (status === "authenticated") {
        setLoading(false);
    }
  }, [session, status]);

  if (status === "loading" || loading) {
    return <div className="h-screen flex items-center justify-center font-bold text-gray-500 animate-pulse">Loading Profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4 md:px-8">
      
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-8 text-center md:text-left">
           My Account
        </h1>

        {session?.user && (
          // Profile Card
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center gap-8 mb-12">
            
            {/* User Image */}
            <div className="relative w-28 h-28 shrink-0">
               {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    fill
                    className="rounded-full object-cover border-4 border-gray-50 shadow-inner"
                  />
               ) : (
                  <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                     <User className="w-10 h-10 text-gray-400" />
                  </div>
               )}
            </div>

            {/* User Details */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{session.user.name}</h2>
              <p className="text-gray-500 font-medium mb-6">{session.user.email}</p>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <Link 
                    href="/wishlist" 
                    className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition shadow-lg shadow-black/20"
                  >
                    <Heart className="w-4 h-4" /> My Wishlist
                  </Link>

                  <button 
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-2 bg-white text-red-600 border border-red-200 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-red-50 transition"
                  >
                    <LogOut className="w-4 h-4" /> Log Out
                  </button>
              </div>
            </div>
          </div>
        )}

        {/* Order History Section */}
        <div>
          <h3 className="text-xl font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
             <Package className="w-5 h-5" /> Order History ({orders.length})
          </h3>
          
          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id || order.orderId} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-gray-100 gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-lg text-gray-900">#{order.orderId ? order.orderId.slice(-6).toUpperCase() : "Unknown"}</span>
                          
                          {/* Status Badge */}
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                            order.status === 'paid' || order.status === 'completed' || order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-50 text-yellow-700 border border-yellow-100'
                          }`}>
                            {order.status === 'paid' ? <CheckCircle className="w-3 h-3" /> : 
                             order.status === 'shipped' ? <Package className="w-3 h-3" /> : 
                             <Clock className="w-3 h-3" />}
                            {order.status || "Pending"}
                          </span>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                      
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) : "Date N/A"}
                      </p>
                    </div>
                    
                    <div className="text-left md:text-right">
                      <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Total Amount</p>
                      
                      <p className="font-black text-2xl text-gray-900">Rs. {(order.totalAmount || 0).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items && order.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                            {/* Product Image */}
                            <div className="relative w-12 h-12 bg-white rounded-md border border-gray-200 overflow-hidden flex-shrink-0">
                                {item.imageUrl ? (
                                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <ShoppingBag className="w-5 h-5" />
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <span className="font-medium text-gray-700">
                                    <span className="font-bold text-black mr-2">{item.quantity}x</span> 
                                    {item.title}
                                </span>
                                {/* Size & Color Display */}
                                <span className="text-xs text-gray-500 capitalize">
                                    {item.color && `${item.color} `}
                                    {item.color && item.size && "• "}
                                    {item.size && `Size: ${item.size}`}
                                </span>
                            </div>
                        </div>
                        <span className="font-semibold text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          ) : (
            // Empty Orders State
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold mb-1">No orders yet</h3>
              <p className="text-gray-500 mb-6 text-sm">Looks like you haven&apos;t made your first purchase.</p>
              <Link href="/shop" className="bg-black text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition">
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}