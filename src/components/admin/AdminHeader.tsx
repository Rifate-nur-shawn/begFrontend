"use client";

import { useAuthStore } from "@/store/auth-store";
import { Bell, Search } from "lucide-react";

export default function AdminHeader() {
  const { user } = useAuthStore();

  return (
    <header className="h-16 bg-white border-b border-neutral-200 fixed top-0 right-0 left-64 z-40 flex items-center justify-between px-8">
      {/* Search Bar */}
      <div className="relative w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-neutral-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border-none bg-neutral-50 rounded-sm text-sm placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-200"
          placeholder="Search..."
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <button className="text-neutral-400 hover:text-black transition-colors relative">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-neutral-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-[10px] text-neutral-500 font-utility uppercase tracking-widest">{user?.role}</p>
            </div>
            {user?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar} alt="Admin" className="w-8 h-8 rounded-full border border-neutral-200 object-cover" />
            ) : (
                <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-display text-sm">
                    {user?.email?.[0].toUpperCase()}
                </div>
            )}
        </div>
      </div>
    </header>
  );
}
