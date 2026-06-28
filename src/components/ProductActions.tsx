"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

interface ProductActionsProps {
  product: any;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const { addToCart } = useCart();
  
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || "");


  const currentVariant = product.stock?.find(
    (s: any) => s.color === selectedColor && s.size === selectedSize
  );
  
  const currentStock = currentVariant ? currentVariant.quantity : 0;
  const isOutOfStock = currentVariant ? currentStock === 0 : false;

  
  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return { text: "Out of Stock ❌", className: "text-red-600 bg-red-50 border-red-100" };
    }
    if (stock >= 1 && stock <= 5) {
      return { text: `Only ${stock} Left! 🔥`, className: "text-red-600 bg-red-50 border-red-200 font-black animate-pulse" };
    }
    if (stock >= 6 && stock <= 10) {
      return { text: "Low Stock ⚠️", className: "text-amber-600 bg-amber-50 border-amber-200 font-black" };
    }
    // stock > 10 
    return { text: "In Stock ✓", className: "text-green-600 bg-green-50 border-green-100 font-bold" };
  };

  const stockStatus = getStockStatus(currentStock);

  const handleAddToCart = () => {
    if (product.sizes && !selectedSize) {
        alert("Please select a size!");
        return;
    }
    if (product.colors && !selectedColor) {
        alert("Please select a color!");
        return;
    }
    if (isOutOfStock) {
        alert("Sorry, this item is out of stock!");
        return;
    }

    addToCart({
      id: product._id,
      title: product.title,
      price: product.price,
      image: product.imageUrl,
      quantity: 1,
      size: selectedSize,   
      color: selectedColor, 
      category: product.categoryValue || "men"
    });
    
    alert("Added to Cart! 🛒");
  };

  return (
    <div className="space-y-6">
      
      {/* 🚨 3. UPDATE: DYNAMIC STOCK BADGE DISPLAY */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Availability</span>
        <span className={`text-xs uppercase px-3 py-1.5 rounded-full border tracking-wide font-black transition-all ${stockStatus.className}`}>
          {stockStatus.text}
        </span>
      </div>

      {/* 1. Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900">Size</h3>
          <div className="flex gap-3 mt-2">
            {product.sizes.map((size: string) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded-md text-sm font-medium transition ${
                  selectedSize === size
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-900 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900">Color</h3>
          <div className="flex gap-3 mt-2">
            {product.colors.map((color: string) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 border rounded-md text-sm font-medium transition ${
                  selectedColor === color
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-900 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Add to Cart Button (🚨 UPDATE: OUT OF STOCK  DISABLE) */}
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className={`w-full py-4 rounded-lg text-lg font-bold transition shadow-lg active:scale-95 ${
          isOutOfStock 
            ? "bg-gray-200 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none active:scale-100" 
            : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        {isOutOfStock ? "Out of Stock" : `Add to Cart - Rs. ${product.price.toLocaleString()}`}
      </button>
    </div>
  );
}