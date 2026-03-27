"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/lib/context/UserContext";
import {
  ChevronRight,
  Home,
  Bell,
  Search,
  LogOut,
  Calendar,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Map route segments to friendly page titles & descriptions
const pageMeta: Record<string, { title: string; description: string }> = {
  dashboard: {
    title: "Dashboard",
    description: "Overview of your school's key metrics",
  },
  blog: {
    title: "Blog Posts",
    description: "Create and manage blog articles",
  },
  subscribers: {
    title: "Subscribers",
    description: "Manage newsletter subscribers",
  },
  "contact-messages": {
    title: "Contact Messages",
    description: "View and respond to inquiries",
  },
  "admission-queries": {
    title: "Admission Queries",
    description: "Review admission applications",
  },
};

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];
  let path = "";
  for (let i = 0; i < segments.length; i++) {
    path += "/" + segments[i];
    crumbs.push({
      label:
        segments[i].charAt(0).toUpperCase() +
        segments[i].slice(1).replace(/-/g, " "),
      href: path,
    });
  }
  return crumbs;
}

function getPageInfo(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] || "dashboard";
  return (
    pageMeta[lastSegment] || {
      title:
        lastSegment.charAt(0).toUpperCase() +
        lastSegment.slice(1).replace(/-/g, " "),
      description: "",
    }
  );
}

function getCurrentDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Header() {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);
  const pageInfo = getPageInfo(pathname);
  const { user, logout } = useUser();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  // Close search on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <header className="sticky top-0 z-20 w-full">
      {/* Main header bar */}
      <div className="h-16 flex items-center px-4 md:px-6 lg:px-8 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
        <div className="flex w-full items-center justify-between gap-4">
          {/* Left side - Page title & breadcrumbs */}
          <div className="min-w-0 flex-1">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1 text-xs text-slate-400 mb-0.5">
              <Link
                href="/admin/dashboard"
                className="hover:text-emerald-600 transition-colors flex items-center gap-1"
              >
                <Home className="w-3 h-3" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              {breadcrumbs.slice(1).map((crumb) => (
                <span key={crumb.href} className="flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-slate-300" />
                  <Link
                    href={crumb.href}
                    className="hover:text-emerald-600 transition-colors capitalize"
                  >
                    {crumb.label}
                  </Link>
                </span>
              ))}
            </nav>

            {/* Page Title */}
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight truncate">
                {pageInfo.title}
              </h1>
              {pageInfo.description && (
                <span className="hidden lg:inline-block text-xs text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                  {pageInfo.description}
                </span>
              )}
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
            {/* Date indicator */}
            <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-400 font-medium bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg mr-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {getCurrentDate()}
            </div>

            {/* Search button / input */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
                  <Search className="w-4 h-4 text-slate-400 ml-2.5 shrink-0" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none px-2 py-1.5 w-40 md:w-56"
                    onBlur={() => {
                      if (!searchQuery) setSearchOpen(false);
                    }}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
                  title="Search (Ctrl+K)"
                >
                  <Search className="w-[18px] h-[18px]" />
                </button>
              )}
            </div>

            {/* Notifications */}
            <button
              className="relative flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
              title="Notifications"
            >
              <Bell className="w-[18px] h-[18px]" />
              {/* Notification dot */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
            </button>

            {/* Divider */}
            <div className="hidden md:block w-px h-6 bg-slate-200 mx-1" />

            {/* User avatar + logout */}
            <div className="flex items-center gap-2">
              {user && (
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-emerald-500/20">
                    {user.email?.charAt(0).toUpperCase() || "A"}
                  </div>
                  <div className="hidden md:block min-w-0">
                    <p className="text-[13px] font-semibold text-slate-700 leading-tight truncate max-w-[140px]">
                      {user.email?.split("@")[0] || "Admin"}
                    </p>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      Administrator
                    </p>
                  </div>
                </div>
              )}
              <button
                onClick={logout}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
