export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 text-black">
          Shipping & Returns Policy
        </h1>
        
        <div className="space-y-12 text-gray-700 leading-relaxed">
          {/* --- SHIPPING POLICY SECTION --- */}
          <section className="border-b border-gray-100 pb-8">
            <h2 className="text-2xl font-bold text-black mb-4 uppercase tracking-tight">
              1. Shipping Policy
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-black mb-1">Island-wide Delivery</h3>
                <p>We deliver to any address in Sri Lanka. Our delivery partners are committed to delivering your order safely and on time.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-black mb-1">Delivery Time</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Colombo & Suburbs:</strong> 2-3 Working Days</li>
                  <li><strong>Outstation:</strong> 3-5 Working Days</li>
                </ul>
                <p className="text-sm text-gray-500 mt-1 italic">*Delivery times may vary during public holidays and peak seasons.</p>
              </div>

              <div>
                <h3 className="font-semibold text-black mb-1">Shipping Costs</h3>
                <p>Shipping costs are calculated based on your location and the weight of your order. You can view the final shipping cost at the checkout before payment. <strong>Free shipping</strong> is available for orders over Rs. 15,000.</p>
              </div>

              <div>
                <h3 className="font-semibold text-black mb-1">Order Tracking</h3>
                <p>Once your order is shipped, you will receive a tracking number via email/SMS. You can use this to track your package on our courier partner's website.</p>
              </div>
            </div>
          </section>

          {/* --- RETURNS & EXCHANGES SECTION --- */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-4 uppercase tracking-tight">
              2. Returns & Exchanges
            </h2>
            <p className="mb-4">
              We want you to love what you ordered. If something isn't right, you can return your item(s) within <strong>7 days</strong> of delivery for an exchange or store credit.
            </p>

            <div className="mb-6">
              <h3 className="font-semibold text-black mb-2">Conditions for Return</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Items must be unworn, unwashed, and in their original condition.</li>
                <li>All tags must be attached.</li>
                <li>Sale items and innerwear cannot be returned due to hygiene reasons.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-black mb-2">How to Initiate a Return</h3>
              <p>
                Please contact our customer support team at{' '}
                <strong className="text-black">amilafashion.payments@gmail.com</strong> or call us at{' '}
                <strong className="text-black">+94 75 121 0014</strong> with your Order ID. We will guide you through the process.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}