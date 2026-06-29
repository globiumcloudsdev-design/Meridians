import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { UserProvider } from "@/lib/context/UserContext";
import { Toaster } from "@/components/ui/sonner";
import PageLoader from "@/components/PageLoader";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meridian's Group of Education",
  description:
    "Meridian's Group of Education - Premier educational institution committed to excellence, innovation, and student success. Explore our programs, admissions, and resources.",
  keywords: ["education", "school", "admissions", "learning", "programs"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased overflow-x-hidden" suppressHydrationWarning>
        <UserProvider>
          <PageLoader />
          {children}
          <Toaster position="top-right" richColors />
        </UserProvider>
        <Analytics />
      </body>
    </html>
  );
}
