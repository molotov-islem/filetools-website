import type { Metadata } from "next"

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  noIndex?: boolean
  structuredData?: any
}

export function generateMetadata(config: SEOConfig): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://filetools.app"

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords?.join(", "),
    authors: [{ name: "FileTools" }],
    creator: "FileTools",
    publisher: "FileTools",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: config.canonical || "/",
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url: config.canonical || "/",
      siteName: "FileTools",
      type: "website",
      locale: "en_US",
      images: config.ogImage
        ? [
            {
              url: config.ogImage,
              width: 1200,
              height: 630,
              alt: config.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      images: config.ogImage ? [config.ogImage] : undefined,
    },
    robots: config.noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
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
    other: config.structuredData
      ? {
          "application/ld+json": JSON.stringify(config.structuredData),
        }
      : undefined,
  }
}

export const toolPageSEO = {
  "pdf-to-word": {
    title: "PDF to Word Converter - Free Online Tool | FileTools",
    description:
      "Convert PDF to Word documents instantly. Maintain formatting, fonts, and layout. 100% free, secure, and works in your browser.",
    keywords: ["PDF to Word", "PDF converter", "Word converter", "document conversion", "free PDF tools"],
    canonical: "/pdf-to-word",
  },
  "jpg-to-png": {
    title: "JPG to PNG Converter - Free Image Converter | FileTools",
    description:
      "Convert JPG to PNG images online. Preserve quality, support transparency. Fast, free, and secure image conversion.",
    keywords: ["JPG to PNG", "image converter", "photo converter", "PNG converter", "free image tools"],
    canonical: "/jpg-to-png",
  },
  "compress-pdf": {
    title: "Compress PDF - Reduce PDF File Size Online | FileTools",
    description:
      "Compress PDF files to reduce size without losing quality. Free online PDF compressor. Works in your browser.",
    keywords: ["compress PDF", "reduce PDF size", "PDF compressor", "optimize PDF", "free PDF tools"],
    canonical: "/compress-pdf",
  },
} as const

export function generateStructuredData(type: "WebSite" | "WebApplication" | "SoftwareApplication", data: any) {
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": type,
    name: "FileTools",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://filetools.app",
    description: "All-in-one file conversion and compression tools. Fast, free, and secure.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
      bestRating: "5",
      worstRating: "1",
    },
    ...data,
  }

  return baseStructuredData
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
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
  }
}
