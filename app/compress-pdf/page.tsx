import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ToolPage } from "@/components/tool-page"
import { StructuredData } from "@/components/seo/structured-data"
import { Breadcrumbs } from "@/components/seo/structured-data"
import { generateStructuredData, generateFAQStructuredData, generateBreadcrumbStructuredData } from "@/lib/seo"
import { Compass as Compress } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Compress PDF - Reduce PDF File Size Online | FileTools",
  description:
    "Compress PDF files to reduce size without losing quality. Free online PDF compressor. Perfect for email attachments and web sharing.",
  keywords:
    "compress PDF, reduce PDF size, PDF compressor, optimize PDF, free PDF tools, PDF file size reducer, online PDF compression",
  openGraph: {
    title: "Compress PDF - Reduce PDF File Size Online",
    description: "Compress PDF files to reduce size without losing quality. Free online PDF compressor.",
    type: "website",
    url: "/compress-pdf",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compress PDF - Reduce PDF File Size Online",
    description: "Compress PDF files to reduce size without losing quality. Free online PDF compressor.",
  },
  alternates: {
    canonical: "/compress-pdf",
  },
}

export default function CompressPDFPage() {
  const toolStructuredData = generateStructuredData("SoftwareApplication", {
    name: "PDF Compressor",
    description:
      "Reduce PDF file size without losing quality, perfect for email attachments and web sharing while maintaining document integrity.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web Browser",
    softwareVersion: "1.0.0",
    featureList: [
      "Reduces file size up to 90%",
      "Maintains document quality",
      "Fast compression",
      "Secure processing",
      "No file upload required",
    ],
    screenshot: `${process.env.NEXT_PUBLIC_SITE_URL}/images/compress-pdf-screenshot.png`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  })

  const faqData = generateFAQStructuredData([
    {
      question: "How much can I compress a PDF file?",
      answer:
        "Our PDF compressor can reduce file size by up to 90% while maintaining document quality and readability.",
    },
    {
      question: "Will compressing affect PDF quality?",
      answer:
        "Our smart compression algorithm maintains document quality while significantly reducing file size. Text remains crisp and images stay clear.",
    },
    {
      question: "Is there a file size limit for PDF compression?",
      answer:
        "No, there are no file size limits. You can compress PDFs of any size, and the process happens entirely in your browser.",
    },
    {
      question: "How long does PDF compression take?",
      answer:
        "Compression is typically completed within seconds, depending on the original file size and complexity of the document.",
    },
  ])

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "Home", url: "/" },
    { name: "PDF Tools", url: "/pdf-tools" },
    { name: "Compress PDF", url: "/compress-pdf" },
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
                { name: "PDF Tools", href: "/pdf-tools" },
                { name: "Compress PDF", href: "/compress-pdf" },
              ]}
              className="mb-4"
            />
          </div>

          <ToolPage
            title="Compress PDF"
            description="Reduce PDF file size without losing quality. Perfect for email attachments and web sharing while maintaining document integrity."
            icon={Compress}
            acceptedFormats={[".pdf"]}
            outputFormat="Compressed PDF (.pdf)"
            toolType="compress"
            features={[
              "Reduces file size up to 90%",
              "Maintains document quality",
              "Fast compression",
              "Secure processing",
            ]}
          />
        </main>
        <Footer />
      </div>
    </>
  )
}
