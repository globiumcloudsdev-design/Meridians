"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/lib/context/UserContext";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token, loading, fetchProfile } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (pathname === "/admin/login") return;
    if (!token) {
      router.replace("/admin/login");
    } else if (!user) {
      fetchProfile(token);
    }
  }, [token, user, fetchProfile, router, pathname, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-500 text-sm font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  if (!loading && pathname !== "/admin/login" && (!token || !user)) {
    return null;
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
      />

      {/* Main content - margin adjusts dynamically based on sidebar state */}
      <div
        className="flex-1 flex flex-col bg-gray-50/80 min-w-0 transition-all duration-300 ease-in-out"
        style={{
          marginLeft: undefined, // mobile: no margin
        }}
      >
        {/* Desktop margin spacer - matches sidebar width */}
        <style>{`
          @media (min-width: 768px) {
            .admin-main-content {
              margin-left: ${sidebarCollapsed ? "78px" : "260px"};
              transition: margin-left 0.3s ease-in-out;
            }
          }
        `}</style>
        <div className="admin-main-content flex-1 flex flex-col min-w-0">
          <Header />

          <main className="flex-1 p-4 md:p-6 lg:p-8 min-w-0 w-full overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
