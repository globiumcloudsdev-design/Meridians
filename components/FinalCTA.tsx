"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FinalCTAProps {
  title: string;
  titleAccent?: string;
  description: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
  className?: string;
}

export function FinalCTA({
  title,
  titleAccent,
  description,
  primaryBtnText,
  primaryBtnLink,
  secondaryBtnText,
  secondaryBtnLink,
  className,
}: FinalCTAProps) {
  const isAdmissionFormLink = (link: string) =>
    link === "/admission-form" || link.startsWith("/admission-form?");

  const getLinkTargetProps = (link: string) =>
    isAdmissionFormLink(link)
      ? {}
      : { target: "_blank", rel: "noopener noreferrer" };

  return (
    <section className={cn("relative py-24 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-primary z-0">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-white/5 skew-x-[-20deg] translate-x-[20%]" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/10 backdrop-blur-md rounded-[3rem] p-8 md:p-20 border border-white/20 text-center text-white">
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">
            {title} <br />
            {titleAccent && (
              <span className="text-secondary italic font-serif">
                {titleAccent}
              </span>
            )}
          </h2>
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 rounded-full h-16 px-12 text-xl font-bold shadow-xl"
            >
              <Link href={primaryBtnLink} {...getLinkTargetProps(primaryBtnLink)}>
                {primaryBtnText}
              </Link>
            </Button>
            {secondaryBtnText && secondaryBtnLink && (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-transparent text-white border-white/50 hover:bg-white/10 rounded-full h-16 px-12 text-xl font-bold"
              >
                <Link
                  href={secondaryBtnLink}
                  {...getLinkTargetProps(secondaryBtnLink)}
                >
                  {secondaryBtnText}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
