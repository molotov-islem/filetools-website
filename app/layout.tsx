import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { FloatingElements } from "@/components/ui/floating-elements"
import { ErrorBoundary } from "@/components/error-boundary"
import { InstallPrompt } from "@/components/pwa/install-prompt"
import { OfflineIndicator } from "@/components/pwa/offline-indicator"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "FileTools - All-in-one File Tools. Fast. Free. Online.",
  description:
    "Convert, Compress & Manage files in seconds. PDF, Image, Office tools and more. 100% secure, browser-based processing.",
  keywords: ["file converter", "PDF converter", "image converter", "compress PDF", "online tools", "file tools"],
  authors: [{ name: "FileTools" }],
  creator: "FileTools",
  publisher: "FileTools",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://filetools.website"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "FileTools - All-in-one File Tools. Fast. Free. Online.",
    description: "Convert, Compress & Manage files in seconds. PDF, Image, Office tools and more.",
    url: "/",
    siteName: "FileTools",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "FileTools - All-in-one File Tools. Fast. Free. Online.",
    description: "Convert, Compress & Manage files in seconds. PDF, Image, Office tools and more.",
  },
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
  generator: "v0.app",
  manifest: "/manifest.json",
  themeColor: "#04afea",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FileTools",
  },
}

export const viewport = {
  themeColor: "#ffffff",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FileTools" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/images/filetools-logo.png" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ErrorBoundary componentName="RootLayout">
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              <FloatingElements />
              {children}
              <InstallPrompt />
              <OfflineIndicator />
            </ThemeProvider>
          </Suspense>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}
