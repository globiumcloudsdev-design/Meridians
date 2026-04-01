"use client";
import { AnimatedSection } from "@/components/AnimatedSection";

import { Navbar } from "@/components/Navbar";
import { PageHero } from "@/components/PageHero";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { BlogPost } from "@/lib/types";
import { API_BLOG } from "@/lib/api/endpoints";
import {
  Calendar,
  User,
  ArrowRight,
  Search,
  Filter,
  Newspaper,
  TrendingUp,
  History,
  LayoutGrid,
} from "lucide-react";

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const categories = ["All", "Announcement", "Success Story", "News", "Event"];

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch(API_BLOG);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
        setFilteredPosts(data);
      } else {
        toast.error("Failed to load blog posts");
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      toast.error("Error loading blog posts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page on filter
    if (category === "All") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter((post) => post.category === category));
    }
  };

  // Pagination Logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <PageHero
        badge="News & Stories"
        titleMain="Blog &"
        titleAccent="Updates"
        image="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1920&q=80"
        description="Stay connected with the latest happenings, student achievements, and academic news."
      />

      {/* Filter Categories */}
      <section className="py-12 bg-background relative z-20 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-4 rounded-[32px] bg-card/80 backdrop-blur-xl border border-primary/10 shadow-2xl shadow-primary/5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <h3 className="font-black text-foreground uppercase tracking-widest text-xs">
                  Categories
                </h3>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                {categories.map((category, idx) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryFilter(category)}
                    className={`px-6 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                        : "bg-primary/5 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 bg-background relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header for current view */}
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-black tracking-tight">
              Showing{" "}
              <span className="text-primary italic">{selectedCategory}</span>{" "}
              Posts
            </h2>
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">
              {filteredPosts.length} results found
            </p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-muted-foreground font-bold tracking-widest uppercase text-xs">
                Fetching latest stories...
              </p>
            </div>
          ) : currentPosts.length === 0 ? (
            <div className="text-center py-24 bg-primary/5 rounded-[40px] border border-dashed border-primary/20">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-primary/40" />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-2">
                No Stories Found
              </h3>
              <p className="text-muted-foreground">
                Try selecting a different category or check back later.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentPosts.map((post, idx) => (
                  <AnimatedSection
                    direction="up"
                    delay={0.05 * idx}
                    key={post._id}
                    className="h-full"
                  >
                    <Card className="group h-full bg-card rounded-[32px] border border-primary/10 overflow-hidden hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 flex flex-col">
                      {/* Image Container */}
                      <div className="relative aspect-[16/10] overflow-hidden">
                        {post.imageUrl ? (
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                            <Newspaper className="w-12 h-12 text-primary/20" />
                          </div>
                        )}

                        {/* Category Badge overlay */}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-widest shadow-lg">
                            {post.category || "General"}
                          </span>
                        </div>
                      </div>

                      <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground mb-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            {new Date(post.publishedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </div>
                          <div className="w-1 h-1 rounded-full bg-primary/30" />
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-primary" />
                            {post.author}
                          </div>
                        </div>
                        <CardTitle className="text-2xl font-black leading-tight tracking-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
                          {post.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="px-8 pb-8 flex-1 flex flex-col">
                        <p className="text-muted-foreground leading-relaxed text-sm mb-8 flex-1 line-clamp-3">
                          {post.excerpt}
                        </p>

                        <div className="pt-6 border-t border-primary/10">
                          <Button
                            asChild
                            variant="ghost"
                            className="p-0 h-auto hover:bg-transparent text-primary hover:text-primary/80 font-black text-sm uppercase tracking-widest flex items-center gap-2 group/btn"
                          >
                            <Link href={`/blog/${post.slug}`}>
                              Keep Reading
                              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-20 flex justify-center items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-2xl h-12 w-12 p-0 border-primary/10 hover:border-primary group"
                  >
                    <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  </Button>

                  <div className="flex items-center gap-2 bg-primary/5 p-1.5 rounded-[20px]">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => paginate(i + 1)}
                        className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${
                          currentPage === i + 1
                            ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110"
                            : "hover:bg-primary/10 text-muted-foreground"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded-2xl h-12 w-12 p-0 border-primary/10 hover:border-primary group"
                  >
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
