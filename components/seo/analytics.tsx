"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { monitoring } from "@/lib/monitoring"

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

interface AnalyticsProps {
  googleAnalyticsId?: string
}

export function Analytics({ googleAnalyticsId }: AnalyticsProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!googleAnalyticsId) return

    // Initialize Google Analytics
    const script1 = document.createElement("script")
    script1.async = true
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`
    document.head.appendChild(script1)

    const script2 = document.createElement("script")
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${googleAnalyticsId}', {
        page_title: document.title,
        page_location: window.location.href,
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false
      });
    `
    document.head.appendChild(script2)

    window.gtag = (...args: any[]) => {
      window.dataLayer?.push(args)
    }

    return () => {
      document.head.removeChild(script1)
      document.head.removeChild(script2)
    }
  }, [googleAnalyticsId])

  useEffect(() => {
    if (!window.gtag) return

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")

    // Track page view
    window.gtag("config", googleAnalyticsId, {
      page_path: url,
      page_title: document.title,
    })

    // Track with our monitoring system
    monitoring.trackUserAction("PageView", "Analytics", {
      path: pathname,
      search: searchParams?.toString(),
      title: document.title,
    })
  }, [pathname, searchParams, googleAnalyticsId])

  return null
}

export function trackEvent(eventName: string, parameters?: Record<string, any>) {
  // Google Analytics
  if (window.gtag) {
    window.gtag("event", eventName, {
      event_category: "engagement",
      event_label: parameters?.label,
      value: parameters?.value,
      ...parameters,
    })
  }

  // Internal monitoring
  monitoring.trackUserAction(eventName, "Analytics", parameters)
}

export function trackFileConversion(
  toolType: string,
  inputFormat: string,
  outputFormat: string,
  fileSize: number,
  success: boolean,
  processingTime?: number,
) {
  const eventData = {
    tool_type: toolType,
    input_format: inputFormat,
    output_format: outputFormat,
    file_size: fileSize,
    success: success,
    processing_time: processingTime,
  }

  trackEvent("file_conversion", eventData)
}

export function trackToolUsage(toolName: string, action: string, metadata?: Record<string, any>) {
  trackEvent("tool_usage", {
    tool_name: toolName,
    action: action,
    ...metadata,
  })
}
