export interface RejectedFile {
  file: File
  errors: Array<{
    code: string
    message: string
  }>
}

export interface FileDropzoneError {
  code: "file-too-large" | "file-invalid-type" | "too-many-files" | "file-too-small"
  message: string
}

export interface ProcessingMetrics {
  fileCount: number
  totalSize: number
  processingTime: number
  success: boolean
  error?: string
}

export interface SecurityValidation {
  isContentValid: boolean
  hasValidSignature: boolean
  isSafeFilename: boolean
  hash: string
}

export type ToolType = "convert" | "compress"
export type FileFormat = ".pdf" | ".jpg" | ".jpeg" | ".png" | ".webp" | ".docx" | ".xlsx" | ".pptx"

export interface ToolPageConfig {
  title: string
  description: string
  acceptedFormats: FileFormat[]
  outputFormat: string
  toolType: ToolType
  features: string[]
}
