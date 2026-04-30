"use client";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Navbar } from "@/components/Navbar";
import { PageHero } from "@/components/PageHero";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { LibraryItem } from "@/lib/types/library";
import { API_LIBRARY } from "@/lib/api/endpoints";
import {
  Search,
  FileText,
  BookOpen,
  Download,
} from "lucide-react";

export default function LibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<LibraryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchLibraryItems();
  }, []);

  const fetchLibraryItems = async () => {
    try {
      const response = await fetch(API_LIBRARY);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
        setFilteredItems(data);
      } else {
        toast.error("Failed to load library items");
      }
    } catch (error) {
      console.error("Error fetching library items:", error);
      toast.error("Error loading library items");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  };

  const handleDownload = (url: string, title: string) => {
    try {
      // Clean the title to use as filename
      const cleanFilename = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      
      // Use Cloudinary transformation to force download with a specific filename
      // fl_attachment flag forces download
      // Note: Cloudinary doesn't support setting custom filename directly in URL transformations 
      // but fl_attachment will trigger the browser download dialog.
      const downloadUrl = url.replace('/upload/', `/upload/fl_attachment:${cleanFilename}/`);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${cleanFilename}.pdf`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Download started!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Error downloading file. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <PageHero
        badge="Digital Resources"
        titleMain="Knowledge"
        titleAccent="Library"
        image="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1920&q=80"
        description="Access our curated collection of educational materials, books, and resources to support your learning journey."
      />

      {/* Search Section */}
      <section className="py-12 bg-background relative z-20 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-[32px] bg-card/80 backdrop-blur-xl border border-primary/10 shadow-2xl shadow-primary/5">
            <div className="relative w-full max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search for books or resources..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-primary/5 border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Library Grid */}
      <section className="py-20 bg-background relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-black tracking-tight">
              {searchQuery ? (
                <>
                  Search Results for <span className="text-primary italic">"{searchQuery}"</span>
                </>
              ) : (
                "All Resources"
              )}
            </h2>
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">
              {filteredItems.length} resources found
            </p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-muted-foreground font-bold tracking-widest uppercase text-xs">
                Opening the library...
              </p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-24 bg-primary/5 rounded-[40px] border border-dashed border-primary/20">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-primary/40" />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-2">
                No Resources Found
              </h3>
              <p className="text-muted-foreground">
                Try searching for something else or check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, idx) => (
                <AnimatedSection
                  direction="up"
                  delay={0.05 * idx}
                  key={item._id}
                  className="h-full"
                >
                  <Card className="group h-full bg-gray-100 rounded-[2.5rem] border overflow-hidden border-primary/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col">
                    <div className="relative h-56 shrink-0 overflow-hidden bg-muted">
                      {item.thumbnail && !failedImages[item._id] ? (
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          onError={() =>
                            setFailedImages((prev) => ({
                              ...prev,
                              [item._id]: true,
                            }))
                          }
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-primary/10 via-primary/5 to-secondary/10 flex items-center justify-center">
                          <div className="text-center px-6">
                            <div className="w-16 h-16 rounded-2xl bg-white/90 backdrop-blur-md border border-primary/20 flex items-center justify-center mx-auto mb-4 shadow-xl transform group-hover:scale-110 transition-transform duration-500">
                              <BookOpen className="w-8 h-8 text-primary" />
                            </div>
                            <p className="text-xs font-black uppercase tracking-[0.25em] text-primary/70">
                              No Preview
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                        <div className="flex gap-3 w-full">
                          <Button 
                            onClick={() => handleDownload(item.pdfUrl, item.title)}
                            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-black rounded-xl shadow-lg hover:scale-[1.02] transition-transform"
                          >
                            <Download className="w-4 h-4 mr-2" /> Download PDF
                          </Button>
                        </div>
                      </div>
                    </div>

                    <CardHeader className="p-6 pt-2 pb-2">
                      <div className="text-[10px] sm:text-xs font-bold text-black uppercase tracking-widest ">
                        Document Title
                      </div>
                      <CardTitle className="text-xl sm:text-2xl font-black text-primary ">
                        {item.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="px-6 pb-6 flex-1 flex flex-col">
                      <div className="text-[10px] sm:text-xs font-bold text-black uppercase tracking-widest mb-2">
                        Description
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-sm mb-6 flex-1 font-medium bg-muted/30 p-4 rounded-xl border ">
                        {item.description}
                      </p>

                      <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                        <div className="flex items-center text-[10px] sm:text-xs font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full">
                          <FileText className="w-3.5 h-3.5 mr-1.5" />
                          PDF Resource
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(item.pdfUrl, item.title)}
                          className="text-secondary hover:text-white hover:bg-secondary rounded-xl transition-colors bg-secondary/30 w-10 h-10"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
