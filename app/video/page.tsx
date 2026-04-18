"use client";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Navbar } from "@/components/Navbar";
import { PageHero } from "@/components/PageHero";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { API_VIDEOS } from "@/lib/api/endpoints";
import { VideoResponse } from "@/lib/types/uploadVideo";
import {
  Calendar,
  ArrowRight,
  Search,
  Youtube,
  Clock,
  LayoutGrid,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";

function VideoPage() {
  const [videos, setVideos] = useState<VideoResponse[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoResponse[]>([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 6;

  useEffect(() => {
    fetchAllVideos();
  }, []);

  // Fetch all videos initially
  const fetchAllVideos = async () => {
    try {
      const response = await fetch(API_VIDEOS);
      if (response.ok) {
        const data: VideoResponse[] = await response.json();
        // Only show active videos
        const activeVideos = data.filter((video) => video.status === "active");
        setVideos(activeVideos);
        setFilteredVideos(activeVideos);
      } else {
        toast.error("Failed to load videos");
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast.error("Error loading videos");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter videos by category on button click
  const handleSearchByCategory = () => {
    if (!categoryInput.trim()) {
      toast.error("Please enter a category");
      return;
    }

    setCurrentPage(1);

    // Filter videos where category matches (case insensitive)
    const filtered = videos.filter(
      (video) =>
        video.category.toLowerCase() === categoryInput.toLowerCase().trim(),
    );

    if (filtered.length > 0) {
      setFilteredVideos(filtered);
      toast.success(
        `Found ${filtered.length} video(s) in category "${categoryInput}"`,
      );
    } else {
      setFilteredVideos([]);
      toast.error(`No videos found in category "${categoryInput}"`);
    }
  };

  // Show all videos
  const handleShowAll = () => {
    setCategoryInput("");
    setFilteredVideos(videos);
    setCurrentPage(1);
    toast.success("Showing all videos");
  };

  // Get YouTube thumbnail
  const getYouTubeThumbnail = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : null;
  };

  // Pagination Logic
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = filteredVideos.slice(
    indexOfFirstVideo,
    indexOfLastVideo,
  );
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <PageHero
        badge="Video Gallery"
        titleMain="Video &"
        titleAccent="Updates"
        image="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1920&q=80"
        description="Watch the latest videos, tutorials, webinars, and events from our community."
      />

      {/* Search by Category Section */}
      <section className="py-12 bg-background relative z-20 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-[32px] bg-card/80 backdrop-blur-xl border border-primary/10 shadow-2xl shadow-primary/5">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <h3 className="font-black text-foreground uppercase tracking-widest text-xs">
                  Search by Category
                </h3>
              </div>

              <div className="flex flex-1 flex-wrap items-center gap-3 w-full lg:w-auto">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    placeholder="e.g., Tutorial, Webinar, Interview, Announcement"
                    className="rounded-full"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSearchByCategory();
                      }
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSearchByCategory}
                    disabled={!categoryInput.trim()}
                    className="rounded-full bg-primary hover:bg-primary/90 text-white px-6"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>

                  {categoryInput && filteredVideos.length !== videos.length && (
                    <Button
                      onClick={handleShowAll}
                      variant="outline"
                      className="rounded-full"
                    >
                      Show All
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Active Filter Display */}
            {categoryInput &&
              filteredVideos.length !== videos.length &&
              filteredVideos.length > 0 && (
                <div className="mt-4 pt-4 border-t border-primary/10">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground">
                      Active Filter:
                    </span>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      Category: {categoryInput}
                    </span>
                  </div>
                </div>
              )}
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="pb-12 bg-background relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight">
                {categoryInput ? (
                  <>
                    Showing{" "}
                    <span className="text-primary italic">{categoryInput}</span>{" "}
                    Videos
                  </>
                ) : (
                  "All Videos"
                )}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Watch and learn from our video collection
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Youtube className="w-4 h-4 text-primary" />
              <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">
                {filteredVideos.length} video(s) found
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-muted-foreground font-bold tracking-widest uppercase text-xs">
                Loading videos...
              </p>
            </div>
          ) : currentVideos.length === 0 ? (
            <div className="text-center py-24 bg-primary/5 rounded-[40px] border border-dashed border-primary/20">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Youtube className="w-10 h-10 text-primary/40" />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-2">
                No Videos Found
              </h3>
              <p className="text-muted-foreground">
                {categoryInput
                  ? `No videos found in category "${categoryInput}". Try a different category.`
                  : "Check back later for new video content."}
              </p>
              {categoryInput && (
                <Button
                  onClick={handleShowAll}
                  variant="outline"
                  className="mt-6 rounded-full"
                >
                  Show All Videos
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentVideos.map((video, idx) => {
                  {
                    console.log(video);
                  }
                  const thumbnailUrl = getYouTubeThumbnail(video.link);

                  return (
                    <AnimatedSection
                      direction="up"
                      delay={0.05 * idx}
                      key={video._id}
                      className="h-full"
                    >
                      <Card className="group h-full bg-card rounded-[32px] border border-primary/10 overflow-hidden hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 flex flex-col py-0">
                        {/* Video Thumbnail */}
                        <div className="relative aspect-video overflow-hidden cursor-pointer">
                          {thumbnailUrl ? (
                            <img
                              src={thumbnailUrl}
                              alt={video.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 flex items-center justify-center">
                              <Youtube className="w-16 h-16 text-primary/30" />
                            </div>
                          )}

                          {/* Category Badge */}
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-widest shadow-lg">
                              {video.category || "General"}
                            </span>
                          </div>

                          {/* Duration Badge */}
                          <div className="absolute bottom-3 right-3">
                            <span className="px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest">
                              <Clock className="w-3 h-3 inline mr-1" />
                              Watch Now
                            </span>
                          </div>
                        </div>

                        <CardHeader className="p-8 pb-2">
                          <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground mb-4">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-primary" />
                              {new Date(video.createdAt).toLocaleDateString(
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
                            {video.author || "Admin"}
                          </div>
                          </div>
                          <CardTitle className="text-2xl font-black leading-tight tracking-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
                            {video.title}
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="px-8 pb-8 flex-1 flex flex-col">
                          <p className="text-muted-foreground leading-relaxed text-sm mb-8 flex-1 line-clamp-3">
                            {video.description}
                          </p>

                          <div className="pt-6 border-t border-primary/10">
                            <Button
                              asChild
                              variant="ghost"
                              className="p-0 h-auto hover:bg-transparent text-primary hover:text-primary/80 font-black text-sm uppercase tracking-widest flex items-center gap-2 group/btn"
                            >
                              <Link href={`/video/${video._id}`}>
                                Watch Video
                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </AnimatedSection>
                  );
                })}
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => paginate(page)}
                          className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${
                            currentPage === page
                              ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110"
                              : "hover:bg-primary/10 text-muted-foreground"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
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

export default VideoPage;
