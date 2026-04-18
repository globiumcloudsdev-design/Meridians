'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ArrowLeft, Calendar, User, Eye, ThumbsUp, Share2, Youtube, Clock, Tag, ChevronRight } from 'lucide-react';
import { VideoResponse } from '@/lib/types/uploadVideo';
import { API_VIDEO_BY_ID } from '@/lib/api/endpoints';
import { AnimatedSection } from '@/components/AnimatedSection';
import { motion } from 'framer-motion';

export default function VideoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [video, setVideo] = useState<VideoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [videoId, setVideoId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const resolvedParams = await params;
      setVideoId(resolvedParams.id);
    })();
  }, [params]);

  useEffect(() => {
    if (videoId) {
      fetchVideo(videoId);
    }
  }, [videoId]);

  const fetchVideo = async (id: string) => {
    try {
      const response = await fetch(API_VIDEO_BY_ID(id));
      if (response.ok) {
        const data = await response.json();
        setVideo(data);
      } else {
        toast.error('Video not found');
      }
    } catch (error) {
      console.error('Error fetching video:', error);
      toast.error('Error loading video');
    } finally {
      setIsLoading(false);
    }
  };

  // Get YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Get embed URL
  const getEmbedUrl = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  // Get YouTube thumbnail URL
  const getYouTubeThumbnail = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground font-bold tracking-widest uppercase text-xs">
            Loading video...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-32">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto">
              <Youtube className="w-10 h-10 text-primary/40" />
            </div>
            <h2 className="text-3xl font-black text-foreground">Video Not Found</h2>
            <p className="text-muted-foreground max-w-md">
              The video you&apos;re looking for doesn&apos;t exist or may have been removed.
            </p>
            <Button asChild className="rounded-2xl px-8 py-3 h-auto bg-primary text-white hover:bg-primary/90 font-bold">
              <Link href="/video">← Back to Videos</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const embedUrl = getEmbedUrl(video.link);
  const isYouTube = video.link.includes('youtube.com') || video.link.includes('youtu.be');
  const thumbnailUrl = getYouTubeThumbnail(video.link);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* ── Hero Section with Background Image ── */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden pt-32 pb-20">
        {/* Background Image with Parallax-style scale */}
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="absolute inset-0 z-0 h-full w-full"
        >
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 flex items-center justify-center">
              <div className="text-center px-6">
                <div className="w-20 h-20 rounded-3xl bg-white/80 border border-primary/20 flex items-center justify-center mx-auto mb-5 shadow-lg">
                  <Youtube className="w-10 h-10 text-primary/60" />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-primary/70">
                  Video Content
                </p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AnimatedSection direction="left">
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 text-white/60 text-sm mb-6"
            >
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/video" className="hover:text-white transition-colors">Videos</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white/80 truncate max-w-[200px]">{video.title}</span>
            </motion.div>

            {/* Category Badge */}
            {video.category && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-black uppercase tracking-[0.3em] mb-6 backdrop-blur-md">
                  {video.category}
                </span>
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-[1.05]"
            >
              {video.title}
            </motion.h1>

            {/* Excerpt - trimmed description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="text-lg md:text-xl text-white/75 font-medium leading-relaxed max-w-3xl drop-shadow-lg"
            >
              {video.description?.length > 200 ? video.description.substring(0, 200) + '...' : video.description}
            </motion.p>

            {/* Decoration Line */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-8 flex gap-4"
            >
              <div className="h-1.5 w-24 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.3)]" />
              <div className="h-1.5 w-8 bg-secondary rounded-full" />
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Floating Meta Card ── */}
      <section className="relative z-20 -mt-10 pb-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="up" delay={0.3}>
            <div className="p-5 sm:p-6 rounded-[32px] bg-card/80 backdrop-blur-xl border border-primary/10 shadow-2xl shadow-primary/5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  {/* Date */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Published</p>
                      <p className="text-sm font-bold text-foreground">
                        {new Date(video.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="hidden sm:block w-px h-10 bg-primary/10" />

                  {/* Status */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Eye className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</p>
                      <p className="text-sm font-bold text-foreground capitalize">{video.status}</p>
                    </div>
                  </div>
                </div>

                {/* Share Button */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Link copied to clipboard!');
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary/5 hover:bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:scale-105"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Video Content ── */}
      <section className="py-10 sm:py-15 bg-background relative">
        {/* Decorative background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Video Player */}
          <AnimatedSection direction="up" delay={0.1}>
            <div className="rounded-[32px] overflow-hidden shadow-2xl shadow-primary/10 border border-primary/10 mb-12">
              {isYouTube ? (
                <iframe
                  src={embedUrl}
                  title={video.title}
                  className="w-full aspect-video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="aspect-video bg-primary/5 flex items-center justify-center">
                  <a
                    href={video.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-4"
                  >
                    <Youtube className="w-20 h-20 text-primary/40" />
                    <Button className="bg-primary text-white">Watch on External Platform</Button>
                  </a>
                </div>
              )}
            </div>
          </AnimatedSection>

          {/* Video Description */}
          <AnimatedSection direction="up" delay={0.15}>
            <div className="prose prose-lg dark:prose-invert max-w-none text-foreground">
              <h2 className="text-2xl sm:text-3xl font-black mt-12 mb-5 tracking-tight text-foreground">About this video</h2>
              <p className="mb-5 leading-[1.85] text-muted-foreground text-base whitespace-pre-wrap">
                {video.description}
              </p>
            </div>
          </AnimatedSection>

          {/* Back to Videos CTA */}
          <AnimatedSection direction="up" delay={0.2}>
            <div className="mt-16 pt-10 border-t border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Continue exploring</p>
                <p className="text-lg font-bold text-foreground">Watch More Videos</p>
              </div>
              <Button
                asChild
                className="rounded-2xl px-8 py-3 h-auto bg-primary text-white hover:bg-primary/90 font-bold text-sm uppercase tracking-widest group"
              >
                <Link href="/video" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to All Videos
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}