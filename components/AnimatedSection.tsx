"use client";
import React from "react";
import { motion } from "framer-motion";

interface AnimatedSectionProps {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
}

const getVariants = (direction: string) => {
  switch (direction) {
    case "left":
      return {
        hidden: { opacity: 0, x: -60 },
        visible: { opacity: 1, x: 0 },
      };
    case "right":
      return {
        hidden: { opacity: 0, x: 60 },
        visible: { opacity: 1, x: 0 },
      };
    case "up":
      return {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0 },
      };
    case "down":
      return {
        hidden: { opacity: 0, y: -60 },
        visible: { opacity: 1, y: 0 },
      };
    default:
      return {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 },
      };
  }
};

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  direction = "up",
  delay = 0.1,
  duration = 0.7,
  className = "",
}) => {
  return (
    <motion.section
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay }}
      variants={getVariants(direction)}
    >
      {children}
    </motion.section>
  );
};
