import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meridians.edu.pk";

export const metadata: Metadata = {
  title: "Home | Best School in Pakistan",
  description:
    "Welcome to Meridian's Group of Education — Pakistan's premier school offering world-class education from primary to higher secondary level. Explore our STEM programs, campus facilities, admissions, and more.",
  keywords: [
    "Meridians Group of Education",
    "best school in Pakistan",
    "school homepage",
    "private school admissions",
    "STEM education Pakistan",
    "quality school Pakistan",
    "Meridians school homepage",
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Meridian's Group of Education | Best School in Pakistan",
    description:
      "Pakistan's premier school offering world-class education. STEM programs, Quran studies, modern campus facilities, and top academic results. Admissions open now.",
    url: siteUrl,
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Meridian's Group of Education — Best School in Pakistan",
      },
    ],
  },
  twitter: {
    title: "Meridian's Group of Education | Best School in Pakistan",
    description:
      "Pakistan's premier school with STEM programs, Quran studies & co-curricular excellence. Admissions open now.",
    images: ["/logo.jpg"],
  },
};
