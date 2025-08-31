"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileType, ImageIcon, FileSpreadsheet, ArrowRight, Compass as Compress, RefreshCw, Archive } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const toolCategories = [
  {
    id: "pdf-tools",
    title: "PDF Tools",
    description: "Convert and compress PDF files",
    icon: FileType,
    color: "text-primary",
    bgColor: "bg-primary/10",
    hoverBg: "hover:bg-primary/20",
    tools: ["PDF ↔ Word", "PDF ↔ Excel", "PDF ↔ PowerPoint", "Compress PDF"],
  },
  {
    id: "image-tools",
    title: "Image Tools",
    description: "Convert between image formats",
    icon: ImageIcon,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    hoverBg: "hover:bg-secondary/20",
    tools: ["JPG ↔ PNG", "PNG ↔ WebP", "JPG ↔ WebP", "Image Compress"],
  },
  {
    id: "office-tools",
    title: "Office Tools",
    description: "Convert office documents to PDF",
    icon: FileSpreadsheet,
    color: "text-primary",
    bgColor: "bg-primary/10",
    hoverBg: "hover:bg-primary/20",
    tools: ["Word → PDF", "Excel → PDF", "PowerPoint → PDF", "Text → PDF"],
  },
]

export function ToolCategories() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(toolCategories.length).fill(false))
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
            }, index * 150) // Stagger animation
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
    <section id="tools" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            All File Tools by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Choose from our comprehensive collection of file conversion and compression tools, organized by file type.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
          {toolCategories.map((category, index) => {
            const Icon = category.icon
            return (
              <div
                key={category.id}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`transform transition-all duration-700 ${
                  visibleCards[index] ? "translate-y-0 opacity-100 blur-0" : "translate-y-8 opacity-0 blur-sm"
                }`}
              >
                <Card className="group hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full border-border/20">
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`mx-auto h-12 w-12 rounded-xl ${category.bgColor} ${category.hoverBg} flex items-center justify-center mb-3 transition-colors group-hover:scale-110 transform duration-300`}
                    >
                      <Icon className={`h-6 w-6 ${category.color}`} />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {category.title}
                    </CardTitle>
                    <CardDescription className="text-sm">{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 mb-4">
                      {category.tools.map((tool, toolIndex) => (
                        <div
                          key={toolIndex}
                          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-secondary mr-2 flex-shrink-0" />
                          {tool}
                        </div>
                      ))}
                    </div>
                    <Link href={`/${category.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full group-hover:bg-gradient-primary group-hover:text-white group-hover:border-primary transition-all duration-300 bg-transparent border-primary/30 text-primary hover:text-white"
                      >
                        View Tools
                        <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>

        {/* Quick Access Tools */}
        <div className="bg-gradient-secondary/10 rounded-2xl p-8 max-w-4xl mx-auto border border-primary/10">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">Quick Access</h3>
            <p className="text-muted-foreground">Jump straight to our most popular tools</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: "PDF to Word", icon: RefreshCw },
              { name: "Compress PDF", icon: Compress },
              { name: "JPG to PNG", icon: Archive },
            ].map((tool, index) => {
              const Icon = tool.icon
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/10 hover:shadow-sm transition-all duration-200 border border-transparent hover:border-primary/20"
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-center text-foreground">{tool.name}</span>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
