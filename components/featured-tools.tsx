"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ImageIcon, Compass as Compress, ArrowRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"

const featuredTools = [
  {
    id: "pdf-word",
    title: "PDF ↔ Word Converter",
    description: "Convert PDF to Word and Word to PDF instantly. Maintain formatting and layout.",
    icon: FileText,
    color: "text-primary",
    bgColor: "bg-primary/10",
    hoverBg: "hover:bg-primary/20",
    url: "/pdf-to-word",
  },
  {
    id: "jpg-png",
    title: "JPG ↔ PNG Converter",
    description: "Convert between JPG and PNG formats. Perfect for web optimization.",
    icon: ImageIcon,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    hoverBg: "hover:bg-secondary/20",
    url: "/jpg-to-png",
  },
  {
    id: "compress-pdf",
    title: "Compress PDF",
    description: "Reduce PDF file size without losing quality. Perfect for sharing.",
    icon: Compress,
    color: "text-primary",
    bgColor: "bg-primary/10",
    hoverBg: "hover:bg-primary/20",
    url: "/compress-pdf",
  },
]

export function FeaturedTools() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false])
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers = cardRefs.current.map((ref, index) => {
      if (!ref) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleCards((prev) => {
                const newVisible = [...prev]
                newVisible[index] = true
                return newVisible
              })
            }, index * 200) // Stagger animation
          }
        },
        { threshold: 0.1 },
      )

      observer.observe(ref)
      return observer
    })

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [])

  return (
    <section id="featured" className="py-20 bg-gradient-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4 border border-secondary/20">
            <span className="animate-pulse">🔥</span>
            Featured Tools
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Most Popular File Tools</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Get started with our most-used conversion tools. Fast, reliable, and completely free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {featuredTools.map((tool, index) => {
            const Icon = tool.icon
            return (
              <div
                key={tool.id}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`transform transition-all duration-700 ${
                  visibleCards[index] ? "translate-y-0 opacity-100 blur-0" : "translate-y-8 opacity-0 blur-sm"
                }`}
              >
                <Card className="group hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-primary/10 bg-card/80 backdrop-blur-sm w-auto">
                  <CardHeader className="text-center pb-4 w-auto">
                    <div
                      className={`mx-auto h-16 w-16 rounded-2xl ${tool.bgColor} ${tool.hoverBg} flex items-center justify-center mb-4 transition-colors group-hover:scale-110 transform duration-300`}
                    >
                      <Icon className={`h-8 w-8 ${tool.color}`} />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors w-auto">
                      {tool.title}
                    </CardTitle>
                    <CardDescription className="text-base">{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Link href={tool.url}>
                      <Button
                        className="w-full group-hover:bg-gradient-primary group-hover:text-white group-hover:border-primary transition-all duration-300 bg-transparent border-primary/30 text-primary hover:text-white"
                        variant="outline"
                      >
                        Try Now
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <Button
            size="lg"
            variant="outline"
            className="hover:bg-gradient-primary hover:text-white bg-transparent border-primary text-primary"
          >
            View All Tools
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
