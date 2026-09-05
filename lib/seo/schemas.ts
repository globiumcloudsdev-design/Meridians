/**
 * JSON-LD Structured Data for Meridian's Group of Education.
 * This enables Google Rich Results (Knowledge Panel, Breadcrumbs, FAQs, etc.)
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meridians.edu.pk";

/** Organization schema — helps Google display Knowledge Panel */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Meridian's Group of Education",
  alternateName: "Meridians School",
  url: siteUrl,
  logo: {
    "@type": "ImageObject",
    url: `${siteUrl}/logo.jpg`,
  },
  image: `${siteUrl}/logo.jpg`,
  description:
    "Meridian's Group of Education is Pakistan's premier educational institution offering world-class primary, secondary, and higher secondary education with STEM programs, Quran studies, and co-curricular activities.",
  foundingDate: "2000",
  address: {
    "@type": "PostalAddress",
    addressCountry: "PK",
    addressRegion: "Pakistan",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Admissions",
    url: `${siteUrl}/contact`,
  },
  sameAs: [],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Academic Programs",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Course",
          name: "Pre-Primary Education",
          description: "Early childhood education program at Meridian's.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Course",
          name: "Primary Education",
          description: "Comprehensive primary school curriculum.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Course",
          name: "Secondary Education",
          description: "O-Level equivalent secondary school program.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Course",
          name: "Higher Secondary Education",
          description: "A-Level equivalent higher secondary program.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Course",
          name: "Online Quran Program",
          description:
            "Certified online Quran recitation, Tajweed, and Hifz courses.",
        },
      },
    ],
  },
};

/** WebSite schema — enables Google Sitelinks search box */
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Meridian's Group of Education",
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/blog?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

/** BreadcrumbList schema factory — call on each page */
export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Article schema factory — use on blog post pages */
export function articleSchema(post: {
  title: string;
  excerpt?: string;
  imageUrl?: string;
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
  slug: string;
  tags?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || "",
    image: post.imageUrl || `${siteUrl}/logo.jpg`,
    author: {
      "@type": "Person",
      name: post.author || "Meridian's Group of Education",
    },
    publisher: {
      "@type": "Organization",
      name: "Meridian's Group of Education",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.jpg`,
      },
    },
    datePublished: post.publishedAt || new Date().toISOString(),
    dateModified: post.updatedAt || post.publishedAt || new Date().toISOString(),
    url: `${siteUrl}/blog/${post.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
    keywords: post.tags?.join(", ") || "",
  };
}

/** FAQ schema factory — use on FAQ page */
export function faqSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
