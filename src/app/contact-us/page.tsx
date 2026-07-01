"use client";

import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 text-center">Contact Us</h1>
        <p className="text-gray-500 text-center mb-16 max-w-lg mx-auto">
          We love hearing from our customers. Whether you have a question about sizing, shipping, or just want to say hello, we're here for you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Contact Info */}
          <div className="space-y-8">
            <h3 className="text-xl font-bold uppercase tracking-wider">Get in Touch</h3>
            
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-black mt-1" />
              <div>
                <p className="font-bold">Amila Fashion</p>
                <p className="text-gray-500 text-sm">No. 05, Wellawaya Road,<br/>Monaragala, Sri Lanka.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-black mt-1" />
              <div>
                <p className="font-bold">Phone</p>
                <p className="text-gray-500 text-sm">+94 71 043 8487</p>
                <p className="text-gray-500 text-sm">We are open every day from Monday to Sunday, 9am - 10pm</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-black mt-1" />
              <div>
                <p className="font-bold">Email</p>
                <p className="text-gray-500 text-sm">support@amilafashion.lk</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form className="space-y-4">
             <div>
                <label className="text-xs font-bold uppercase text-gray-500">Name</label>
                <input type="text" className="w-full border-b border-gray-300 py-2 outline-none focus:border-black transition" placeholder="Your Name" />
             </div>
             <div>
                <label className="text-xs font-bold uppercase text-gray-500">Email</label>
                <input type="email" className="w-full border-b border-gray-300 py-2 outline-none focus:border-black transition" placeholder="Your Email" />
             </div>
             <div>
                <label className="text-xs font-bold uppercase text-gray-500">Message</label>
                <textarea rows={4} className="w-full border-b border-gray-300 py-2 outline-none focus:border-black transition" placeholder="How can we help?"></textarea>
             </div>
             <button className="bg-black text-white px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-gray-800 transition w-full md:w-auto">
                Send Message
             </button>
          </form>

        </div>
      </div>
    </div>
  );
}