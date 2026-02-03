"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings, 
  Package,
  LogOut,
  FolderTree,
  Layers,
  Boxes,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuthStore();

  const menuItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: ShoppingBag },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Collections", href: "/admin/collections", icon: Layers },
    { name: "Inventory", href: "/admin/inventory", icon: Boxes },
    { name: "Orders", href: "/admin/orders", icon: Package },
    { name: "Customers", href: "/admin/users", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];


  return (
    <aside className="w-64 fixed inset-y-0 left-0 bg-[#0a0a0a] text-white border-r border-white/10 z-50 flex flex-col">
      {/* Brand */}
      <div className="h-16 flex items-center px-8 border-b border-white/10">
        <Link href="/" className="font-display text-xl tracking-wide">
          VELANCIS <span className="text-[10px] font-utility tracking-[0.2em] text-neutral-500 ml-2">ADMIN</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-300 group",
                isActive 
                  ? "bg-white/10 text-white" 
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon 
                size={18} 
                strokeWidth={1.5}
                className={clsx(
                  "transition-colors",
                  isActive ? "text-white" : "text-neutral-500 group-hover:text-white"
                )} 
              />
              <span className="font-utility text-xs uppercase tracking-widest">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-white/10">
        <button
            onClick={() => {
                logout();
                window.location.href = '/';
            }} 
            className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-red-400 transition-colors w-full text-left"
        >
          <LogOut size={18} strokeWidth={1.5} />
          <span className="font-utility text-xs uppercase tracking-widest">Logout</span>
        </button>
      </div>
    </aside>
  );
}
