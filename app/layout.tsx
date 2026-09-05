import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { UserProvider } from "@/lib/context/UserContext";
import { Toaster } from "@/components/ui/sonner";
import PageLoader from "@/components/PageLoader";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { organizationSchema, websiteSchema } from "@/lib/seo/schemas";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meridians.edu.pk";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Meridian's Group of Education | Best School in Pakistan",
    template: "%s | Meridian's Group of Education",
  },
  description:
    "Meridian's Group of Education — Pakistan's premier school offering world-class primary, secondary, and higher-secondary education with STEM programs, Quran studies, and co-curricular excellence.",
  keywords: [
    "Meridians Group of Education",
    "best school in Pakistan",
    "private school Pakistan",
    "school admissions Pakistan",
    "STEM school Pakistan",
    "primary school Pakistan",
    "secondary school Pakistan",
    "higher secondary school Pakistan",
    "O level school Pakistan",
    "A level school Pakistan",
    "Quran education Pakistan",
    "best private school",
    "school near me Pakistan",
    "quality education Pakistan",
    "school enrollment Pakistan",
    "Meridians school",
    "Meridians admissions",
    "academic excellence Pakistan",
    "co-curricular activities school",
    "online Quran school",
  ],
  authors: [{ name: "Meridian's Group of Education", url: siteUrl }],
  creator: "Meridian's Group of Education",
  publisher: "Meridian's Group of Education",
  category: "Education",
  classification: "Education / School",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: siteUrl,
    siteName: "Meridian's Group of Education",
    title: "Meridian's Group of Education | Best School in Pakistan",
    description:
      "Pakistan's premier educational institution offering excellence in primary, secondary, and higher secondary education. Admissions open — join our community of achievers.",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Meridian's Group of Education",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meridian's Group of Education | Best School in Pakistan",
    description:
      "Pakistan's premier educational institution offering excellence in primary, secondary, and higher secondary education. Admissions open now.",
    images: ["/logo.jpg"],
    creator: "@MeridiansEdu",
    site: "@MeridiansEdu",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/favicon.ico",
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="font-sans antialiased overflow-x-hidden w-full" suppressHydrationWarning>
        <div className="w-full">
          <UserProvider>
            <PageLoader />
            {children}
            <WhatsAppButton />
            <Toaster position="top-right" richColors />
          </UserProvider>
          <Analytics />
        </div>
      </body>
    </html>
  );
}
