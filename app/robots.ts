import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meridians.edu.pk";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/admin/",
          "/api/",
          "/admin/login",
          "/admin/dashboard",
          "/admin/blog",
          "/admin/admission-queries",
          "/admin/contact-messages",
          "/admin/subscribers",
          "/admin/timeline",
          "/admin/upload-video",
          "/admin/library",
          "/admin/notes",
          "/admin/classes",
          "/admin/tests",
          "/admin/posters",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
