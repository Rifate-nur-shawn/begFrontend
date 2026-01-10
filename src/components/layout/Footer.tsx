"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 py-24 px-4 md:px-12">
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        
        {/* Brand Column */}
        <div className="md:col-span-1">
          <Link href="/" className="font-display text-2xl text-white block mb-6">
            BegOnShop
          </Link>
          <p className="font-utility text-xs leading-relaxed uppercase tracking-widest max-w-xs">
            Redefining modern luxury through structure and void.
          </p>
        </div>

        {/* Shop Column */}
        <div className="flex flex-col gap-4 font-utility text-xs uppercase tracking-widest">
            <h4 className="text-white mb-2">Shop</h4>
            <Link href="/collections/signature" className="hover:text-white transition-colors">Signature Bags</Link>
            <Link href="/collections/travel" className="hover:text-white transition-colors">Travel Edit</Link>
            <Link href="/collections/accessories" className="hover:text-white transition-colors">Small Leather Goods</Link>
            <Link href="/collections/gifting" className="hover:text-white transition-colors">Gifts</Link>
        </div>

        {/* Company Column */}
        <div className="flex flex-col gap-4 font-utility text-xs uppercase tracking-widest">
            <h4 className="text-white mb-2">Maison</h4>
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="/campaign" className="hover:text-white transition-colors">Campaign</Link>
            <Link href="/stores" className="hover:text-white transition-colors">Boutiques</Link>
            <Link href="/careers" className="hover:text-white transition-colors">Careers</Link>
        </div>

        {/* Newsletter / Social */}
        <div className="flex flex-col gap-6">
            <div>
                <h4 className="text-white font-utility text-xs uppercase tracking-widest mb-4">Newsletter</h4>
                <div className="flex border-b border-neutral-700 pb-2">
                    <input 
                        type="email" 
                        placeholder="EMAIL ADDRESS" 
                        className="bg-transparent w-full font-utility text-xs uppercase tracking-widest focus:outline-none text-white placeholder:text-neutral-600"
                    />
                    <button className="text-white font-utility text-xs uppercase tracking-widest hover:text-neutral-300">
                        Subscribe
                    </button>
                </div>
            </div>
            
            <div className="flex gap-4 font-utility text-[10px] uppercase tracking-widest">
                <a href="#" className="hover:text-white">Instagram</a>
                <a href="#" className="hover:text-white">TikTok</a>
                <a href="#" className="hover:text-white">Weibo</a>
            </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto mt-24 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between font-utility text-[10px] uppercase tracking-widest">
        <p>&copy; 2026 BegOnShop. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
