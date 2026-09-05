import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meridians.edu.pk";

export const metadata: Metadata = {
  title: "About Us | Our Mission, Vision & History",
  description:
    "Learn about Meridian's Group of Education — our founding story, mission to deliver excellence, core values, experienced faculty, and our vision for Pakistan's future leaders.",
  keywords: [
    "about Meridians school",
    "Meridians Group of Education history",
    "school mission vision Pakistan",
    "best school faculty Pakistan",
    "educational institution Pakistan",
    "school values Pakistan",
    "Meridians leadership team",
  ],
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: "About Us | Meridian's Group of Education",
    description:
      "Discover the story, mission, and values behind Meridian's Group of Education — Pakistan's premier educational institution dedicated to nurturing future leaders.",
    url: `${siteUrl}/about`,
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "About Meridian's Group of Education",
      },
    ],
  },
  twitter: {
    title: "About Us | Meridian's Group of Education",
    description:
      "Discover the story, mission, and values behind Meridian's Group of Education — Pakistan's premier school.",
    images: ["/logo.jpg"],
  },
};
