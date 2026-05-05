export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-8">Returns & Exchanges</h1>
        
        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-black mb-3">Return Policy</h2>
            <p>We want you to love what you ordered. If something isn't right, you can return your item(s) within <strong>7 days</strong> of delivery for an exchange or store credit.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">Conditions for Return</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Items must be unworn, unwashed, and in their original condition.</li>
              <li>All tags must be attached.</li>
              <li>Sale items and innerwear cannot be returned due to hygiene reasons.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">How to Initiate a Return</h2>
            <p>Please contact our customer support team at <strong>support@amilafashion.lk</strong> or call us at <strong>+94 77 123 4567</strong> with your Order ID. We will guide you through the process.</p>
          </section>
        </div>
      </div>
    </div>
  );
}