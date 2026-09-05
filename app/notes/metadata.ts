import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meridians.edu.pk";

export const metadata: Metadata = {
  title: "Study Notes | Class Notes & Past Papers",
  description:
    "Download class notes, past papers, and study materials from Meridian's Group of Education. Organized by class and subject for easy access by students.",
  keywords: [
    "school notes Pakistan",
    "class notes download",
    "past papers Pakistan school",
    "study materials school",
    "Meridians notes",
    "student notes Pakistan",
    "school past papers download",
    "free study notes Pakistan",
  ],
  alternates: {
    canonical: `${siteUrl}/notes`,
  },
  openGraph: {
    title: "Study Notes | Meridian's Group of Education",
    description:
      "Download class notes and study materials from Meridian's Group of Education — organized by class and subject.",
    url: `${siteUrl}/notes`,
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Meridian's Study Notes",
      },
    ],
  },
  twitter: {
    title: "Study Notes | Meridian's Group of Education",
    description:
      "Download class notes, past papers and study materials from Pakistan's premier school.",
    images: ["/logo.jpg"],
  },
};
