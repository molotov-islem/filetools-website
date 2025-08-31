"use client"

import React from "react"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export const LazyToolPage = dynamic(() => import("@/components/tool-page").then((mod) => ({ default: mod.ToolPage })), {
  loading: () => <ToolPageSkeleton />,
  ssr: false,
})

export const LazyHeroSection = dynamic(
  () => import("@/components/hero-section").then((mod) => ({ default: mod.HeroSection })),
  {
    loading: () => <HeroSkeleton />,
    ssr: false,
  },
)

function ToolPageSkeleton() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <Skeleton className="h-16 w-16 rounded-2xl mx-auto mb-6" />
          <Skeleton className="h-10 w-96 mx-auto mb-4" />
          <Skeleton className="h-6 w-[500px] mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-80" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full rounded-lg" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-20" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function HeroSkeleton() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <Skeleton className="h-16 w-[600px] mx-auto mb-6" />
          <Skeleton className="h-8 w-[400px] mx-auto mb-12" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Skeleton className="h-14 w-48" />
            <Skeleton className="h-14 w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <Skeleton className="h-12 w-12 rounded-full mb-4" />
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function useIntersectionObserver(elementRef: React.RefObject<Element>, options: IntersectionObserverInit = {}) {
  const [isIntersecting, setIsIntersecting] = React.useState(false)

  React.useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
        ...options,
      },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [elementRef, options])

  return isIntersecting
}
