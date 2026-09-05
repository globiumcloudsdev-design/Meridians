import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meridians.edu.pk";

export const metadata: Metadata = {
  title: "Contact Us | Get in Touch with Meridian's",
  description:
    "Contact Meridian's Group of Education for admissions inquiries, general information, or support. Reach us by phone, email, or visit our campus. We're happy to help.",
  keywords: [
    "contact Meridians school",
    "Meridians Group of Education contact",
    "school contact Pakistan",
    "school phone number Pakistan",
    "school address Pakistan",
    "school admission inquiry",
    "Meridians email",
    "school helpline Pakistan",
  ],
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: "Contact Us | Meridian's Group of Education",
    description:
      "Get in touch with Meridian's Group of Education. Reach us for admissions, support, or general inquiries — by phone, email, or in person.",
    url: `${siteUrl}/contact`,
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Meridian's Group of Education",
      },
    ],
  },
  twitter: {
    title: "Contact Us | Meridian's Group of Education",
    description:
      "Reach out to Meridian's for admissions or general inquiries. We're here to help.",
    images: ["/logo.jpg"],
  },
};
