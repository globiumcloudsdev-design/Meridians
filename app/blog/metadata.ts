import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meridians.edu.pk";

export const metadata: Metadata = {
  title: "Blog | Education News, Events & Stories",
  description:
    "Read the latest news, school events, student achievements, educational articles, and announcements from Meridian's Group of Education — Pakistan's premier school.",
  keywords: [
    "Meridians school blog",
    "education news Pakistan",
    "school events Pakistan",
    "student achievements Pakistan",
    "school announcements",
    "educational articles Pakistan",
    "Meridians news updates",
    "school stories Pakistan",
  ],
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: "Blog | Meridian's Group of Education",
    description:
      "Stay updated with the latest news, events, and student achievements from Meridian's Group of Education.",
    url: `${siteUrl}/blog`,
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Meridian's Education Blog",
      },
    ],
  },
  twitter: {
    title: "Blog | Meridian's Group of Education",
    description:
      "Latest news, events, and student stories from Pakistan's premier school.",
    images: ["/logo.jpg"],
  },
};
