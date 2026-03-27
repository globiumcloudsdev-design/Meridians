"use client";

import { AnimatedSection } from "./AnimatedSection";
import { motion } from "framer-motion";

interface PageHeroProps {
  badge: string;
  titleMain: string;
  titleAccent: string;
  description: string;
  image: string;
}

export function PageHero({
  badge,
  titleMain,
  titleAccent,
  description,
  image,
}: PageHeroProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden pt-32 pb-20">
      {/* Background with Overlays and Motion */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img
          src={image}
          alt={titleMain}
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for "gray/dark" look as requested */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          <AnimatedSection direction="left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-black uppercase tracking-[0.3em] mb-6 backdrop-blur-md">
                {badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]"
            >
              {titleMain} <br />
              <span className="text-secondary italic font-serif">
                {titleAccent}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="text-xl md:text-2xl text-white/80 font-medium leading-relaxed drop-shadow-lg"
            >
              {description}
            </motion.p>

            {/* Premium decoration line with animation */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-12 flex gap-4"
            >
              <div className="h-1.5 w-24 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.3)]" />
              <div className="h-1.5 w-8 bg-secondary rounded-full" />
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
