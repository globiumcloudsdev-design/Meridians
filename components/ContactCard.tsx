"use client";
import { LucideIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactCardProps {
  icon: LucideIcon;
  title: string;
  content: string;
  subText?: string;
  link?: string;
  className?: string;
}

export function ContactCard({
  icon: Icon,
  title,
  content,
  subText,
  link,
  className,
}: ContactCardProps) {
  const CardWrapper = link ? "a" : "div";
  const wrapperProps = link ? { href: link } : {};

  return (
    <CardWrapper
      {...(wrapperProps as any)}
      className={cn(
        "group flex gap-5 p-5 rounded-[24px] bg-card border border-primary/10 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300",
        link && "cursor-pointer",
        className,
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 flex-shrink-0">
        <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
      </div>
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1 group-hover:text-primary transition-colors">
          {title}
        </p>
        <p className="text-lg font-black text-foreground leading-none mb-1">
          {content}
        </p>
        {subText && (
          <p className="text-sm text-primary font-medium opacity-70 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            {subText} {link && <ArrowRight className="w-3 h-3" />}
          </p>
        )}
      </div>
    </CardWrapper>
  );
}
