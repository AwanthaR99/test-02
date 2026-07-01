export default function TermsAndPrivacyPage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 text-black">
          Terms of Service & Privacy Policy
        </h1>
        
        <div className="space-y-12 text-gray-700 leading-relaxed">
          {/* --- BUSINESS INFORMATION --- */}
          <section className="border-b border-gray-100 pb-8">
            <h2 className="text-xl font-bold text-black mb-4 uppercase tracking-tight">
              1. Business Information
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Business Name:</strong> Amila Fashion</li>
              <li><strong>Address:</strong> 41/55, Monaragala, Sri Lanka</li>
              <li><strong>Contact Email:</strong> amilafashion.payments@gmail.com</li>
              <li><strong>Contact Phone:</strong> +94 75 121 0014</li>
            </ul>
          </section>

          {/* --- PRIVACY POLICY --- */}
          <section className="border-b border-gray-100 pb-8">
            <h2 className="text-xl font-bold text-black mb-4 uppercase tracking-tight">
              2. Privacy Policy
            </h2>
            <div className="space-y-3">
              <p>
                <strong>Data Collection:</strong> We collect personal information (Name, Address, Phone, Email) solely to process your orders, arrange delivery, and provide customer support.
              </p>
              <p>
                <strong>Payment Security:</strong> All transactions are securely processed via the PayHere Payment Gateway. We do not store your credit/debit card details or financial information on our servers.
              </p>
              <p>
                <strong>Data Sharing:</strong> We value your privacy and will never sell, lease, or share your personal data with third parties for marketing purposes.
              </p>
            </div>
          </section>

          {/* --- TERMS & CONDITIONS --- */}
          <section>
            <h2 className="text-xl font-bold text-black mb-4 uppercase tracking-tight">
              3. Product Pricing & Orders
            </h2>
            <div className="space-y-3">
              <p>
                All prices listed on the website are in Sri Lankan Rupees (LKR) and are subject to change without prior notice.
              </p>
              <p>
                We reserve the right to refuse or cancel any order if fraudulent activity or a payment issue is suspected.
              </p>
              <p>
                For any order disputes, product defects, or payment issues, please reach out to our team at <strong>amilafashion.payments@gmail.com</strong>. We aim to investigate and resolve all complaints within 2 working days.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}