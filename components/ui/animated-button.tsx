"use client"

import type React from "react"

import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface AnimatedButtonProps extends ButtonProps {
  ripple?: boolean
  glow?: boolean
  pulse?: boolean
}

export function AnimatedButton({
  children,
  className,
  ripple = false,
  glow = false,
  pulse = false,
  onClick,
  ...props
}: AnimatedButtonProps) {
  const [isClicked, setIsClicked] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple) {
      setIsClicked(true)
      setTimeout(() => setIsClicked(false), 300)
    }
    onClick?.(e)
  }

  return (
    <Button
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        glow && "hover:shadow-lg hover:shadow-primary/25",
        pulse && "hover:animate-pulse",
        isClicked && "animate-pulse",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {ripple && isClicked && <span className="absolute inset-0 bg-white/20 animate-ping rounded-md" />}
      {children}
    </Button>
  )
}
