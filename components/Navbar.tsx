"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  // Close mobile menu & dropdowns on route change
  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside the navbar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Only pages with a dark Hero section start transparent
  const isTransparentPage =
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/programs" ||
    pathname === "/blog" ||
    pathname.startsWith("/blog/") ||
    pathname === "/library" ||
    pathname === "/notes" ||
    pathname === "/video" ||
    pathname.startsWith("/video/") ||
    pathname === "/admissions" ||
    pathname === "/contact" ||
    pathname === "/faq" ||
    pathname === "/online-quran";

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Course Details", href: "/programs" },
    { label: "Blog", href: "/blog" },
    {
      label: "Resources",
      href: "#",
      children: [
        { label: "Library", href: "/library" },
        { label: "Notes", href: "/notes" },
        { label: "Video", href: "/video" },
      ],
    },
    { label: "Admissions", href: "/admissions" },
    { label: "Online Quran", href: "/online-quran" },
    { label: "Contact Us", href: "/contact" },
  ];

  const isLightMode = isScrolled || !isTransparentPage || isOpen;

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isLightMode
          ? "bg-white/95 dark:bg-card/95 backdrop-blur-md border-b border-border/80 shadow-xs py-2.5 sm:py-3"
          : "bg-gradient-to-b from-black/50 via-black/20 to-transparent py-3 sm:py-4"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white p-1 shadow-xs border border-border/40 overflow-hidden flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/logo.jpg"
                alt="Meridian's Group of Education Logo"
                fill
                sizes="(max-width: 640px) 40px, 44px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1
                className={`text-base sm:text-lg font-black tracking-tight leading-tight transition-colors ${
                  !isLightMode
                    ? "text-white"
                    : "text-foreground group-hover:text-primary"
                }`}
              >
                Meridian&apos;s
              </h1>
              <p
                className={`text-[9px] sm:text-[10px] uppercase tracking-widest font-bold leading-tight transition-colors ${
                  !isLightMode
                    ? "text-white/80"
                    : "text-muted-foreground"
                }`}
              >
                Group of Education
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-0.5 xl:gap-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              const hasChildren = "children" in item && item.children;

              if (hasChildren) {
                const isChildActive = item.children?.some(
                  (child) =>
                    pathname === child.href || pathname.startsWith(child.href)
                );
                const isDropdownOpen = openDropdown === item.label;

                return (
                  <div key={item.href} className="relative">
                    <button
                      onClick={() =>
                        setOpenDropdown((prev) =>
                          prev === item.label ? null : item.label
                        )
                      }
                      onMouseEnter={() => setOpenDropdown(item.label)}
                      aria-expanded={isDropdownOpen}
                      aria-haspopup="true"
                      className={`px-3 xl:px-3.5 py-1.5 text-xs xl:text-sm font-semibold rounded-full transition-all duration-200 flex items-center gap-1 ${
                        isActive || isChildActive
                          ? "bg-primary text-white shadow-xs"
                          : !isLightMode
                            ? "text-white/90 hover:text-white hover:bg-white/15"
                            : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isDropdownOpen && (
                      <div
                        role="menu"
                        onMouseLeave={() => setOpenDropdown(null)}
                        className="absolute top-full left-0 mt-2 z-50 min-w-[180px] bg-card/98 backdrop-blur-xl border border-border/80 rounded-2xl shadow-xl p-1.5 space-y-0.5 animate-in fade-in-0 zoom-in-95 duration-150"
                      >
                        {item.children?.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            role="menuitem"
                            onClick={() => setOpenDropdown(null)}
                            className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-colors ${
                              pathname === child.href
                                ? "text-primary bg-primary/10"
                                : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                            }`}
                          >
                            <span>{child.label}</span>
                            <ArrowRight
                              className={`w-3.5 h-3.5 ${
                                pathname === child.href
                                  ? "opacity-100 text-primary"
                                  : "opacity-0"
                              }`}
                            />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 xl:px-3.5 py-1.5 text-xs xl:text-sm font-semibold rounded-full transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white shadow-xs"
                      : !isLightMode
                        ? "text-white/90 hover:text-white hover:bg-white/15"
                        : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Action: Apply Now & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* CTA Button */}
            <Button
              asChild
              size="sm"
              className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-white font-semibold text-xs xl:text-sm px-4 xl:px-5 py-2 h-9 xl:h-10 rounded-full shadow-sm hover:shadow-md transition-all group shrink-0"
            >
              <Link href="/admission-form">
                <span>Apply Now</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              className={`md:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                !isLightMode
                  ? "text-white hover:bg-white/15"
                  : "text-foreground hover:bg-primary/5"
              }`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-card/98 backdrop-blur-xl border border-border/80 mt-2 rounded-2xl shadow-2xl"
            >
              <div className="p-4 sm:p-5 space-y-1 max-h-[calc(100vh-5.5rem)] overflow-y-auto">
                {navItems.map((item, idx) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));
                  const hasChildren = "children" in item && item.children;
                  const isChildActive =
                    hasChildren &&
                    item.children?.some(
                      (child) =>
                        pathname === child.href ||
                        pathname.startsWith(child.href)
                    );
                  const isDropdownOpen = openDropdown === item.label;

                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      {hasChildren ? (
                        <div>
                          <button
                            onClick={() =>
                              setOpenDropdown(
                                isDropdownOpen ? null : item.label
                              )
                            }
                            aria-expanded={isDropdownOpen}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                              isActive || isChildActive
                                ? "bg-primary text-white shadow-xs"
                                : "text-foreground hover:bg-primary/5"
                            }`}
                          >
                            <span>{item.label}</span>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isDropdownOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {isDropdownOpen && (
                            <div className="ml-3 pl-3 border-l-2 border-primary/20 space-y-1 my-1">
                              {item.children?.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                                    pathname === child.href
                                      ? "bg-primary/10 text-primary"
                                      : "text-foreground/80 hover:bg-primary/5"
                                  }`}
                                  onClick={() => setIsOpen(false)}
                                >
                                  <span>{child.label}</span>
                                  <ArrowRight
                                    className={`w-3.5 h-3.5 ${
                                      pathname === child.href
                                        ? "opacity-100"
                                        : "opacity-0"
                                    }`}
                                  />
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            isActive
                              ? "bg-primary text-white shadow-xs"
                              : "text-foreground hover:bg-primary/5"
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          <span>{item.label}</span>
                          <ArrowRight
                            className={`w-4 h-4 ${
                              isActive ? "opacity-100" : "opacity-0"
                            }`}
                          />
                        </Link>
                      )}
                    </motion.div>
                  );
                })}

                <div className="pt-3 mt-2 border-t border-border/60">
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl h-11 text-sm shadow-md shadow-primary/20"
                  >
                    <Link href="/admission-form">Apply for Admission</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
