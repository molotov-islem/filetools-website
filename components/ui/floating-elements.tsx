"use client"

import { useEffect, useState } from "react"

export function FloatingElements() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Floating geometric shapes */}
      <div
        className="absolute top-20 left-10 w-4 h-4 bg-primary/10 rounded-full animate-bounce"
        style={{ animationDelay: "0s", animationDuration: "3s" }}
      />
      <div
        className="absolute top-40 right-20 w-6 h-6 bg-accent/10 rounded-full animate-bounce"
        style={{ animationDelay: "1s", animationDuration: "4s" }}
      />
      <div
        className="absolute bottom-40 left-20 w-3 h-3 bg-primary/10 rounded-full animate-bounce"
        style={{ animationDelay: "2s", animationDuration: "5s" }}
      />
      <div
        className="absolute bottom-20 right-10 w-5 h-5 bg-accent/10 rounded-full animate-bounce"
        style={{ animationDelay: "0.5s", animationDuration: "3.5s" }}
      />
    </div>
  )
}
