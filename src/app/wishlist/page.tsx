"use client";

import { client } from "@/lib/sanity";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, Star } from "lucide-react";

export default function WishlistPage() {
  const { data: session } = useSession();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    if (!session?.user?.email) return;
    try {
      const query = `*[_type == "user" && email == "${session.user.email}"] | order(_id asc)[0] {
        wishlist[]-> {
          _id,
          title,
          price,
          "image": images[0].asset->url,
          "slug": slug.current,
          "category": category->slug.current, 
          "categoryTitle": category->title,
          occasion
        }
      }`;
      
      
      const data = await client.fetch(
        query,
        {},
        {
          cache: "no-store",
          next: { revalidate: 0 }
        }
      );
      
      const rawList = data?.wishlist || [];

      
      const uniqueItems = rawList.filter(
        (item: any, index: number, self: any[]) =>
          item && self.findIndex((t) => t._id === item._id) === index
      );

      setWishlistItems(uniqueItems);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    if (session?.user?.email) {
      fetchWishlist();
      
     
      window.addEventListener("focus", fetchWishlist);
      return () => window.removeEventListener("focus", fetchWishlist);
    }
  }, [session?.user?.email]);

  const handleRemoveFromWishlist = async (productId: string) => {
    if (!session?.user?.email) return;
    try {
      setWishlistItems((prev) => prev.filter((item) => item._id !== productId));

      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: session.user.email,
          productId: productId,
          action: "remove", 
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      fetchWishlist();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-bounce font-black uppercase text-xs tracking-widest text-gray-400">
          Loading Your Favorites...
        </div>
      </div>
    );
  }

  // Safe String Filtering Logic
  const menCasual = wishlistItems.filter(
    (item) => 
      typeof item.category === "string" && item.category.toLowerCase() === "men" && 
      typeof item.occasion === "string" && item.occasion.toLowerCase() === "casual"
  );
  
  const menOffice = wishlistItems.filter(
    (item) => 
      typeof item.category === "string" && item.category.toLowerCase() === "men" && 
      typeof item.occasion === "string" && item.occasion.toLowerCase() === "office"
  );
  
  const womenCasual = wishlistItems.filter(
    (item) => 
      typeof item.category === "string" && item.category.toLowerCase() === "women" && 
      typeof item.occasion === "string" && item.occasion.toLowerCase() === "casual"
  );
  
  const womenOffice = wishlistItems.filter(
    (item) => 
      typeof item.category === "string" && item.category.toLowerCase() === "women" && 
      typeof item.occasion === "string" && item.occasion.toLowerCase() === "office"
  );

  const otherFavorites = wishlistItems.filter(
    (item) => 
      !menCasual.includes(item) && 
      !menOffice.includes(item) && 
      !womenCasual.includes(item) && 
      !womenOffice.includes(item)
  );

  const ProductCard = ({ item }: { item: any }) => (
    <div className="group relative bg-white border border-gray-100 rounded-sm overflow-hidden shadow-xs hover:shadow-md transition duration-300">
      <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
        <Image
          src={item.image || "/placeholder.jpg"}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          onClick={() => handleRemoveFromWishlist(item._id)}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-xs rounded-full text-gray-500 hover:text-red-600 hover:bg-white shadow-xs transition z-10"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-sm uppercase tracking-tight text-gray-900 line-clamp-1 group-hover:text-amber-600 transition">
          {item.title}
        </h3>
        <p className="text-sm font-black text-gray-900 mt-1">
          Rs. {item.price?.toLocaleString()}.00
        </p>
        
        <div className="flex gap-2 mt-4">
          <Link
            href={`/product/${item.slug}`}
            className="flex-1 bg-black text-white text-center py-2 rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-gray-900 transition flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-3 h-3" /> View Product
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        <div className="text-center mb-16">
          <div className="inline-flex p-3 bg-red-50 rounded-full text-red-500 mb-4">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter text-gray-900">
            Your Wishlist
          </h1>
          <p className="text-xs uppercase tracking-widest text-gray-400 mt-2 font-medium">
            Keep track of the styles you love ({wishlistItems.length} items)
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-sm">
            <p className="text-gray-500 text-sm font-medium">Your wishlist is currently empty.</p>
            <Link href="/shop" className="mt-4 inline-block bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-900 transition rounded-sm">
              Explore Shop
            </Link>
          </div>
        ) : (
          <div className="space-y-16">
            
            {menCasual.length > 0 && (
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight text-gray-900 mb-6 border-l-4 border-black pl-3">🕺 Men's Casual Wear</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {menCasual.map((item, idx) => <ProductCard key={`${item._id}-mc-${idx}`} item={item} />)}
                </div>
              </div>
            )}

            {menOffice.length > 0 && (
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight text-gray-900 mb-6 border-l-4 border-black pl-3">💼 Men's Office Wear</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {menOffice.map((item, idx) => <ProductCard key={`${item._id}-mo-${idx}`} item={item} />)}
                </div>
              </div>
            )}

            {womenCasual.length > 0 && (
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight text-gray-900 mb-6 border-l-4 border-black pl-3">💃 Women's Casual Wear</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {womenCasual.map((item, idx) => <ProductCard key={`${item._id}-wc-${idx}`} item={item} />)}
                </div>
              </div>
            )}

            {womenOffice.length > 0 && (
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight text-gray-900 mb-6 border-l-4 border-black pl-3">👠 Women's Office Wear</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {womenOffice.map((item, idx) => <ProductCard key={`${item._id}-wo-${idx}`} item={item} />)}
                </div>
              </div>
            )}

            {otherFavorites.length > 0 && (
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight text-gray-955 mb-6 border-l-4 border-amber-500 pl-3 flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> Other Favorites
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {otherFavorites.map((item, idx) => <ProductCard key={`${item._id}-of-${idx}`} item={item} />)}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}