"use client";

import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { CreditCard, ShoppingBag, Tag } from "lucide-react";
import { client } from "@/lib/sanity";

declare global {
  interface Window {
    payhere: any;
  }
}

const PROVINCES = [
  { name: "Uva", fee: 350 },
  { name: "Southern", fee: 400 },
  { name: "Western", fee: 400 },
  { name: "Central", fee: 400 },
  { name: "Sabaragamuwa", fee: 400 },
  { name: "North Western (Wayamba)", fee: 400 },
  { name: "Eastern", fee: 400 },
  { name: "North Central", fee: 450 },
  { name: "Northern", fee: 450 },
];

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // States
  const [shippingFee, setShippingFee] = useState(0);
  const [selectedProvince, setSelectedProvince] = useState("");
  
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isApplying, setIsApplying] = useState(false);
  const [couponMessage, setCouponMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    phone: "",
    email: "",
  });

  const uniqueProductCount = new Set(items.map((item: any) => item.id || item._id)).size;
  const isEligibleForFreeShipping = uniqueProductCount >= 3;

  useEffect(() => {
    if (session?.user) {
      const fullName = session.user.name || "";
      const names = fullName.split(" ");
      
      setFormData((prev) => ({
        ...prev,
        firstName: names[0] || "",
        lastName: names.slice(1).join(" ") || "",
        email: session?.user?.email || "",
      }));
    }
  }, [session]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceName = e.target.value;
    setSelectedProvince(provinceName);

    const province = PROVINCES.find(p => p.name === provinceName);
    if (province) {
      setShippingFee(isEligibleForFreeShipping ? 0 : province.fee);
    } else {
      setShippingFee(0);
    }
  };

  useEffect(() => {
    if (selectedProvince) {
      const province = PROVINCES.find(p => p.name === selectedProvince);
      if (province) {
        setShippingFee(isEligibleForFreeShipping ? 0 : province.fee);
      }
    }
  }, [items, selectedProvince, isEligibleForFreeShipping]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🌟 UPDATED: FIXED PRICE / PERCENTAGE & EMAIL RESTRICTION LOGIC
  const applyCoupon = async () => {
    if (!couponCode) return;
    setIsApplying(true);
    setCouponMessage({ type: "", text: "" });

    try {
      // 1. සැනිටි එකෙන් අලුත් fields (discountType, allowedEmail) ටිකත් එක්කම කූපන් එක ගන්නවා
      const query = `*[_type == "coupon" && code == "${couponCode}" && isActive == true][0]{
        code,
        discount,
        discountType,
        allowedEmail,
        applicableCategory
      }`;
      const coupon = await client.fetch(query);

      if (!coupon) {
        setCouponMessage({ type: "error", text: "Invalid, expired, or inactive coupon code." });
        setAppliedDiscount(0);
        return;
      }

      // 🌟 2. LOYALTY CUSTOMER EMAIL CHECK
      // සැනිටි එකේ allowedEmail එකක් සෙට් කරලා තියෙනවා නම් විතරක් චෙක් කරනවා
      if (coupon.allowedEmail && coupon.allowedEmail.trim().toLowerCase() !== formData.email.trim().toLowerCase()) {
        setCouponMessage({ 
          type: "error", 
          text: "This exclusive coupon code is linked to another loyalty account email." 
        });
        setAppliedDiscount(0);
        return;
      }

      const targetCategory = coupon.applicableCategory || "all";
      let eligibleTotal = 0;

      if (targetCategory === "all") {
        eligibleTotal = cartTotal;
      } else {
        const eligibleItems = items.filter(
          (item) => item.category?.toLowerCase() === targetCategory.toLowerCase()
        );

        if (eligibleItems.length === 0) {
          setCouponMessage({ 
            type: "error", 
            text: `This coupon is only valid for ${targetCategory.toUpperCase()} items.` 
          });
          setAppliedDiscount(0);
          return;
        }

        eligibleTotal = eligibleItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }

      // 🌟 3. DYNAMIC DISCOUNT CALCULATION BASED ON TYPE
      let discountValue = 0;
      if (coupon.discountType === "fixed") {
        // Fixed Amount එකක් නම් සැනිටි එකේ ගාණ කෙලින්ම අඩු කරයි
        discountValue = coupon.discount; 
      } else {
        // Percentage (%) එකක් නම් ප්‍රතිශතය හදයි
        discountValue = (eligibleTotal * coupon.discount) / 100;
      }

      if (discountValue > cartTotal) discountValue = cartTotal;

      setAppliedDiscount(Math.round(discountValue)); 
      
      const successMsg = coupon.discountType === "fixed"
        ? `Exclusive Rs. ${coupon.discount.toLocaleString()}.00 Fixed Discount applied!`
        : `${coupon.discount}% Off applied store-wide!`;
        
      setCouponMessage({ type: "success", text: successMsg });

    } catch (error) {
      console.error("Coupon Check Error:", error);
      setCouponMessage({ type: "error", text: "Something went wrong. Try again." });
    } finally {
      setIsApplying(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setAppliedDiscount(0);
    setCouponMessage({ type: "", text: "" });
  };

  const discountedTotal = Math.max(0, cartTotal - appliedDiscount);
  const grandTotal = discountedTotal + shippingFee;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvince) {
        alert("Please select your province to calculate shipping.");
        return;
    }

    setLoading(true);

    try {
      const orderId = "ORD-" + Date.now();
      const currency = "LKR";

      const customerDetails = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}, ${selectedProvince}`,
      };

      const hashRes = await fetch("/api/payhere-hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          amount: grandTotal, 
          currency: currency,
        }),
      });
      const { hash, merchantId } = await hashRes.json();

      const payment = {
        sandbox: true,
        merchant_id: merchantId,
        return_url: "http://localhost:3000/profile",
        cancel_url: "http://localhost:3000/checkout",
        notify_url: process.env.NEXT_PUBLIC_BASE_URL + "/api/payhere-notify",
        order_id: orderId,
        items: "Amila Fashion Order",
        amount: grandTotal.toFixed(2),
        currency: currency,
        hash: hash,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: "Sri Lanka",
      };

      if (window.payhere) {
        window.payhere.startPayment(payment);
        window.payhere.onCompleted = async function onCompleted(paymentId: string) {
          console.log("Payment completed. Now saving order...");
          try {
             const createOrderRes = await fetch("/api/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId,
                  items,
                  amount: grandTotal,
                  shippingFee,
                  discount: appliedDiscount, 
                  couponCode: appliedDiscount > 0 ? couponCode : null,
                  user: customerDetails,
                  status: "paid", 
                }),
              });
              const result = await createOrderRes.json();

              if (!createOrderRes.ok) {
                 alert(`Error: ${result.error || "Order Save Failed"}`);
                 return;
              }
              
              await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                   email: formData.email,
                   orderId: orderId,
                   total: grandTotal,
                   items: items,
                   customerName: customerDetails.name
                })
             });

              clearCart();
              router.push("/profile?success=true");
          } catch (error) {
             console.error("Order Creation Error:", error);
             alert("Critical Error: Payment Success but Order was not saved in DB.");
          }
        };
        window.payhere.onDismissed = function onDismissed() {
          setLoading(false);
        };
        window.payhere.onError = function onError(error: string) {
          alert("Payment Error: " + error);
          setLoading(false);
        };
      } else {
        alert("PayHere SDK not loaded");
        setLoading(false);
      }

    } catch (err) {
      console.error(err);
      alert("Something went wrong with the payment process.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-32">
        <div className="bg-gray-50 p-6 rounded-full mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/shop" className="underline">Go to Shop</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <Script src="https://www.payhere.lk/lib/payhere.js" strategy="lazyOnload" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Form */}
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-8">Checkout</h1>
          
          <form onSubmit={handlePayment} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Contact Information</h2>
              <input 
                type="email" name="email" placeholder="Email Address" required
                value={formData.email} onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-black outline-none"
              />
              <input 
                type="tel" name="phone" placeholder="Phone Number" required
                value={formData.phone} onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-black outline-none"
              />
            </div>

            <div className="space-y-4 pt-6">
              <h2 className="text-lg font-bold">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" name="firstName" placeholder="First Name" required
                  value={formData.firstName} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                />
                <input 
                  type="text" name="lastName" placeholder="Last Name" required
                  value={formData.lastName} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                />
              </div>
              <input 
                type="text" name="address" placeholder="Address" required
                value={formData.address} onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-black outline-none"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" name="city" placeholder="City" required
                  value={formData.city} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                />
                
                <select 
                    value={selectedProvince} 
                    onChange={handleProvinceChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-black outline-none bg-white"
                    required
                >
                    <option value="" disabled>Select Province</option>
                    {PROVINCES.map((p) => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                </select>
              </div>
            </div>

            <div className="pt-6">
              <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-black text-white py-4 rounded-md font-bold uppercase tracking-widest hover:bg-gray-900 transition flex justify-center items-center gap-2"
               >
                  {loading ? "Processing..." : `Pay Rs. ${grandTotal.toLocaleString()}.00`} <CreditCard className="w-5 h-5" />
               </button>
            </div>
          </form>
        </div>

        {/* Right Order Summary */}
        <div className="bg-gray-50 p-8 rounded-lg h-fit sticky top-32 border border-gray-200">
           <h2 className="text-xl font-black uppercase tracking-tight mb-6">Order Summary</h2>
           
           <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                 <div key={`${item.id}-${item.size}`} className="flex gap-4 items-center">
                    <div className="relative w-16 h-20 bg-white rounded border border-gray-200 overflow-hidden flex-shrink-0">
                        {item.image && <Image src={item.image} alt={item.title} fill className="object-cover" />}
                       <span className="absolute top-0 right-0 bg-gray-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-bl-md font-bold">
                          {item.quantity}
                       </span>
                    </div>
                    <div className="flex-1">
                       <p className="font-bold text-sm text-gray-900 line-clamp-2">{item.title}</p>
                       <p className="text-xs text-gray-500 capitalize">{item.color} / {item.size}</p>
                    </div>
                    <p className="font-bold text-sm">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                 </div>
              ))}
           </div>

           {/* Coupon Code Input Section */}
           <div className="border-t border-gray-200 pt-6 pb-2">
             <div className="flex gap-2">
               <input
                  type="text"
                  placeholder="Discount code or Gift card"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  disabled={appliedDiscount > 0}
                  className="flex-1 border border-gray-300 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none disabled:bg-gray-100"
                />
                {appliedDiscount > 0 ? (
                  <button onClick={removeCoupon} type="button" className="bg-red-50 text-red-600 px-6 py-3 rounded-md font-bold hover:bg-red-100 transition-colors">
                    Remove
                  </button>
                ) : (
                  <button onClick={applyCoupon} disabled={isApplying || !couponCode} type="button" className="bg-gray-900 text-white px-6 py-3 rounded-md font-bold disabled:bg-gray-400 hover:bg-black transition-colors flex items-center gap-2">
                    {isApplying ? "..." : <><Tag size={16}/> Apply</>}
                  </button>
                )}
             </div>
              {couponMessage.text && (
               <p className={`text-xs mt-2 font-bold ${couponMessage.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                 {couponMessage.text}
               </p>
             )}
           </div>

           <div className="border-t border-gray-200 pt-4 space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                 <span>Subtotal</span>
                 <span>Rs. {cartTotal.toLocaleString()}.00</span>
              </div>
              
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-green-600 font-bold">
                   <span>Discount ({couponCode})</span>
                   <span>- Rs. {appliedDiscount.toLocaleString()}.00</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                 <span>Shipping ({selectedProvince || "Select Province"})</span>
                 {selectedProvince && shippingFee === 0 ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                      FREE SHIPPING 🎉
                    </span>
                 ) : (
                     <span className={`font-bold ${shippingFee > 0 ? "text-gray-900" : "text-gray-400"}`}>
                       {shippingFee > 0 ? `Rs. ${shippingFee}.00` : "Calculated at checkout"}
                    </span>
                 )}
              </div>

              {!isEligibleForFreeShipping && selectedProvince && (
                <p className="text-[11px] text-amber-600 font-bold bg-amber-50 p-2.5 rounded-lg border border-amber-100 mt-2">
                  💡 Add {3 - uniqueProductCount} more different items to get FREE SHIPPING!
                </p>
              )}
           </div>

           <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
              <span className="text-xl font-black text-gray-900">Total</span>
              <div className="text-right">
                 <span className="text-sm text-gray-500 mr-2">LKR</span>
                 <span className="text-2xl font-black text-gray-900">{grandTotal.toLocaleString()}.00</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}