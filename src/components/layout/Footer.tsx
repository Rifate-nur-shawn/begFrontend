"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white text-black font-medium">
      {/* Main Footer Content */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-10 lg:py-12">
        
        {/* Logo */}
        <div className="mb-12 lg:mb-16">
          <Link href="/" className="font-display text-2xl lg:text-3xl text-black tracking-tight">
            Velancis
          </Link>
        </div>

        {/* Links Grid - Clean 4 Column Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-16">
          {/* Column 1 - Shop */}
          <div className="flex flex-col gap-3">
            <Link href="/collections/new-arrivals" className="text-sm hover:text-black transition-colors">
              New Arrivals
            </Link>
            <Link href="/collections/totes" className="text-sm hover:text-black transition-colors">
              Totes
            </Link>
            <Link href="/collections/shoulder-bags" className="text-sm hover:text-black transition-colors">
              Shoulder Bags
            </Link>
          </div>

          {/* Column 2 - Categories */}
          <div className="flex flex-col gap-3">
            <Link href="/collections/clutches" className="text-sm hover:text-black transition-colors">
              Clutches
            </Link>
            <Link href="/collections/crossbody" className="text-sm hover:text-black transition-colors">
              Crossbody
            </Link>
            <Link href="/collections/mini-bags" className="text-sm hover:text-black transition-colors">
              Mini Bags
            </Link>
          </div>

          {/* Column 3 - Company */}
          <div className="flex flex-col gap-3">
            <Link href="/about" className="text-sm hover:text-black transition-colors">
              About Us
            </Link>
            <Link href="/stores" className="text-sm hover:text-black transition-colors">
              Branches
            </Link>
          </div>

          {/* Column 4 - Support */}
          <div className="flex flex-col gap-3">
            <Link href="/campaign" className="text-sm hover:text-black transition-colors">
              Campaign
            </Link>
            <Link href="/careers" className="text-sm hover:text-black transition-colors">
              Careers
            </Link>
            <Link href="/sustainability" className="text-sm hover:text-black transition-colors">
              Sustainability
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-200">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          {/* Left: Legal Links */}
          <div className="flex items-center gap-6 text-xs text-black">
            <Link href="/privacy" className="hover:text-black transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-black transition-colors">
              Legal Terms
            </Link>
            <span className="hidden md:inline">© 2026 Velancis</span>
          </div>

          {/* Right: Social Links */}
          <div className="flex items-center gap-1 text-xs text-black">
            <span className="mr-4 hidden lg:inline">Connect:</span>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="px-2 py-1 hover:text-black transition-colors">
              Instagram
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="px-2 py-1 hover:text-black transition-colors">
              LinkedIn
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="px-2 py-1 hover:text-black transition-colors">
              Twitter
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="px-2 py-1 hover:text-black transition-colors">
              Facebook
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="px-2 py-1 hover:text-black transition-colors">
              YouTube
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="px-2 py-1 hover:text-black transition-colors">
              TikTok
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="px-2 py-1 hover:text-black transition-colors">
              Pinterest
            </a>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed left-6 bottom-6 w-12 h-12 bg-black text-white flex items-center justify-center transition-all duration-300 hover:bg-neutral-800 z-50 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </footer>
  );
}
