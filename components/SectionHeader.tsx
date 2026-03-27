"use client";
import { cn } from "@/lib/utils";
import { AnimatedSection } from "./AnimatedSection";

interface SectionHeaderProps {
  badge?: string;
  title?: string;
  titleAccent?: string;
  titleAccentSuffix?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  accentItalic?: boolean;
}

export function SectionHeader({
  badge,
  title,
  titleAccent,
  titleAccentSuffix,
  description,
  align = "left",
  className,
  accentItalic = true,
}: SectionHeaderProps) {
  return (
    <div
      className={cn("mb-10", align === "center" && "text-center", className)}
    >
      {badge && (
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          {badge}
        </span>
      )}
      {(title || titleAccent) && (
        <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight mb-6">
          {title}{" "}
          {titleAccent && (
            <span
              className={cn(
                "text-primary",
                accentItalic && "italic font-serif",
              )}
            >
              {titleAccent}
            </span>
          )}
        </h2>
      )}
      {description && (
        <p
          className={cn(
            "text-muted-foreground leading-relaxed",
            align === "center" && "max-w-2xl mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
