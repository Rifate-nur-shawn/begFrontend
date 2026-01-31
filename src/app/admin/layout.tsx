"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Wait for hydration/loading
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user?.role !== "admin") {
      router.push("/"); // Redirect non-admins to home
      return;
    }

    setIsAuthorized(true);
  }, [isAuthenticated, user, isLoading, router]);

  if (isLoading || !isAuthorized) {
    return (
        <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-4 w-32 bg-neutral-200 rounded mb-4"></div>
                <div className="h-4 w-24 bg-neutral-200 rounded"></div>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      <AdminSidebar />
      <AdminHeader />
      <main className="pl-64 pt-16 min-h-screen">
        <div className="p-8 max-w-7xl mx-auto">
            {children}
        </div>
      </main>
    </div>
  );
}
