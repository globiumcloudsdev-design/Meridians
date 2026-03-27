"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export const Preloader: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        y: "-100%",
        transition: { duration: 0.8, ease: [0.45, 0, 0.55, 1] } 
      }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
    >
      <div className="relative">
        {/* Animated Background Rings */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 -m-20 border-[20px] border-primary/20 rounded-full blur-2xl"
        />
        
        <div className="flex flex-col items-center relative z-10 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ 
              duration: 1, 
              ease: "backOut" 
            }}
            className="mb-8"
          >
            <div className="w-32 h-32 md:w-48 md:h-48 relative bg-white rounded-3xl p-4 shadow-2xl shadow-primary/10">
              <Image
                src="/logo.jpg"
                alt="Meridian's Logo"
                fill
                className="object-contain p-2"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-primary italic font-serif mb-2">
              Meridian's
            </h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1, duration: 1 }}
              className="h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto mb-4"
            />
            <p className="text-muted-foreground uppercase tracking-[0.3em] text-xs md:text-sm font-bold">
              Excellence in Education
            </p>
          </motion.div>
        </div>
      </div>

      {/* Loading Bar */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 h-1 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ left: "-100%" }}
          animate={{ left: "100%" }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 bottom-0 w-1/2 bg-primary"
        />
      </div>
    </motion.div>
  );
};
