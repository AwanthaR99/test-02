"use client";

import { useState, useEffect } from "react";
// 4 වෙනි පේළියට මේක replace කරන්න:
import { client, writeClient } from "../../../../sanity/lib/client";
import { ShoppingCart, Trash2, Printer, User, Phone, Search } from "lucide-react";

export default function POSBilling() {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  // Customer Details
  const [customerName, setCustomerName] = useState("Walk-in Customer");
  const [customerPhone, setCustomerPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Sanity එකෙන් Products සහ ඒවායේ Variants (Stock Array) ඔක්කොම Load කරගැනීම
  useEffect(() => {
    const fetchProducts = async () => {
      const data = await client.fetch(`*[_type == "product"] { _id, title, price, stock }`);
      setProducts(data);
    };
    fetchProducts();
  }, []);

  // 2. Name හෝ SKU එකෙන් Live Search කිරීමේ ලොජික් එක
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setSearchResults([]);
      return;
    }

    const results: any[] = [];
    products.forEach(product => {
      if (product.stock) {
        product.stock.forEach((variant: any) => {
          const titleMatch = product.title.toLowerCase().includes(query.toLowerCase());
          const skuMatch = variant.sku && variant.sku.toLowerCase().includes(query.toLowerCase());
          
          if (titleMatch || skuMatch) {
            results.push({
              productId: product._id,
              title: product.title,
              price: product.price || 0,
              sku: variant.sku || "N/A",
              color: variant.color || "N/A",
              size: variant.size || "N/A",
              inStoreStock: variant.inStoreStock || 0,
              variantKey: variant._key // Sanity array එකේ unique patch එක කරන්න ඕනේ key එක
            });
          }
        });
      }
    });
    setSearchResults(results);
  };

  // 3. 🖨️ Barcode Scanner Integration (Enter වැදුණු සැනින් Auto Add ටු Cart)
  const handleBarcodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery) {
      e.preventDefault();
      
      // SKU එක 100%ක්ම සමාන Variant එකක් සෙවීම
      let matchedVariant: any = null;
      products.forEach(product => {
        product.stock?.forEach((v: any) => {
          if (v.sku && v.sku.toUpperCase() === searchQuery.toUpperCase()) {
            matchedVariant = {
              productId: product._id,
              title: product.title,
              price: product.price || 0,
              sku: v.sku,
              color: v.color || "N/A",
              size: v.size || "N/A",
              inStoreStock: v.inStoreStock || 0,
              variantKey: v._key
            };
          }
        });
      });

      if (matchedVariant) {
        addToCart(matchedVariant);
        setSearchQuery("");
        setSearchResults([]);
      } else {
        alert("⚠️ මෙම SKU ටැග් එකට අදාළ භාණ්ඩයක් ඉන්වෙන්ටරි එකේ නැත!");
      }
    }
  };

  const addToCart = (item: any) => {
    const existingIndex = cart.findIndex(c => c.sku === item.sku);
    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (sku: string) => {
    setCart(cart.filter(item => item.sku !== sku));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // ➔ 🎯 4. MAIN POS CHECKOUT BUTTON (Direct Sanity Write & Stock Decrease)
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("කරුණාකර Cart එකට භාණ්ඩ එකතු කරන්න!");
      return;
    }

    setLoading(true);

    try {
      const generatedOrderId = `AMILA-POS-${Date.now()}`;

      // A. Sanity Cloud එකේ අලුත් Order Document එකක් සෑදීම
      const newOrder = {
        _type: "order",
        orderId: generatedOrderId,
        customerName: customerName,
        phone: customerPhone,
        totalAmount: totalAmount,
        status: "paid", 
        createdAt: new Date().toISOString(),
        items: cart.map(item => ({
          _key: Math.random().toString(36).substring(2, 9),
          title: `${item.title} (${item.color} - ${item.size})`,
          quantity: item.quantity,
          price: item.price,
          sku: item.sku
        }))
      };

      await writeClient.create(newOrder);

      // B. 📉 Sanity Document Array එක ඇතුළේ තියෙන Variant එකේ inStoreStock එක සැනින් අඩු කිරීම
      for (const item of cart) {
        // GROQ Query මඟින් අදාළ Variant එකේ Index එක හොයාගෙන, ඒකේ inStoreStock එක විතරක් අඩු කරනවා
        await writeClient
          .patch(item.productId)
          .inc({ [`stock[_key=="${item.variantKey}"].inStoreStock`]: -item.quantity })
          .commit();
      }

      alert(`✅ POS බිල සාර්ථකයි! Order ID: ${generatedOrderId}`);
      setCart([]);
      setCustomerName("Walk-in Customer");
      setCustomerPhone("");
      
      // Refresh local products state
      const refreshedData = await client.fetch(`*[_type == "product"] { _id, title, price, stock }`);
      setProducts(refreshedData);

    } catch (error: any) {
      console.error("POS Checkout Error:", error);
      alert("Error processing bill: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* වම් පැත්ත: Search and Table Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">🛒 Live POS Billing Panel</h2>
            
            <div className="relative">
              <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1 mb-2"><Search size={14}/> Search Item / Scan Barcode</label>
              <input 
                type="text"
                placeholder="Type Clothes Name or Scan SKU Tag (Press Enter to Scan)..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-indigo-500 text-sm"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={handleBarcodeKeyDown}
              />
              
              {/* Search Result Suggestions Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto divide-y divide-slate-50">
                  {searchResults.map((item, index) => (
                    <div 
                      key={index}
                      onClick={() => {
                        addToCart(item);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      className="p-3 hover:bg-indigo-50 cursor-pointer flex justify-between items-center transition-colors"
                    >
                      <div>
                        <p className="font-bold text-slate-700 text-sm">{item.title} ({item.color} / {item.size})</p>
                        <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500">{item.sku}</span>
                      </div>
                      <span className="text-xs font-black text-indigo-600">Rs. {item.price} (Store Stock: {item.inStoreStock})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cart Table */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase mb-4">Current Bill Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase">
                    <th className="pb-3">Item Variant</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Qty</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm font-bold text-slate-700">
                  {cart.map(item => (
                    <tr key={item.sku}>
                      <td className="py-4">
                        <p>{item.title} - <span className="text-indigo-600 font-extrabold">{item.color}/{item.size}</span></p>
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-mono">{item.sku}</span>
                      </td>
                      <td className="py-4">Rs. {item.price.toLocaleString()}</td>
                      <td className="py-4">{item.quantity}</td>
                      <td className="py-4 text-right">
                        <button onClick={() => removeFromCart(item.sku)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {cart.length === 0 && <p className="text-center text-slate-400 py-8 text-sm font-medium">No items added to the bill yet.</p>}
            </div>
          </div>
        </div>

        {/* දකුණු පැත්ත: Summary & Checkout */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-fit space-y-6">
          <h3 className="text-lg font-black text-slate-800">Checkout Summary</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1 mb-1"><User size={12}/> Customer Name</label>
              <input 
                type="text" 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1 mb-1"><Phone size={12}/> Contact Number</label>
              <input 
                type="text" 
                placeholder="07xxxxxxxx"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <span className="text-sm font-bold text-slate-400 uppercase">Net Total</span>
            <span className="text-2xl font-black text-slate-800">Rs. {totalAmount.toLocaleString()}</span>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={loading}
            className="w-full p-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            <Printer size={18}/> {loading ? "Processing..." : "PRINT & COMPLETE SALE"}
          </button>
        </div>

      </div>
    </div>
  );
}