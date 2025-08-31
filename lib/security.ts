export const SECURITY_CONFIG = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_FILES: 5,
  ALLOWED_MIME_TYPES: {
    pdf: ["application/pdf"],
    image: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    office: [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/msword",
      "application/vnd.ms-excel",
      "application/vnd.ms-powerpoint",
    ],
    text: ["text/plain", "text/csv"],
  },
  DANGEROUS_EXTENSIONS: [
    ".exe",
    ".bat",
    ".cmd",
    ".com",
    ".pif",
    ".scr",
    ".vbs",
    ".js",
    ".jar",
    ".app",
    ".deb",
    ".pkg",
    ".dmg",
    ".rpm",
    ".msi",
    ".run",
    ".bin",
  ],
} as const

export interface FileValidationResult {
  isValid: boolean
  error?: string
  sanitizedName?: string
}

export function validateFile(file: File, allowedTypes: readonly string[]): FileValidationResult {
  // Check file size
  if (file.size > SECURITY_CONFIG.MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds ${SECURITY_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB limit`,
    }
  }

  // Check if file is empty
  if (file.size === 0) {
    return {
      isValid: false,
      error: "File is empty",
    }
  }

  // Validate MIME type
  const isValidMimeType = allowedTypes.some((type) => {
    const allowedMimes = SECURITY_CONFIG.ALLOWED_MIME_TYPES[type as keyof typeof SECURITY_CONFIG.ALLOWED_MIME_TYPES]
    return allowedMimes?.includes(file.type)
  })

  if (!isValidMimeType) {
    return {
      isValid: false,
      error: `File type ${file.type} is not supported`,
    }
  }

  // Check for dangerous file extensions
  const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
  if (SECURITY_CONFIG.DANGEROUS_EXTENSIONS.includes(fileExtension)) {
    return {
      isValid: false,
      error: "File type is not allowed for security reasons",
    }
  }

  // Sanitize filename
  const sanitizedName = sanitizeFilename(file.name)

  return {
    isValid: true,
    sanitizedName,
  }
}

export function sanitizeFilename(filename: string): string {
  // Remove or replace dangerous characters
  return filename
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, "_") // Replace dangerous chars with underscore
    .replace(/^\.+/, "") // Remove leading dots
    .replace(/\.+$/, "") // Remove trailing dots
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .substring(0, 255) // Limit length
}

export function validateFileContent(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer
      if (!arrayBuffer) {
        resolve(false)
        return
      }

      // Check for common file signatures (magic numbers)
      const uint8Array = new Uint8Array(arrayBuffer.slice(0, 16))

      // PDF signature
      if (file.type === "application/pdf") {
        const pdfSignature = [0x25, 0x50, 0x44, 0x46] // %PDF
        const matches = pdfSignature.every((byte, index) => uint8Array[index] === byte)
        resolve(matches)
        return
      }

      // JPEG signature
      if (file.type === "image/jpeg") {
        const jpegSignature = [0xff, 0xd8, 0xff]
        const matches = jpegSignature.every((byte, index) => uint8Array[index] === byte)
        resolve(matches)
        return
      }

      // PNG signature
      if (file.type === "image/png") {
        const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
        const matches = pngSignature.every((byte, index) => uint8Array[index] === byte)
        resolve(matches)
        return
      }

      // For other file types, assume valid if basic checks pass
      resolve(true)
    }

    reader.onerror = () => resolve(false)
    reader.readAsArrayBuffer(file.slice(0, 16))
  })
}

export function createSecureDownload(blob: Blob, filename: string): void {
  const sanitizedFilename = sanitizeFilename(filename)
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = sanitizedFilename
  link.rel = "noopener noreferrer"

  // Add to DOM temporarily for download
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up object URL
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

export function hashFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer
        const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
        resolve(hashHex)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsArrayBuffer(file)
  })
}
