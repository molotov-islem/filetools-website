// Components JavaScript - Reusable UI components

class ToolCard {
  constructor(tool) {
    this.tool = tool
  }

  render() {
    return `
            <div class="tool-card" onclick="openTool('${this.tool.id}')">
                <div class="tool-icon" style="background: ${this.tool.color || "var(--primary-color)"}">
                    ${this.tool.icon}
                </div>
                <h3 class="tool-title">${this.tool.name}</h3>
                <p class="tool-description">${this.tool.description}</p>
                <div class="tool-tags">
                    ${this.tool.tags.map((tag) => `<span class="tool-tag">${tag}</span>`).join("")}
                </div>
            </div>
        `
  }
}

class SearchResults {
  constructor(container) {
    this.container = container
    this.results = []
  }

  show(results) {
    this.results = results
    this.render()
    this.container.style.display = "block"
  }

  hide() {
    this.container.style.display = "none"
  }

  render() {
    this.container.innerHTML = this.results
      .map(
        (result) => `
            <div class="search-result-item" onclick="openTool('${result.id}')">
                <div class="search-result-title">${result.name}</div>
                <div class="search-result-desc">${result.description}</div>
            </div>
        `,
      )
      .join("")
  }
}

class LoadingSkeleton {
  static create(count = 6) {
    return Array(count)
      .fill(0)
      .map(
        () => `
            <div class="loading-skeleton loading-card"></div>
        `,
      )
      .join("")
  }
}

class Notification {
  constructor() {
    this.container = null
    this.timeout = null
  }

  show(message, type = "info", duration = 3000) {
    this.hide() // Hide any existing notification

    this.container = document.createElement("div")
    this.container.className = `notification ${type}`
    this.container.innerHTML = `
            <div class="notification-content">
                ${message}
            </div>
        `

    document.body.appendChild(this.container)

    // Trigger animation
    setTimeout(() => {
      this.container.classList.add("show")
    }, 10)

    // Auto hide
    this.timeout = setTimeout(() => {
      this.hide()
    }, duration)
  }

  hide() {
    if (this.container) {
      this.container.classList.remove("show")
      setTimeout(() => {
        if (this.container && this.container.parentNode) {
          this.container.parentNode.removeChild(this.container)
        }
        this.container = null
      }, 300)
    }
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  }
}

// Global notification instance
const notification = new Notification()

// Utility functions for components
function openTool(toolId) {
  console.log(`Opening tool: ${toolId}`)
  notification.show(`Opening ${toolId}...`, "info")
  // Add your tool opening logic here
}

function createToolGrid(tools) {
  return tools.map((tool) => new ToolCard(tool).render()).join("")
}

// Export for use in other scripts
window.ToolCard = ToolCard
window.SearchResults = SearchResults
window.LoadingSkeleton = LoadingSkeleton
window.Notification = Notification
window.notification = notification
