import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meridians.edu.pk";

export const metadata: Metadata = {
  title: "Academic Programs | Primary, Secondary & Higher Secondary",
  description:
    "Explore Meridian's Group of Education's comprehensive academic programs — from Pre-Primary and Primary to O-Level and A-Level equivalent higher secondary education. STEM, arts, sciences, and Quran integrated curriculum.",
  keywords: [
    "school academic programs Pakistan",
    "primary school program Pakistan",
    "secondary school program Pakistan",
    "higher secondary program Pakistan",
    "O level school Pakistan",
    "A level school Pakistan",
    "STEM curriculum Pakistan",
    "Meridians school curriculum",
    "school subjects Pakistan",
    "science arts commerce school Pakistan",
    "integrated Quran curriculum",
    "school learning programs",
  ],
  alternates: {
    canonical: `${siteUrl}/programs`,
  },
  openGraph: {
    title: "Academic Programs | Meridian's Group of Education",
    description:
      "From Pre-Primary to Higher Secondary — Meridian's offers a rich, STEM-integrated curriculum designed to inspire critical thinking and academic excellence.",
    url: `${siteUrl}/programs`,
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Meridian's Academic Programs",
      },
    ],
  },
  twitter: {
    title: "Academic Programs | Meridian's Group of Education",
    description:
      "Primary, secondary & higher secondary programs with STEM focus and Quran integration at Meridian's — Pakistan's best school.",
    images: ["/logo.jpg"],
  },
};
