"use client"

import { useState, useEffect } from "react"
import { WifiOff, Wifi } from "lucide-react"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showIndicator, setShowIndicator] = useState(false)

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine
      setIsOnline(online)

      if (!online) {
        setShowIndicator(true)
      } else if (showIndicator) {
        // Show "back online" message briefly
        setTimeout(() => setShowIndicator(false), 3000)
      }
    }

    // Set initial status
    updateOnlineStatus()

    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [showIndicator])

  if (!showIndicator) return null

  return (
    <div
      className={`fixed top-20 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-40 animate-in slide-in-from-top-2 ${
        isOnline ? "animate-out slide-out-to-top-2" : ""
      }`}
    >
      <div
        className={`rounded-lg p-3 shadow-lg border ${
          isOnline ? "bg-green-50 border-green-200 text-green-800" : "bg-orange-50 border-orange-200 text-orange-800"
        }`}
      >
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <Wifi className="h-4 w-4" aria-hidden="true" />
          ) : (
            <WifiOff className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="text-sm font-medium">{isOnline ? "Back online" : "You're offline"}</span>
        </div>
        {!isOnline && <p className="text-xs mt-1 opacity-90">Some features may be limited while offline.</p>}
      </div>
    </div>
  )
}
