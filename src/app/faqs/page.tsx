export default function FAQPage() {
  const faqs = [
    { q: "How do I place an order?", a: "Simply browse our website, select the items you love, choose your size, and click 'Add to Cart'. Once you're ready, proceed to checkout and follow the instructions." },
    { q: "What payment methods do you accept?", a: "We accept Visa, MasterCard, and Cash on Delivery (COD) for island-wide orders." },
    { q: "Can I cancel my order?", a: "You can cancel your order within 24 hours of placing it by contacting our support team. Once shipped, orders cannot be canceled." },
    { q: "Do you ship internationally?", a: "Currently, we only ship within Sri Lanka. However, we plan to start international shipping soon!" },
    { q: "How do I use a coupon code?", a: "At the checkout page, you will see an option to 'Apply Coupon'. Enter your code there and the discount will be applied to your total." },
  ];

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-12 text-center">Frequently Asked Questions</h1>
        
        <div className="space-y-6">
          {faqs.map((item, index) => (
            <div key={index} className="border-b border-gray-100 pb-6">
              <h3 className="text-lg font-bold text-black mb-2">{item.q}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}