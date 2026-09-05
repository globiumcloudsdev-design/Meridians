import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meridians.edu.pk";

export const metadata: Metadata = {
  title: "Library | Digital Resources & Study Materials",
  description:
    "Access Meridian's digital library — explore e-books, study guides, reference materials, and educational resources for students of all levels.",
  keywords: [
    "Meridians school library",
    "digital library Pakistan",
    "school study materials",
    "school e-books Pakistan",
    "educational resources Pakistan",
    "student library resources",
    "Meridians learning resources",
    "school reference materials",
  ],
  alternates: {
    canonical: `${siteUrl}/library`,
  },
  openGraph: {
    title: "Library | Meridian's Group of Education",
    description:
      "Access Meridian's digital library — e-books, study guides, and educational resources for all students.",
    url: `${siteUrl}/library`,
    images: [
      {
        url: "/library.png",
        width: 1200,
        height: 630,
        alt: "Meridian's Digital Library",
      },
    ],
  },
  twitter: {
    title: "Library | Meridian's Group of Education",
    description:
      "Explore Meridian's digital library with e-books, study guides and learning resources.",
    images: ["/library.png"],
  },
};
