"use client"

import React from "react"

interface ErrorReport {
  message: string
  stack?: string
  url: string
  userAgent: string
  timestamp: number
  userId?: string
  sessionId: string
  component?: string
  action?: string
  metadata?: Record<string, any>
}

interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  url: string
  sessionId: string
  metadata?: Record<string, any>
}

class MonitoringService {
  private sessionId: string
  private userId?: string
  private isEnabled: boolean

  constructor() {
    this.sessionId = this.generateSessionId()
    this.isEnabled = typeof window !== "undefined" && process.env.NODE_ENV === "production"
    this.setupGlobalErrorHandlers()
    this.setupPerformanceMonitoring()
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private setupGlobalErrorHandlers() {
    if (typeof window === "undefined") return

    // Handle unhandled JavaScript errors
    window.addEventListener("error", (event) => {
      this.reportError({
        message: event.message,
        stack: event.error?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        sessionId: this.sessionId,
        component: "Global",
        action: "UnhandledError",
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      })
    })

    // Handle unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.reportError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        sessionId: this.sessionId,
        component: "Global",
        action: "UnhandledPromiseRejection",
        metadata: {
          reason: event.reason,
        },
      })
    })

    // Handle resource loading errors
    window.addEventListener(
      "error",
      (event) => {
        if (event.target !== window) {
          this.reportError({
            message: `Resource loading error: ${(event.target as any)?.src || (event.target as any)?.href}`,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            component: "ResourceLoader",
            action: "LoadError",
            metadata: {
              resourceUrl: (event.target as any)?.src || (event.target as any)?.href,
              tagName: (event.target as any)?.tagName,
            },
          })
        }
      },
      true,
    )
  }

  private setupPerformanceMonitoring() {
    if (typeof window === "undefined" || !("PerformanceObserver" in window)) return

    // Monitor Core Web Vitals
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "largest-contentful-paint") {
            this.reportPerformance({
              name: "LCP",
              value: entry.startTime,
              timestamp: Date.now(),
              url: window.location.href,
              sessionId: this.sessionId,
            })
          }

          if (entry.entryType === "first-input") {
            this.reportPerformance({
              name: "FID",
              value: (entry as any).processingStart - entry.startTime,
              timestamp: Date.now(),
              url: window.location.href,
              sessionId: this.sessionId,
            })
          }

          if (entry.entryType === "layout-shift" && !(entry as any).hadRecentInput) {
            this.reportPerformance({
              name: "CLS",
              value: (entry as any).value,
              timestamp: Date.now(),
              url: window.location.href,
              sessionId: this.sessionId,
            })
          }
        }
      })

      observer.observe({ entryTypes: ["largest-contentful-paint", "first-input", "layout-shift"] })
    } catch (error) {
      console.warn("[v0] Performance monitoring setup failed:", error)
    }

    // Monitor page load times
    window.addEventListener("load", () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
        if (navigation) {
          this.reportPerformance({
            name: "PageLoad",
            value: navigation.loadEventEnd - navigation.fetchStart,
            timestamp: Date.now(),
            url: window.location.href,
            sessionId: this.sessionId,
            metadata: {
              domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
              firstByte: navigation.responseStart - navigation.fetchStart,
            },
          })
        }
      }, 0)
    })
  }

  reportError(error: ErrorReport) {
    if (!this.isEnabled) {
      console.error("[v0] Error:", error)
      return
    }

    // In production, send to monitoring service
    // For now, log to console with structured format
    console.error("[v0] Error Report:", {
      ...error,
      environment: process.env.NODE_ENV,
      buildId: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    })

    // Could integrate with services like Sentry, LogRocket, etc.
    // Example: Sentry.captureException(new Error(error.message), { extra: error })
  }

  reportPerformance(metric: PerformanceMetric) {
    if (!this.isEnabled) {
      console.log("[v0] Performance:", metric)
      return
    }

    // In production, send to analytics service
    console.log("[v0] Performance Metric:", {
      ...metric,
      environment: process.env.NODE_ENV,
      buildId: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    })
  }

  setUserId(userId: string) {
    this.userId = userId
  }

  trackUserAction(action: string, component: string, metadata?: Record<string, any>) {
    if (!this.isEnabled) {
      console.log("[v0] User Action:", { action, component, metadata })
      return
    }

    console.log("[v0] User Action:", {
      action,
      component,
      metadata,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      url: window.location.href,
    })
  }

  trackFileProcessing(
    toolType: string,
    fileCount: number,
    totalSize: number,
    processingTime: number,
    success: boolean,
    error?: string,
  ) {
    const metric = {
      action: "FileProcessing",
      component: "ToolPage",
      metadata: {
        toolType,
        fileCount,
        totalSize,
        processingTime,
        success,
        error,
        avgFileSize: totalSize / fileCount,
        processingSpeed: totalSize / processingTime, // bytes per ms
      },
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      url: window.location.href,
    }

    if (success) {
      this.reportPerformance({
        name: "FileProcessingTime",
        value: processingTime,
        timestamp: Date.now(),
        url: window.location.href,
        sessionId: this.sessionId,
        metadata: metric.metadata,
      })
    } else {
      this.reportError({
        message: `File processing failed: ${error}`,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        sessionId: this.sessionId,
        component: "ToolPage",
        action: "FileProcessingError",
        metadata: metric.metadata,
      })
    }

    this.trackUserAction("FileProcessing", "ToolPage", metric.metadata)
  }
}

// Singleton instance
export const monitoring = new MonitoringService()

// React hook for component-level error reporting
export function useErrorReporting(componentName: string) {
  const reportError = (error: Error, action?: string, metadata?: Record<string, any>) => {
    monitoring.reportError({
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      sessionId: monitoring["sessionId"],
      component: componentName,
      action,
      metadata,
    })
  }

  const trackAction = (action: string, metadata?: Record<string, any>) => {
    monitoring.trackUserAction(action, componentName, metadata)
  }

  return { reportError, trackAction }
}

// Performance monitoring hook
export function usePerformanceMonitoring(componentName: string) {
  const startTime = React.useRef<number>()

  const startMeasurement = (measurementName: string) => {
    startTime.current = performance.now()
  }

  const endMeasurement = (measurementName: string, metadata?: Record<string, any>) => {
    if (startTime.current) {
      const duration = performance.now() - startTime.current
      monitoring.reportPerformance({
        name: `${componentName}_${measurementName}`,
        value: duration,
        timestamp: Date.now(),
        url: window.location.href,
        sessionId: monitoring["sessionId"],
        metadata: { component: componentName, ...metadata },
      })
    }
  }

  return { startMeasurement, endMeasurement }
}
