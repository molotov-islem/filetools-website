"use client"

import React from "react"
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { monitoring, useErrorReporting } from "@/lib/monitoring"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
  errorId?: string
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void; errorId?: string }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  componentName?: string
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryCount = 0
  private maxRetries = 3

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    return { hasError: true, error, errorId }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo })

    // Generate unique error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    this.setState({ errorId })

    // Report to monitoring service
    monitoring.reportError({
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      sessionId: monitoring["sessionId"],
      component: this.props.componentName || "ErrorBoundary",
      action: "ComponentError",
      metadata: {
        errorId,
        componentStack: errorInfo.componentStack,
        retryCount: this.retryCount,
        props: this.props.componentName ? { componentName: this.props.componentName } : undefined,
      },
    })

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)

    console.error("[v0] Error caught by boundary:", {
      error,
      errorInfo,
      errorId,
      component: this.props.componentName,
    })
  }

  resetError = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++
      this.setState({ hasError: false, error: undefined, errorInfo: undefined, errorId: undefined })

      monitoring.trackUserAction("ErrorRecovery", this.props.componentName || "ErrorBoundary", {
        retryCount: this.retryCount,
        errorId: this.state.errorId,
      })
    } else {
      // Max retries reached, suggest page refresh
      monitoring.trackUserAction("MaxRetriesReached", this.props.componentName || "ErrorBoundary", {
        retryCount: this.retryCount,
        errorId: this.state.errorId,
      })
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} errorId={this.state.errorId} />
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-destructive/20">
            <CardHeader className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-destructive">Something went wrong</CardTitle>
              <CardDescription>
                We encountered an unexpected error.{" "}
                {this.retryCount < this.maxRetries
                  ? "Please try again."
                  : "Please refresh the page or contact support if the problem persists."}
              </CardDescription>
              {this.state.errorId && (
                <p className="text-xs text-muted-foreground mt-2">Error ID: {this.state.errorId}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {this.retryCount < this.maxRetries ? (
                <Button onClick={this.resetError} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again ({this.maxRetries - this.retryCount} attempts left)
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button onClick={() => window.location.reload()} className="w-full" variant="destructive">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Page
                  </Button>
                  <Button onClick={() => (window.location.href = "/")} className="w-full" variant="outline">
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </Button>
                </div>
              )}

              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-muted-foreground flex items-center gap-2">
                    <Bug className="h-4 w-4" />
                    Error Details (Development)
                  </summary>
                  <div className="mt-2 space-y-2">
                    <div>
                      <p className="text-xs font-medium text-destructive">Message:</p>
                      <pre className="text-xs bg-muted p-2 rounded overflow-auto">{this.state.error.message}</pre>
                    </div>
                    {this.state.error.stack && (
                      <div>
                        <p className="text-xs font-medium text-destructive">Stack Trace:</p>
                        <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <p className="text-xs font-medium text-destructive">Component Stack:</p>
                        <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook version for functional components
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null)
  const { reportError } = useErrorReporting("useErrorBoundary")

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const captureError = React.useCallback(
    (error: Error, metadata?: Record<string, any>) => {
      reportError(error, "ManualCapture", metadata)
      setError(error)
    },
    [reportError],
  )

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { captureError, resetError }
}

// Higher-order component for wrapping components with error boundaries
export function withErrorBoundary<P extends object>(Component: React.ComponentType<P>, componentName?: string) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary componentName={componentName || Component.displayName || Component.name}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${componentName || Component.displayName || Component.name})`

  return WrappedComponent
}
