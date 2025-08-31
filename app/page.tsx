import { Header } from "@/components/header"
import { LazyHeroSection } from "@/components/performance/lazy-components"
import { FeaturedTools } from "@/components/featured-tools"
import { ToolCategories } from "@/components/tool-categories"
import { Footer } from "@/components/footer"
import { ErrorBoundary } from "@/components/error-boundary"
import { StructuredData } from "@/components/seo/structured-data"
import { Analytics } from "@/components/seo/analytics"
import { generateStructuredData } from "@/lib/seo"
import { Suspense } from "react"

export default function HomePage() {
  const structuredData = generateStructuredData("WebApplication", {
    name: "FileTools - All-in-one File Tools",
    description:
      "Convert, compress & manage files in seconds. PDF, Image, Office tools and more. 100% secure, browser-based processing.",
    featureList: [
      "PDF to Word Conversion",
      "Image Format Conversion",
      "PDF Compression",
      "Office Document Conversion",
      "Secure Browser-based Processing",
      "No File Upload Required",
    ],
    screenshot: `${process.env.NEXT_PUBLIC_SITE_URL}/images/screenshot.png`,
    softwareVersion: "1.0.0",
    datePublished: "2024-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    author: {
      "@type": "Organization",
      name: "FileTools",
      url: process.env.NEXT_PUBLIC_SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "FileTools",
      url: process.env.NEXT_PUBLIC_SITE_URL,
    },
  })

  return (
    <>
      <StructuredData data={structuredData} />
      <Analytics googleAnalyticsId={process.env.NEXT_PUBLIC_GA_ID} />

      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <ErrorBoundary>
            <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20" />}>
              <LazyHeroSection />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary>
            <FeaturedTools />
          </ErrorBoundary>

          <ErrorBoundary>
            <ToolCategories />
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </>
  )
}
