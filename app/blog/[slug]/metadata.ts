import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meridians.edu.pk";

interface BlogPost {
  title: string;
  excerpt?: string;
  imageUrl?: string;
  category?: string;
  author?: string;
  publishedAt?: string;
  tags?: string[];
  slug: string;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || siteUrl;
    const res = await fetch(`${apiBase}/api/blog/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Article Not Found",
      description: "This blog article could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const canonicalUrl = `${siteUrl}/blog/${post.slug}`;
  const ogImage = post.imageUrl || "/logo.jpg";

  return {
    title: post.title,
    description:
      post.excerpt ||
      `Read "${post.title}" — an article from Meridian's Group of Education.`,
    keywords: [
      ...(post.tags ?? []),
      post.category ?? "",
      "Meridians school blog",
      "education articles Pakistan",
      "school news Pakistan",
    ].filter(Boolean),
    authors: post.author ? [{ name: post.author }] : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description:
        post.excerpt ||
        `Read "${post.title}" — an article from Meridian's Group of Education.`,
      url: canonicalUrl,
      siteName: "Meridian's Group of Education",
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
      section: post.category,
      tags: post.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description:
        post.excerpt ||
        `Read "${post.title}" on Meridian's Group of Education blog.`,
      images: [ogImage],
    },
  };
}
