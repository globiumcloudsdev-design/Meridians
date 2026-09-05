import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meridians.edu.pk";

export const metadata: Metadata = {
  title: "Admissions | Enroll Your Child Today",
  description:
    "Apply for admission to Meridian's Group of Education. Learn about eligibility criteria, required documents, entrance assessment, and the step-by-step enrollment process for the 2026–2027 academic session.",
  keywords: [
    "school admissions Pakistan",
    "Meridians school enrollment",
    "school admission 2026",
    "school admission form Pakistan",
    "enroll child school Pakistan",
    "school admission criteria",
    "primary school enrollment Pakistan",
    "secondary school admission Pakistan",
    "school admission process",
    "Meridians admission requirements",
  ],
  alternates: {
    canonical: `${siteUrl}/admissions`,
  },
  openGraph: {
    title: "Admissions | Meridian's Group of Education",
    description:
      "Apply now for the 2026–2027 academic session at Meridian's. Simple enrollment process, competitive entrance assessment, and a nurturing campus environment.",
    url: `${siteUrl}/admissions`,
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Meridian's School Admissions",
      },
    ],
  },
  twitter: {
    title: "Admissions Open | Meridian's Group of Education",
    description:
      "Enroll your child at Pakistan's premier school. Learn about eligibility, documents, and the admission process.",
    images: ["/logo.jpg"],
  },
};
