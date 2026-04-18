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
import { homeAssets } from "@/lib/assets";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ArrowRight, LayoutGrid, Newspaper, Search, Calendar } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { FinalCTA } from "@/components/FinalCTA";
import { API_BLOG } from "@/lib/api/endpoints";
import { BlogPost } from "@/lib/types";
import { getCurrentAcademicSession } from "@/lib/utils";


export default function Home() {
  const [featuredBlogs, setFeaturedBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [failedFeaturedImages, setFailedFeaturedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
  const fetchLatestBlogs = async () => {
      try {
        const response = await fetch(API_BLOG);
        if (response.ok) {
          const data = await response.json();
          // Get latest 6 published blogs
          const latest = data
            .filter(
              (blog: BlogPost) => blog.status === "published",
            )
            .slice(0, 6);
          setFeaturedBlogs(latest);
        }
      } catch (error) {
        console.error("Error fetching latest blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestBlogs();
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
          image={homeAssets["Nurturing the Next Generation of Innovators"][0]}
        />

        {/* New Image-Rich Facilities Section */}
        <CampusFacilities />

        {/* Visual Highlight 2 - Reversed */}
        <SplitHighlight
          badge="Empowerment"
          title="Building Confidence Through Expression"
          description="From performing arts to creative writing, we encourage our students to find their voice and express their unique talents in a supportive and inspiring environment."
          image={homeAssets["Building Confidence Through Expression"][0]}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredBlogs.map((blog, idx) => (
                  <AnimatedSection
                    direction="up"
                    delay={0.05 * idx}
                    key={blog._id}
                    className="h-full"
                  >
                    <Card className="group h-full bg-card rounded-[32px] border border-primary/10 overflow-hidden hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 flex flex-col py-0">
                      {/* Image Container */}
                      <div className="relative aspect-[26/16] overflow-hidden">
                        {blog.imageUrl && !failedFeaturedImages[blog._id] ? (
                          <img
                            src={blog.imageUrl}
                            alt={blog.title}
                            onError={() =>
                              setFailedFeaturedImages((prev) => ({
                                ...prev,
                                [blog._id]: true,
                              }))
                            }
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 flex items-center justify-center">
                            <div className="text-center px-6">
                              <div className="w-16 h-16 rounded-2xl bg-white/80 border border-primary/20 flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <Newspaper className="w-8 h-8 text-primary/50" />
                              </div>
                              <p className="text-xs font-black uppercase tracking-[0.25em] text-primary/50">
                                No Image Uploaded
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Category Badge overlay */}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-widest shadow-lg">
                            {blog.category || "General"}
                          </span>
                        </div>
                      </div>

                      <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground mb-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            {new Date(blog.publishedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </div>
                        </div>
                        <CardTitle className="text-2xl font-black leading-tight tracking-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
                          {blog.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="px-8 pb-8 flex-1 flex flex-col">
                        <p className="text-muted-foreground leading-relaxed text-sm mb-8 flex-1 line-clamp-3">
                          {blog.excerpt}
                        </p>

                        <div className="pt-6 border-t border-primary/10">
                          <Button
                            asChild
                            variant="ghost"
                            className="p-0 h-auto hover:bg-transparent text-primary hover:text-primary/80 font-black text-sm uppercase tracking-widest flex items-center gap-2 group/btn"
                          >
                            <Link href={`/blog/${blog.slug}`}>
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
          description={`Join our community of learners and achievers. Applications are now open for the ${getCurrentAcademicSession()} academic session.`}
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
