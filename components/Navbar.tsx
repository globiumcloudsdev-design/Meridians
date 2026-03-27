"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isTransparentPage =
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/programs" ||
    pathname === "/blog" ||
    pathname === "/admission-form" ||
    pathname === "/admissions" ||
    pathname === "/contact";

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Programs", href: "/programs" },
    { label: "Blog", href: "/blog" },
    { label: "Admissions", href: "/admissions" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        isScrolled || !isTransparentPage
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-26 h-12">
              <Image
                src="/logo.jpg"
                alt="Meridian's Logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1
                className={`text-xl font-black transition-colors ${!isScrolled && isTransparentPage && !isOpen ? "text-white" : "text-primary"}`}
              >
                Meridian's
              </h1>
              <p
                className={`text-[10px] uppercase tracking-widest font-bold transition-colors ${!isScrolled && isTransparentPage && !isOpen ? "text-white/70" : "text-muted-foreground"}`}
              >
                Excellence in Education
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    `px-4 py-2 text-sm font-bold rounded-full transition-all duration-300 ` +
                    (isActive
                      ? "bg-primary text-white shadow-lg"
                      : !isScrolled && isTransparentPage
                        ? "text-white/90 hover:text-white hover:bg-white/10"
                        : "text-foreground hover:text-primary hover:bg-primary/5")
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* CTA Button */}
          <Button
            asChild
            className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-white"
          >
            <Link href="/admission-form">Apply Now</Link>
          </Button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-xl transition-colors ${!isScrolled && isTransparentPage && !isOpen ? "text-white hover:bg-white/10" : "text-foreground hover:bg-primary/5"}`}
          >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-background/98 backdrop-blur-xl border-t border-border mt-2 rounded-3xl shadow-2xl"
            >
              <div className="p-6 space-y-4">
                {navItems.map((item, idx) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className={
                          `flex items-center justify-between p-4 rounded-2xl text-lg font-bold transition-all ` +
                          (isActive
                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                            : "text-foreground hover:bg-primary/5")
                        }
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                        <ArrowRight
                          className={`w-5 h-5 ${isActive ? "opacity-100" : "opacity-0"}`}
                        />
                      </Link>
                    </motion.div>
                  );
                })}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-4"
                >
                  <Button
                    asChild
                    size="xl"
                    className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-xl shadow-primary/20"
                  >
                    <Link href="/admission-form">Apply for Admission</Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
