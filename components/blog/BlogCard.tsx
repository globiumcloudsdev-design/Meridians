"use client";

import { BlogPost } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Calendar,
  User,
  ArrowRight,
  Newspaper,
  Clock,
  Share2,
  Bookmark,
  Eye,
} from "lucide-react";
import { useState } from "react";

// Category color mapping
const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  "Announcement": { bg: "bg-blue-500/10", text: "text-blue-600", border: "border-blue-500/20" },
  "Success Story": { bg: "bg-emerald-500/10", text: "text-emerald-600", border: "border-emerald-500/20" },
  "News": { bg: "bg-purple-500/10", text: "text-purple-600", border: "border-purple-500/20" },
  "Event": { bg: "bg-orange-500/10", text: "text-orange-600", border: "border-orange-500/20" },
  "General": { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
};

// Calculate read time based on content length
const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

// Format date
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

interface BlogCardProps {
  post: BlogPost;
  index: number;
  failedImages: Record<string, boolean>;
  onImageError: (id: string) => void;
  isFeatured?: boolean;
}

export function BlogCard({ post, index, failedImages, onImageError, isFeatured = false }: BlogCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const categoryStyle = categoryColors[post.category || "General"] || categoryColors["General"];
  const readTime = calculateReadTime(post.content || post.excerpt || "");

  const handleShare = async () => {
    const url = `${window.location.origin}/blog/${post.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: url,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <Card
      className={`group relative h-full bg-card rounded-3xl border border-primary/10 overflow-hidden transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 flex flex-col ${
        isFeatured ? "md:col-span-2 md:row-span-2" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className={`relative overflow-hidden bg-muted/40 ${isFeatured ? "aspect-[21/9]" : "aspect-[16/10]"}`}>
        {post.imageUrl && !failedImages[post._id] ? (
          <>
            {/* Skeleton loader */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-muted/60 to-muted/40 animate-pulse" />
            )}
            <img
              src={post.imageUrl}
              alt={post.title}
              onError={() => onImageError(post._id)}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover object-center transition-all duration-700 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              } ${isHovered ? "scale-110" : "scale-100"}`}
            />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#eaf5f2] via-[#f6fbfa] to-[#f4efe7] flex items-center justify-center">
            <div className="text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-white border border-primary/20 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Newspaper className="w-8 h-8 text-primary/60" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-primary/60">
                No Image
              </p>
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

        {/* Top Overlay Actions */}
        <div className={`absolute top-4 left-4 right-4 flex justify-between items-start transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}>
          {/* Category Badge */}
          <span className={`px-4 py-2 rounded-xl backdrop-blur-md text-xs font-black uppercase tracking-widest shadow-lg ${categoryStyle.bg} ${categoryStyle.text}`}>
            {post.category || "General"}
          </span>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            >
              <Share2 className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`w-9 h-9 rounded-xl backdrop-blur-sm flex items-center justify-center shadow-lg transition-colors ${
                isSaved ? "bg-primary text-white" : "bg-white/90 hover:bg-white"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "text-white" : "text-muted-foreground"}`} />
            </button>
          </div>
        </div>

        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute top-4 left-4">
            <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black uppercase tracking-widest shadow-lg">
              Featured
            </span>
          </div>
        )}

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-4 text-white/90 text-xs font-bold">
            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.publishedAt)}
            </div>
            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5">
              <Clock className="w-3.5 h-3.5" />
              {readTime} min read
            </div>
            {post.views && (
              <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5">
                <Eye className="w-3.5 h-3.5" />
                {post.views}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <CardHeader className={`p-6 pb-3 ${isFeatured ? "md:p-8" : ""}`}>
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5 bg-primary/5 rounded-full px-3 py-1.5">
            <User className="w-3.5 h-3.5 text-primary" />
            {post.author}
          </div>
        </div>
        <CardTitle className={`${isFeatured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"} font-black leading-tight tracking-tight group-hover:text-primary transition-colors duration-300 line-clamp-2`}>
          {post.title}
        </CardTitle>
      </CardHeader>

      <CardContent className={`px-6 pb-6 flex-1 flex flex-col ${isFeatured ? "md:px-8" : ""}`}>
        <p className="text-muted-foreground leading-relaxed text-sm mb-6 flex-1 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="pt-4 border-t border-primary/10 flex items-center justify-between">
          <Button
            asChild
            variant="ghost"
            className="h-11 px-0 justify-start hover:bg-transparent text-primary hover:text-primary/80 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 group/btn"
          >
            <Link href={`/blog/${post.slug}`}>
              Read Article
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </CardContent>

      {/* Decorative gradient on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl`} />
    </Card>
  );
}

// Skeleton Loader Component
export function BlogCardSkeleton({ isFeatured = false }: { isFeatured?: boolean }) {
  return (
    <div className={`group relative h-full bg-card rounded-3xl border border-primary/10 overflow-hidden animate-pulse flex flex-col ${isFeatured ? "md:col-span-2 md:row-span-2" : ""}`}>
      <div className={`relative overflow-hidden bg-muted/40 ${isFeatured ? "aspect-[21/9]" : "aspect-[16/10]"}`}>
        <div className="w-full h-full bg-gradient-to-br from-muted/60 to-muted/40" />
      </div>
      <div className="p-6 pb-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 w-24 bg-muted rounded-full" />
        </div>
        <div className="h-8 bg-muted rounded-lg mb-2 w-3/4" />
        <div className="h-8 bg-muted rounded-lg w-1/2" />
      </div>
      <div className="px-6 pb-6 flex-1 flex flex-col">
        <div className="h-4 bg-muted rounded mb-2 w-full" />
        <div className="h-4 bg-muted rounded mb-2 w-5/6" />
        <div className="h-4 bg-muted rounded mb-4 w-4/6" />
        <div className="pt-4 border-t border-primary/10">
          <div className="h-11 bg-muted rounded-xl w-32" />
        </div>
      </div>
    </div>
  );
}
