import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meridians.edu.pk";

export const metadata: Metadata = {
  title: "Online Quran | Learn Quran with Tajweed",
  description:
    "Enroll in Meridian's Online Quran program — structured courses with certified teachers covering Quran recitation, Tajweed, Hifz, and Islamic studies for all ages.",
  keywords: [
    "online Quran school Pakistan",
    "learn Quran online Pakistan",
    "Quran with Tajweed Pakistan",
    "Hifz program Pakistan",
    "Islamic education school Pakistan",
    "Meridians Quran program",
    "online Quran classes Pakistan",
    "Quran teacher Pakistan",
    "Islamic studies school Pakistan",
  ],
  alternates: {
    canonical: `${siteUrl}/online-quran`,
  },
  openGraph: {
    title: "Online Quran Program | Meridian's Group of Education",
    description:
      "Learn Quran online with certified teachers at Meridian's — Tajweed, Hifz, and Islamic studies courses for all ages.",
    url: `${siteUrl}/online-quran`,
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Meridian's Online Quran Program",
      },
    ],
  },
  twitter: {
    title: "Online Quran Program | Meridian's Group of Education",
    description:
      "Certified online Quran courses with Tajweed, Hifz, and Islamic studies for all ages.",
    images: ["/logo.jpg"],
  },
};
