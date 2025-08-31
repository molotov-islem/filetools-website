"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/components/ui/accessibility"

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "fade"
  threshold?: number
}

export function ScrollReveal({ children, className, delay = 0, direction = "up", threshold = 0.1 }: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), prefersReducedMotion ? 0 : delay)
        }
      },
      { threshold },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay, threshold, prefersReducedMotion])

  const getTransformClasses = () => {
    if (prefersReducedMotion) {
      return "opacity-100"
    }

    const base = "transition-all duration-700 ease-out"

    if (isVisible) {
      return `${base} translate-x-0 translate-y-0 opacity-100 blur-0 scale-100`
    }

    switch (direction) {
      case "up":
        return `${base} translate-y-8 opacity-0 blur-sm`
      case "down":
        return `${base} -translate-y-8 opacity-0 blur-sm`
      case "left":
        return `${base} translate-x-8 opacity-0 blur-sm`
      case "right":
        return `${base} -translate-x-8 opacity-0 blur-sm`
      case "fade":
        return `${base} opacity-0 scale-95`
      default:
        return `${base} translate-y-8 opacity-0 blur-sm`
    }
  }

  return (
    <div ref={ref} className={cn(getTransformClasses(), className)} aria-hidden={!isVisible}>
      {children}
    </div>
  )
}
