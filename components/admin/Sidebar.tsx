"use client";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  FileCheck,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useUser } from "@/lib/context/UserContext";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    description: "Overview & analytics",
  },
  {
    label: "Blog Posts",
    href: "/admin/blog",
    icon: FileText,
    description: "Manage articles",
  },
  {
    label: "Subscribers",
    href: "/admin/subscribers",
    icon: Users,
    description: "Newsletter list",
  },
  {
    label: "Contact Messages",
    href: "/admin/contact-messages",
    icon: MessageSquare,
    description: "Inbox queries",
  },
  {
    label: "Admission Queries",
    href: "/admin/admission-queries",
    icon: FileCheck,
    description: "Applications",
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useUser();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close mobile sidebar on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const sidebarWidth = collapsed ? "w-[78px]" : "w-[260px]";

  const sidebarContent = (
    <aside
      className={`h-screen ${sidebarWidth} flex flex-col fixed left-0 top-0 z-30 transition-all duration-300 ease-in-out overflow-x-hidden overflow-y-auto`}
      style={{
        background:
          "linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      }}
    >
      {/* Logo Section */}
      <div
        className={`flex items-center ${collapsed ? "justify-center px-2" : "px-5"} h-[72px] border-b border-white/[0.08] shrink-0`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-emerald-500/30 shrink-0 shadow-lg shadow-emerald-500/10">
            <Image
              src="/logo.jpg"
              alt="Meridian's Logo"
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          {!collapsed && (
            <div className="min-w-0 overflow-hidden">
              <h1 className="text-[15px] font-bold text-white tracking-tight truncate leading-tight">
                Meridian&apos;s
              </h1>
              <p className="text-[11px] text-slate-400 font-medium truncate leading-tight">
                Admin Panel
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle - desktop only */}
      <div className="hidden md:flex items-center justify-end px-3 pt-3 shrink-0">
        <button
          onClick={onToggleCollapse}
          className="flex w-7 h-7 bg-slate-700/60 hover:bg-slate-600 border border-slate-600/50 rounded-lg items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Navigation Label */}
      {!collapsed && (
        <div className="px-5 pt-6 pb-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
            Navigation
          </span>
        </div>
      )}
      {collapsed && <div className="pt-4" />}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-1 flex flex-col gap-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center ${collapsed ? "justify-center px-2" : "px-3"} py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-emerald-500/15 text-emerald-400 shadow-sm shadow-emerald-500/5"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
              }`}
              title={collapsed ? item.label : undefined}
            >
              {/* Active indicator bar */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-emerald-400 rounded-r-full" />
              )}

              <div
                className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-all duration-200 ${
                  active
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "text-slate-400 group-hover:text-white group-hover:bg-white/[0.06]"
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
              </div>

              {!collapsed && (
                <div className="ml-3 min-w-0 overflow-hidden">
                  <span className="block truncate leading-tight">
                    {item.label}
                  </span>
                  <span
                    className={`block text-[11px] truncate leading-tight mt-0.5 ${
                      active
                        ? "text-emerald-400/60"
                        : "text-slate-500 group-hover:text-slate-400"
                    }`}
                  >
                    {item.description}
                  </span>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section - User & Visit Site */}
      <div className="mt-auto border-t border-white/[0.08] p-3 space-y-2 shrink-0">
        {/* Visit Website Link */}
        <Link
          href="/"
          target="_blank"
          className={`flex items-center ${collapsed ? "justify-center px-2" : "px-3"} py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200 group`}
          title={collapsed ? "Visit Website" : undefined}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 text-slate-400 group-hover:text-white group-hover:bg-white/[0.06] transition-all duration-200">
            <GraduationCap className="w-[18px] h-[18px]" />
          </div>
          {!collapsed && <span className="ml-3 truncate">Visit Website</span>}
        </Link>

        {/* User Profile */}
        {user && (
          <div
            className={`flex items-center ${collapsed ? "justify-center" : ""} gap-3 p-2 rounded-xl bg-white/[0.04] border border-white/[0.06]`}
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-md shadow-emerald-500/20">
              {user.email?.charAt(0).toUpperCase() || "A"}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-[13px] font-semibold text-white truncate leading-tight">
                  Admin
                </p>
                <p className="text-[11px] text-slate-400 truncate leading-tight">
                  {user.email}
                </p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 bg-slate-800 text-white p-2.5 rounded-xl shadow-lg shadow-black/20 border border-slate-700 hover:bg-slate-700 transition-all duration-200"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label={mobileOpen ? "Close sidebar" : "Open sidebar"}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden md:block overflow-hidden">{sidebarContent}</div>

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed inset-0 z-30 transition-all duration-300 ${
          mobileOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />
        {/* Sidebar slide-in */}
        <div
          className={`absolute left-0 top-0 h-full transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebarContent}
        </div>
      </div>
    </>
  );
}
