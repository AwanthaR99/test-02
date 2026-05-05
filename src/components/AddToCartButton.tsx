"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();
  
  // State: chooses color and size store
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handleAddToCart = () => {
    // 1. Validation: Size 
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Please select a size! 📏");
      return;
    }

    // 2. Validation: Color 
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      alert("Please select a color! 🎨");
      return;
    }

    // 3. put to the cart
    addToCart({
      id: product._id,
      title: product.title,
      price: product.price,
      image: product.imageUrl,
      quantity: 1,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
    });

    alert("Added to cart! 🛒");
  };

  return (
    <div className="flex flex-col">
      
      {/* Selectors Section */}
      <div className="space-y-4 mb-8">
        
        {/* Sizes Selector */}
        {product.sizes && product.sizes.length > 0 && (
          <div>
            <span className="font-semibold text-gray-700 mr-3">Size:</span>
            <div className="inline-flex gap-2 flex-wrap">
              {product.sizes.map((size: string) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded border transition ${
                    selectedSize === size
                      ? "bg-black text-white border-black" // if Select 
                      : "border-gray-300 hover:border-black text-gray-700" // if not Select
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Colors Selector */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-4">
            <span className="font-semibold text-gray-700 mr-3">Color:</span>
            <div className="inline-flex gap-2 flex-wrap">
              {product.colors.map((color: string) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded border transition ${
                    selectedColor === color
                      ? "bg-black text-white border-black" // if Select 
                      : "border-gray-300 hover:border-black text-gray-700" // if not Select 
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="w-full bg-black text-white py-4 rounded-lg text-lg font-bold hover:bg-gray-800 transition shadow-lg transform active:scale-95"
      >
        Add to Cart - Rs. {product.price}
      </button>

    </div>
  );
}