class FileToolsApp {
  constructor() {
    this.theme = localStorage.getItem("theme") || "light"
    this.mobileMenuOpen = false
    this.tools = []

    this.init()
  }

  init() {
    this.setTheme(this.theme)
    this.bindEvents()
    this.loadTools()
    this.initScrollAnimations()
  }

  bindEvents() {
    // Theme toggle
    const themeToggle = document.querySelector(".theme-toggle")
    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggleTheme())
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener("click", () => this.toggleMobileMenu())
    }

    // Search functionality
    const searchInputs = document.querySelectorAll(".search-input")
    searchInputs.forEach((input) => {
      input.addEventListener("input", (e) => this.handleSearch(e.target.value))
    })

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const target = document.querySelector(link.getAttribute("href"))
        if (target) {
          target.scrollIntoView({ behavior: "smooth" })
          this.closeMobileMenu()
        }
      })
    })

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      const mobileMenu = document.getElementById("mobile-menu")
      const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")

      if (this.mobileMenuOpen && !mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        this.closeMobileMenu()
      }
    })

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.mobileMenuOpen) {
        this.closeMobileMenu()
      }
    })
  }

  toggleTheme() {
    this.theme = this.theme === "light" ? "dark" : "light"
    this.setTheme(this.theme)
    localStorage.setItem("theme", this.theme)
  }

  setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme)
    this.theme = theme
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen
    const mobileMenu = document.getElementById("mobile-menu")
    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")

    if (this.mobileMenuOpen) {
      mobileMenu.classList.add("active")
      mobileMenuToggle.setAttribute("aria-expanded", "true")
    } else {
      mobileMenu.classList.remove("active")
      mobileMenuToggle.setAttribute("aria-expanded", "false")
    }
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false
    const mobileMenu = document.getElementById("mobile-menu")
    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")

    mobileMenu.classList.remove("active")
    mobileMenuToggle.setAttribute("aria-expanded", "false")
  }

  async loadTools() {
    try {
      const response = await fetch("/api/tools")
      this.tools = await response.json()
      this.renderTools()
    } catch (error) {
      console.error("Failed to load tools:", error)
      this.renderToolsError()
    }
  }

  renderTools(filteredTools = null) {
    const toolsGrid = document.getElementById("tools-grid")
    if (!toolsGrid) return

    const toolsToRender = filteredTools || this.tools

    if (toolsToRender.length === 0) {
      toolsGrid.innerHTML = '<p class="no-tools">No tools found matching your search.</p>'
      return
    }

    toolsGrid.innerHTML = toolsToRender
      .map(
        (tool) => `
            <div class="tool-card" data-tool-id="${tool.id}">
                <div class="tool-icon">
                    ${this.getToolIcon(tool.icon)}
                </div>
                <h3 class="tool-title">${tool.name}</h3>
                <p class="tool-description">${tool.description}</p>
                <span class="tool-category">${tool.category}</span>
            </div>
        `,
      )
      .join("")

    // Add click handlers to tool cards
    toolsGrid.querySelectorAll(".tool-card").forEach((card) => {
      card.addEventListener("click", () => {
        const toolId = card.getAttribute("data-tool-id")
        this.openTool(toolId)
      })
    })
  }

  renderToolsError() {
    const toolsGrid = document.getElementById("tools-grid")
    if (!toolsGrid) return

    toolsGrid.innerHTML = `
            <div class="error-message">
                <p>Failed to load tools. Please try again later.</p>
                <button class="btn btn-primary" onclick="app.loadTools()">Retry</button>
            </div>
        `
  }

  getToolIcon(iconName) {
    const icons = {
      "file-text": "📄",
      image: "🖼️",
      compress: "🗜️",
      video: "🎥",
      audio: "🎵",
      archive: "📦",
    }
    return icons[iconName] || "🔧"
  }

  handleSearch(query) {
    if (!query.trim()) {
      this.renderTools()
      return
    }

    const filteredTools = this.tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase()) ||
        tool.category.toLowerCase().includes(query.toLowerCase()),
    )

    this.renderTools(filteredTools)
  }

  openTool(toolId) {
    // Simulate opening a tool
    alert(`Opening tool with ID: ${toolId}`)
    // In a real application, this would navigate to the tool page
    // or open a modal with the tool interface
  }

  initScrollAnimations() {
    // Simple scroll reveal animation
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }
      })
    }, observerOptions)

    // Observe elements that should animate on scroll
    document.querySelectorAll(".feature-card, .tool-card").forEach((el) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(20px)"
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
      observer.observe(el)
    })
  }
}

// Global functions for inline event handlers
function toggleTheme() {
  if (window.app) {
    window.app.toggleTheme()
  }
}

function toggleMobileMenu() {
  if (window.app) {
    window.app.toggleMobileMenu()
  }
}

function scrollToTools() {
  const toolsSection = document.getElementById("tools")
  if (toolsSection) {
    toolsSection.scrollIntoView({ behavior: "smooth" })
  }
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.app = new FileToolsApp()
})
