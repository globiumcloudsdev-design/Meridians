import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meridians.edu.pk";

export const metadata: Metadata = {
  title: "Admission Form | Apply Online Today",
  description:
    "Submit your admission application to Meridian's Group of Education online. Fill out the form with student details, select your preferred class, and take the first step toward academic excellence.",
  keywords: [
    "school admission form Pakistan",
    "apply online school Pakistan",
    "Meridians admission form",
    "school application form Pakistan",
    "enroll school Pakistan online",
    "school registration form",
    "online school admission Pakistan",
  ],
  alternates: {
    canonical: `${siteUrl}/admission-form`,
  },
  openGraph: {
    title: "Admission Form | Meridian's Group of Education",
    description:
      "Apply online for admission to Meridian's Group of Education. Complete the form today and secure your child's future.",
    url: `${siteUrl}/admission-form`,
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Meridian's Admission Form",
      },
    ],
  },
  twitter: {
    title: "Admission Form | Meridian's Group of Education",
    description:
      "Apply online for school admission. Fill the form and secure your child's future at Meridian's.",
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};
