"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface SkipLinkProps {
  href: string
  children: React.ReactNode
}

export function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      {children}
    </a>
  )
}

interface LiveRegionProps {
  children: React.ReactNode
  politeness?: "polite" | "assertive" | "off"
  atomic?: boolean
  relevant?: "additions" | "removals" | "text" | "all"
  className?: string
}

export function LiveRegion({
  children,
  politeness = "polite",
  atomic = false,
  relevant = "additions text",
  className,
}: LiveRegionProps) {
  return (
    <div aria-live={politeness} aria-atomic={atomic} aria-relevant={relevant} className={cn("sr-only", className)}>
      {children}
    </div>
  )
}

interface FocusTrapProps {
  children: React.ReactNode
  active: boolean
  className?: string
}

export function FocusTrap({ children, active, className }: FocusTrapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!active || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          e.preventDefault()
        }
      }
    }

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        firstElement?.focus()
      }
    }

    document.addEventListener("keydown", handleTabKey)
    document.addEventListener("keydown", handleEscapeKey)
    firstElement?.focus()

    return () => {
      document.removeEventListener("keydown", handleTabKey)
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [active])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return prefersReducedMotion
}

interface AnnouncementProps {
  message: string
  priority?: "polite" | "assertive"
}

export function useAnnouncement() {
  const announce = React.useCallback(({ message, priority = "polite" }: AnnouncementProps) => {
    const announcement = document.createElement("div")
    announcement.setAttribute("aria-live", priority)
    announcement.setAttribute("aria-atomic", "true")
    announcement.className = "sr-only"
    announcement.textContent = message

    document.body.appendChild(announcement)

    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }, [])

  return announce
}
