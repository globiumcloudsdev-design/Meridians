"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Preloader } from "@/components/Preloader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Users, Award, Lightbulb } from "lucide-react";
import {
  Hero,
  Stats,
  AboutSection,
  WhyChooseUs,
  Features,
  CampusFacilities,
  SplitHighlight,
  FunGallery,
} from "@/components/HomeSections";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ArrowRight, LayoutGrid, Newspaper, Search } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { FinalCTA } from "@/components/FinalCTA";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { API_BLOG } from "@/lib/api/endpoints";
import { BlogPost } from "@/lib/types";

export default function Home() {
  const [featuredBlogs, setFeaturedBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedBlogs = async () => {
      try {
        const response = await fetch(API_BLOG);
        if (response.ok) {
          const data = await response.json();
          // Filter for featured and published blogs
          const featured = data
            .filter(
              (blog: BlogPost) => blog.featured && blog.status === "published",
            )
            .slice(0, 6);
          setFeaturedBlogs(featured);
        }
      } catch (error) {
        console.error("Error fetching featured blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedBlogs();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Navbar />
        <Hero />
        <Stats />
        <AboutSection />
        <WhyChooseUs />
        <Features />

        {/* Visual Highlight 1 */}
        <SplitHighlight
          badge="Scientific Discovery"
          title="Nurturing the Next Generation of Innovators"
          description="Our state-of-the-art laboratories and STEM-focused curriculum provide students with the tools they need to explore, experiment, and excel in the sciences."
          image="https://images.unsplash.com/photo-1564910443496-5fd2d068dd82?auto=format&fit=crop&w=1200&q=80"
        />

        {/* New Image-Rich Facilities Section */}
        <CampusFacilities />

        {/* Visual Highlight 2 - Reversed */}
        <SplitHighlight
          badge="Empowerment"
          title="Building Confidence Through Expression"
          description="From performing arts to creative writing, we encourage our students to find their voice and express their unique talents in a supportive and inspiring environment."
          image="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80"
          reverse
        />

        {/* Gallery Section */}
        <FunGallery />

        {/* Latest Blog Posts */}
        <AnimatedSection direction="right" className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <SectionHeader
                title="Education"
                titleAccent="News"
                description="Stay updated with our latest stories, achievements, and events."
              />
              <Button
                asChild
                variant="outline"
                className="hidden sm:inline-flex rounded-full px-8 py-6 h-auto"
              >
                <Link href="/blog">
                  View All Posts <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-96 text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : featuredBlogs.length > 0 ? (
              <Carousel
                className="w-full"
                opts={{ align: "start", loop: true }}
              >
                <CarouselContent className="-ml-4">
                  {featuredBlogs.map((blog) => (
                    <CarouselItem
                      key={blog._id}
                      className="pl-4 md:basis-1/2 lg:basis-1/3"
                    >
                      <Card className="border-none shadow-sm hover:shadow-xl transition-all h-full flex flex-col group overflow-hidden rounded-3xl group">
                        {blog.imageUrl && (
                          <div className="relative w-full h-64 overflow-hidden bg-muted">
                            <img
                              src={blog.imageUrl}
                              alt={blog.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-4 left-4">
                              <span className="text-xs font-bold uppercase tracking-widest text-white bg-primary px-3 py-1 rounded-full">
                                {blog.category || "General"}
                              </span>
                            </div>
                          </div>
                        )}
                        <div className="p-8 flex-1 flex flex-col">
                          <p className="text-xs text-muted-foreground mb-4 font-medium uppercase tracking-widest">
                            {new Date(blog.publishedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </p>
                          <CardTitle className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight">
                            {blog.title}
                          </CardTitle>
                          <p className="text-muted-foreground line-clamp-2 mb-6 flex-1">
                            {blog.excerpt}
                          </p>
                          <Button
                            asChild
                            variant="link"
                            className="p-0 h-auto text-primary font-bold group-hover:gap-2 transition-all"
                          >
                            <Link href={`/blog/${blog.slug}`}>
                              Read Full Article{" "}
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-end gap-2 mt-8 md:mt-12 mr-8">
                  <CarouselPrevious className="relative translate-y-0 left-0 hover:bg-primary hover:text-white border-primary/20" />
                  <CarouselNext className="relative translate-y-0 right-0 hover:bg-primary hover:text-white border-primary/20" />
                </div>
              </Carousel>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Introducing New STEM Programs",
                    excerpt:
                      "We are excited to announce our new Science, Technology, Engineering, and Mathematics programs.",
                    category: "Announcement",
                    date: "March 15, 2024",
                  },
                  {
                    title: "Student Excellence Achievements",
                    excerpt:
                      "Our students have excelled in various national and international competitions this year.",
                    category: "Success Story",
                    date: "March 10, 2024",
                  },
                  {
                    title: "Campus Facilities Upgrade",
                    excerpt:
                      "Meridian's has invested in state-of-the-art learning spaces and modern technology.",
                    category: "News",
                    date: "March 05, 2024",
                  },
                ].map((post, idx) => (
                  <Card
                    key={idx}
                    className="border-none shadow-sm hover:shadow-xl transition-all h-full flex flex-col rounded-3xl overflow-hidden group"
                  >
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                          {post.category}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                          {post.date}
                        </span>
                      </div>
                      <CardTitle className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight">
                        {post.title}
                      </CardTitle>
                      <p className="text-muted-foreground mb-8 text-base leading-relaxed">
                        {post.excerpt}
                      </p>
                      <Button
                        asChild
                        variant="link"
                        className="p-0 h-auto text-primary font-bold group-hover:gap-2 transition-all"
                      >
                        <Link href="/blog">
                          Read More <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </AnimatedSection>

        <FinalCTA
          title="Ready to Transform"
          titleAccent="Child's Future?"
          description="Join our community of learners and achievers. Applications are now open for the 2024-25 academic session."
          primaryBtnText="Start Registration"
          primaryBtnLink="/admission-form"
          secondaryBtnText="Inquire Now"
          secondaryBtnLink="/contact"
        />
      </main>
      <Footer />
    </div>
  );
}
