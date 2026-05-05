export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-8">Shipping Policy</h1>
        
        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-black mb-3">Island-wide Delivery</h2>
            <p>We deliver to any address in Sri Lanka. Our delivery partners are committed to delivering your order safely and on time.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">Delivery Time</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Colombo & Suburbs:</strong> 2-3 Working Days</li>
              <li><strong>Outstation:</strong> 3-5 Working Days</li>
            </ul>
            <p className="mt-2 text-sm text-gray-500">*Delivery times may vary during public holidays and peak seasons.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">Shipping Costs</h2>
            <p>Shipping costs are calculated based on your location and the weight of your order. You can view the final shipping cost at the checkout before payment.</p>
            <p className="mt-2 font-semibold">Free shipping for orders over Rs. 15,000.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">Order Tracking</h2>
            <p>Once your order is shipped, you will receive a tracking number via email/SMS. You can use this to track your package on our courier partner's website.</p>
          </section>
        </div>
      </div>
    </div>
  );
}