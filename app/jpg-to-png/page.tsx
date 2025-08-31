import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ToolPage } from "@/components/tool-page"
import { StructuredData } from "@/components/seo/structured-data"
import { Breadcrumbs } from "@/components/seo/structured-data"
import { generateStructuredData, generateFAQStructuredData, generateBreadcrumbStructuredData } from "@/lib/seo"
import { ImageIcon } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "JPG to PNG Converter - Free Image Converter | FileTools",
  description:
    "Convert JPG to PNG images online. Preserve quality, support transparency. Fast, free, and secure image conversion in your browser.",
  keywords:
    "JPG to PNG, image converter, photo converter, PNG converter, free image tools, JPEG to PNG, online image converter",
  openGraph: {
    title: "JPG to PNG Converter - Free Image Converter",
    description: "Convert JPG to PNG images online. Preserve quality, support transparency. Fast, free, and secure.",
    type: "website",
    url: "/jpg-to-png",
  },
  twitter: {
    card: "summary_large_image",
    title: "JPG to PNG Converter - Free Image Converter",
    description: "Convert JPG to PNG images online. Preserve quality, support transparency. Fast, free, and secure.",
  },
  alternates: {
    canonical: "/jpg-to-png",
  },
}

export default function JPGToPNGPage() {
  const toolStructuredData = generateStructuredData("SoftwareApplication", {
    name: "JPG to PNG Converter",
    description:
      "Convert JPG images to PNG format with transparency support, perfect for web graphics and professional design work.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web Browser",
    softwareVersion: "1.0.0",
    featureList: [
      "Supports transparency",
      "Lossless conversion",
      "Batch processing",
      "Maintains image quality",
      "Secure browser-based processing",
    ],
    screenshot: `${process.env.NEXT_PUBLIC_SITE_URL}/images/jpg-to-png-screenshot.png`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  })

  const faqData = generateFAQStructuredData([
    {
      question: "How do I convert JPG to PNG?",
      answer:
        "Simply drag and drop your JPG file or click to select it. Our converter will process it instantly and provide a downloadable PNG image.",
    },
    {
      question: "What's the difference between JPG and PNG?",
      answer:
        "PNG supports transparency and is lossless, making it ideal for graphics with transparent backgrounds. JPG is better for photographs with smaller file sizes.",
    },
    {
      question: "Will converting JPG to PNG improve quality?",
      answer:
        "Converting won't improve the original quality, but PNG format prevents further quality loss and adds transparency support.",
    },
    {
      question: "Can I convert multiple JPG files at once?",
      answer: "Yes, our converter supports batch processing - you can convert up to 5 JPG files to PNG simultaneously.",
    },
  ])

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "Home", url: "/" },
    { name: "Image Tools", url: "/image-tools" },
    { name: "JPG to PNG Converter", url: "/jpg-to-png" },
  ])

  return (
    <>
      <StructuredData data={toolStructuredData} />
      <StructuredData data={faqData} />
      <StructuredData data={breadcrumbData} />

      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <div className="container mx-auto px-4 py-4">
            <Breadcrumbs
              items={[
                { name: "Home", href: "/" },
                { name: "Image Tools", href: "/image-tools" },
                { name: "JPG to PNG Converter", href: "/jpg-to-png" },
              ]}
              className="mb-4"
            />
          </div>

          <ToolPage
            title="JPG to PNG Converter"
            description="Convert JPG images to PNG format with transparency support. Perfect for web graphics and professional design work."
            icon={ImageIcon}
            acceptedFormats={[".jpg", ".jpeg"]}
            outputFormat="PNG Image (.png)"
            toolType="convert"
            features={["Supports transparency", "Lossless conversion", "Batch processing", "Maintains image quality"]}
          />
        </main>
        <Footer />
      </div>
    </>
  )
}
