import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meridians.edu.pk";

export const metadata: Metadata = {
  title: "Video | Watch This Educational Video",
  description:
    "Watch educational and campus videos from Meridian's Group of Education. Explore student life, academic programs, and school events through our video content.",
  keywords: [
    "Meridians school video",
    "educational video Pakistan",
    "school video content",
    "Meridians student video",
  ],
  alternates: {
    canonical: `${siteUrl}/video`,
  },
  openGraph: {
    title: "Video | Meridian's Group of Education",
    description:
      "Educational and campus videos from Pakistan's premier school — Meridian's Group of Education.",
    url: `${siteUrl}/video`,
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Meridian's School Video",
      },
    ],
  },
};