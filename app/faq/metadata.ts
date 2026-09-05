import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meridians.edu.pk";

export const metadata: Metadata = {
  title: "FAQ | Frequently Asked Questions",
  description:
    "Find answers to the most common questions about Meridian's Group of Education — admissions, programs, campus facilities, fees, Quran education, co-curricular activities, and more.",
  keywords: [
    "Meridians school FAQ",
    "school frequently asked questions Pakistan",
    "school admission questions",
    "school fees Pakistan",
    "Meridians school programs FAQ",
    "school enrollment questions",
    "Meridians help center",
    "school information Pakistan",
  ],
  alternates: {
    canonical: `${siteUrl}/faq`,
  },
  openGraph: {
    title: "FAQ | Meridian's Group of Education",
    description:
      "Get answers to your questions about Meridian's admissions, programs, campus life, and more.",
    url: `${siteUrl}/faq`,
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Meridian's FAQ",
      },
    ],
  },
  twitter: {
    title: "FAQ | Meridian's Group of Education",
    description:
      "Common questions about Meridian's admissions, programs, fees, and campus life answered.",
    images: ["/logo.jpg"],
  },
};
