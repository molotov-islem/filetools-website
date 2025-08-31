import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ToolPage } from "@/components/tool-page"
import { StructuredData } from "@/components/seo/structured-data"
import { Breadcrumbs } from "@/components/seo/structured-data"
import { generateStructuredData, generateFAQStructuredData, generateBreadcrumbStructuredData } from "@/lib/seo"
import { FileText } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "PDF to Word Converter - Free Online Tool | FileTools",
  description:
    "Convert PDF to Word documents instantly. Maintain formatting, fonts, and layout. 100% free, secure, and works in your browser. No registration required.",
  keywords:
    "PDF to Word, PDF converter, Word converter, document conversion, free PDF tools, PDF to DOCX, online converter",
  openGraph: {
    title: "PDF to Word Converter - Free Online Tool",
    description:
      "Convert PDF to Word documents instantly. Maintain formatting, fonts, and layout. 100% free and secure.",
    type: "website",
    url: "/pdf-to-word",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF to Word Converter - Free Online Tool",
    description:
      "Convert PDF to Word documents instantly. Maintain formatting, fonts, and layout. 100% free and secure.",
  },
  alternates: {
    canonical: "/pdf-to-word",
  },
}

export default function PDFToWordPage() {
  const toolStructuredData = generateStructuredData("SoftwareApplication", {
    name: "PDF to Word Converter",
    description: "Convert PDF files to editable Word documents while maintaining formatting, images, and layout.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web Browser",
    softwareVersion: "1.0.0",
    featureList: [
      "Preserves original formatting",
      "Maintains images and tables",
      "Fast conversion process",
      "No file size limits",
      "Secure browser-based processing",
    ],
    screenshot: `${process.env.NEXT_PUBLIC_SITE_URL}/images/pdf-to-word-screenshot.png`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  })

  const faqData = generateFAQStructuredData([
    {
      question: "How do I convert PDF to Word?",
      answer:
        "Simply drag and drop your PDF file or click to select it. Our converter will process it instantly and provide a downloadable Word document.",
    },
    {
      question: "Is the PDF to Word conversion free?",
      answer: "Yes, our PDF to Word converter is completely free with no limits on file size or number of conversions.",
    },
    {
      question: "Will my PDF formatting be preserved?",
      answer:
        "Yes, our advanced conversion technology maintains original formatting, fonts, images, and layout structure.",
    },
    {
      question: "Is it safe to convert PDFs online?",
      answer:
        "Absolutely. All conversions happen in your browser - no files are uploaded to our servers, ensuring complete privacy and security.",
    },
  ])

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "Home", url: "/" },
    { name: "PDF Tools", url: "/pdf-tools" },
    { name: "PDF to Word Converter", url: "/pdf-to-word" },
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
                { name: "PDF to Word Converter", href: "/pdf-to-word" },
              ]}
              className="mb-4"
            />
          </div>

          <ToolPage
            title="PDF to Word Converter"
            description="Convert your PDF files to editable Word documents instantly. Maintain formatting, images, and layout with our advanced conversion technology."
            icon={FileText}
            acceptedFormats={[".pdf"]}
            outputFormat="Word Document (.docx)"
            toolType="convert"
            features={[
              "Preserves original formatting",
              "Maintains images and tables",
              "Fast conversion process",
              "No file size limits",
            ]}
          />
        </main>
        <Footer />
      </div>
    </>
  )
}
