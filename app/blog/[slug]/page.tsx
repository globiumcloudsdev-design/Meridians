'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Markdown from 'react-markdown';
import { ArrowLeft, Calendar, User, Clock, Tag, Share2, BookOpen, ChevronRight } from 'lucide-react';
import type { BlogPost } from '@/lib/types';
import { API_BLOG_BY_SLUG } from '@/lib/api/endpoints';
import { AnimatedSection } from '@/components/AnimatedSection';
import { motion } from 'framer-motion';

function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    })();
  }, [params]);

  useEffect(() => {
    if (slug) {
      fetchBlogPost(slug);
    }
  }, [slug]);

  const fetchBlogPost = async (slug: string) => {
    try {
      const response = await fetch(API_BLOG_BY_SLUG(slug));
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      } else {
        toast.error('Blog post not found');
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      toast.error('Error loading blog post');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground font-bold tracking-widest uppercase text-xs">
            Loading article...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-32">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto">
              <BookOpen className="w-10 h-10 text-primary/40" />
            </div>
            <h2 className="text-3xl font-black text-foreground">Article Not Found</h2>
            <p className="text-muted-foreground max-w-md">
              The article you&apos;re looking for doesn&apos;t exist or may have been removed.
            </p>
            <Button asChild className="rounded-2xl px-8 py-3 h-auto bg-primary text-white hover:bg-primary/90 font-bold">
              <Link href="/blog">← Back to Blog</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const readingTime = estimateReadingTime(post.content);

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
          className="absolute inset-0 z-0"
        >
          {post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20" />
          )}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </motion.div>

        {/* Hero Content */}
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
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white/80 truncate max-w-[200px]">{post.title}</span>
            </motion.div>

            {/* Category Badge */}
            {post.category && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-black uppercase tracking-[0.3em] mb-6 backdrop-blur-md">
                  {post.category}
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
              {post.title}
            </motion.h1>

            {/* Excerpt */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="text-lg md:text-xl text-white/75 font-medium leading-relaxed max-w-3xl drop-shadow-lg"
            >
              {post.excerpt}
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
                  {/* Author */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Author</p>
                      <p className="text-sm font-bold text-foreground">{post.author}</p>
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="hidden sm:block w-px h-10 bg-primary/10" />

                  {/* Date */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Published</p>
                      <p className="text-sm font-bold text-foreground">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="hidden sm:block w-px h-10 bg-primary/10" />

                  {/* Reading Time */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Read Time</p>
                      <p className="text-sm font-bold text-foreground">{readingTime} min read</p>
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

      {/* ── Blog Content ── */}
      <section className="py-16 sm:py-20 bg-background relative">
        {/* Decorative background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Post Content */}
          <AnimatedSection direction="up" delay={0.1}>
            <div className="prose prose-lg dark:prose-invert max-w-none text-foreground
              [&>*]:text-foreground
            ">
              <Markdown
                components={{
                  h1: ({ ...props }) => (
                    <h1 className="text-3xl sm:text-4xl font-black mt-12 mb-5 tracking-tight text-foreground" {...props} />
                  ),
                  h2: ({ ...props }) => (
                    <h2 className="text-2xl sm:text-3xl font-black mt-10 mb-4 tracking-tight text-foreground flex items-center gap-3" {...props} />
                  ),
                  h3: ({ ...props }) => (
                    <h3 className="text-xl sm:text-2xl font-bold mt-8 mb-3 text-foreground" {...props} />
                  ),
                  p: ({ ...props }) => (
                    <p className="mb-5 leading-[1.85] text-muted-foreground text-base" {...props} />
                  ),
                  ul: ({ ...props }) => (
                    <ul className="mb-6 space-y-3 pl-0" {...props} />
                  ),
                  ol: ({ ...props }) => (
                    <ol className="list-decimal mb-6 space-y-3 pl-6" {...props} />
                  ),
                  li: ({ ...props }) => (
                    <li className="flex items-start gap-2 text-muted-foreground leading-relaxed" {...props} />
                  ),
                  blockquote: ({ ...props }) => (
                    <blockquote
                      className="relative my-8 p-6 sm:p-8 rounded-[24px] bg-primary/5 border-l-4 border-primary/30 text-foreground not-italic"
                      {...props}
                    />
                  ),
                  code: ({ ...props }) => (
                    <code className="bg-primary/5 text-primary px-2.5 py-1 rounded-lg font-mono text-sm border border-primary/10" {...props} />
                  ),
                  pre: ({ ...props }) => (
                    <pre className="bg-foreground/5 rounded-[20px] p-6 overflow-x-auto my-6 border border-border" {...props} />
                  ),
                  a: ({ ...props }) => (
                    <a className="text-primary font-bold underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-colors" {...props} />
                  ),
                  hr: () => (
                    <div className="my-12 flex items-center justify-center gap-3">
                      <div className="h-1 w-12 bg-primary/20 rounded-full" />
                      <div className="h-1 w-4 bg-primary/40 rounded-full" />
                      <div className="h-1 w-12 bg-primary/20 rounded-full" />
                    </div>
                  ),
                  img: ({ src, alt, ...props }) => (
                    <span className="block my-8 rounded-[24px] overflow-hidden border border-primary/10 shadow-xl shadow-primary/5">
                      <img src={src} alt={alt || ''} className="w-full h-auto object-cover" {...props} />
                    </span>
                  ),
                  strong: ({ ...props }) => (
                    <strong className="font-black text-foreground" {...props} />
                  ),
                }}
              >
                {post.content}
              </Markdown>
            </div>
          </AnimatedSection>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <AnimatedSection direction="up" delay={0.15}>
              <div className="mt-12 pt-10 border-t border-primary/10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Tag className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-black text-foreground uppercase tracking-widest text-xs">Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 rounded-2xl bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider hover:bg-primary/10 transition-colors cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* Back to Blog CTA */}
          <AnimatedSection direction="up" delay={0.2}>
            <div className="mt-16 pt-10 border-t border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Continue exploring</p>
                <p className="text-lg font-bold text-foreground">Read More Articles</p>
              </div>
              <Button
                asChild
                className="rounded-2xl px-8 py-3 h-auto bg-primary text-white hover:bg-primary/90 font-bold text-sm uppercase tracking-widest group"
              >
                <Link href="/blog" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to All Articles
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
