"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Preloader } from "@/components/Preloader";

export default function PageLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Start loading when pathname changes
    setLoading(true);

    // Stop loading after a short delay to simulate page transition
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200); // 1.2s delay for a premium feel

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      {loading && <Preloader key={pathname} />}
    </AnimatePresence>
  );
}
