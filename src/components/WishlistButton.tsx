"use client";

import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { client } from "@/lib/sanity"; // 🚨 Sanity client එක ඉම්පෝර්ට් කරගන්න

export default function WishlistButton({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🚨 1. INITIAL CHECK: පේජ් එක ලෝඩ් වෙද්දීම මේ බඩුව දැනටමත් Wishlist එකේ තියෙනවද බලනවා
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!session?.user?.email || !productId) return;
      try {
        // User ගේ wishlist array එක ඇතුළේ මේ productId එක තියෙනවද කියලා Sanity එකෙන් කෙලින්ම අහනවා
        const query = `*[_type == "user" && email == "${session.user.email}" && "${productId}" in wishlist[]._ref][0]`;
        const result = await client.fetch(query);
        
        // රිසල්ට් එකක් ආවොත් ඒ කියන්නේ දැනටමත් ලයික් කරලා තියෙන්නේ
        if (result) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [productId, session]);

  const toggleWishlist = async () => {
    if (!session?.user?.email) {
      alert("Please login to save items! ❤️");
      return;
    }

    setLoading(true);
    const action = isLiked ? "remove" : "add";

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          userEmail: session.user.email,
          action,
        }),
      });

      if (res.ok) {
        setIsLiked(!isLiked); 
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`p-3 rounded-full border transition-all ${
        isLiked 
          ? "bg-red-50 border-red-200 text-red-500 animate-pulse" 
          : "bg-white border-gray-200 text-gray-400 hover:bg-gray-100"
      }`}
    >
      <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
    </button>
  );
}