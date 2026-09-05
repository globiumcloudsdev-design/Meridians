import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meridians.edu.pk";

export const metadata: Metadata = {
  title: "Videos | Educational & Campus Videos",
  description:
    "Watch educational videos, campus tours, student performances, and school event recordings from Meridian's Group of Education — Pakistan's premier school.",
  keywords: [
    "Meridians school videos",
    "educational videos Pakistan",
    "school campus tour video",
    "student performance videos",
    "school event video Pakistan",
    "Meridians video gallery",
    "learning videos school Pakistan",
  ],
  alternates: {
    canonical: `${siteUrl}/video`,
  },
  openGraph: {
    title: "Videos | Meridian's Group of Education",
    description:
      "Watch campus tours, educational content, student performances and school events from Meridian's Group of Education.",
    url: `${siteUrl}/video`,
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Meridian's School Videos",
      },
    ],
  },
  twitter: {
    title: "Videos | Meridian's Group of Education",
    description:
      "Educational videos, campus tours and school events from Pakistan's premier school.",
    images: ["/logo.jpg"],
  },
};