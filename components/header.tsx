"use client"

import type React from "react"

import { useState } from "react"
import { Search, Menu, X, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import { SkipLink, FocusTrap } from "@/components/ui/accessibility"
import Link from "next/link"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const navItems = [
    { name: "Home", href: "#" },
    { name: "Tools", href: "#tools" },
    { name: "Featured", href: "#featured" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ]

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsMenuOpen(false)
    }
  }

  return (
    <>
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SkipLink href="#tools">Skip to tools</SkipLink>

      <header
        className="sticky top-0 z-50 w-full border-b border-border/20 bg-white backdrop-blur supports-[backdrop-filter]:bg-white/90"
        role="banner"
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Link
                href="/"
                className="hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                aria-label="FileTools - Go to homepage"
              >
                <img
                  src="/images/filetools-logo.png"
                  alt="FileTools logo"
                  className="h-8 w-auto"
                  width="32"
                  height="32"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-gray-700 hover:text-[#0c3d64] transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1"
                  aria-current={item.name === "Home" ? "page" : undefined}
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Search and Theme Toggle */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="md:hidden text-gray-700 hover:bg-gray-100"
                  aria-label="Toggle search"
                  aria-expanded={isSearchOpen}
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                </Button>
                <div
                  className={`hidden md:flex items-center transition-all duration-300 ${isSearchOpen ? "w-64" : "w-48"}`}
                >
                  <label htmlFor="desktop-search" className="sr-only">
                    Search tools
                  </label>
                  <Input
                    id="desktop-search"
                    type="search"
                    placeholder="Search tools..."
                    className="w-full bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-[#04afea]"
                    onFocus={() => setIsSearchOpen(true)}
                    onBlur={() => setIsSearchOpen(false)}
                    aria-describedby="search-help"
                  />
                  <div id="search-help" className="sr-only">
                    Search through available file conversion tools
                  </div>
                </div>
              </div>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-gray-700 hover:bg-gray-100"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              >
                <Sun
                  className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                  aria-hidden="true"
                />
                <Moon
                  className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                  aria-hidden="true"
                />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMenuOpen ? (
                  <X className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Menu className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <FocusTrap active={isMenuOpen}>
              <div
                id="mobile-menu"
                className="md:hidden border-t border-gray-200 py-4 animate-in slide-in-from-top-2 bg-white/95"
                onKeyDown={handleMenuKeyDown}
                role="navigation"
                aria-label="Mobile navigation"
              >
                <nav className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-sm font-medium text-gray-700 hover:text-[#0c3d64] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1"
                      onClick={() => setIsMenuOpen(false)}
                      aria-current={item.name === "Home" ? "page" : undefined}
                    >
                      {item.name}
                    </a>
                  ))}
                  <div className="pt-4 border-t border-gray-200">
                    <label htmlFor="mobile-search" className="sr-only">
                      Search tools
                    </label>
                    <Input
                      id="mobile-search"
                      type="search"
                      placeholder="Search tools..."
                      className="w-full bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500"
                      aria-describedby="mobile-search-help"
                    />
                    <div id="mobile-search-help" className="sr-only">
                      Search through available file conversion tools
                    </div>
                  </div>
                </nav>
              </div>
            </FocusTrap>
          )}
        </div>
      </header>
    </>
  )
}
