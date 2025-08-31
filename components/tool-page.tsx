"use client"

import { Progress } from "@/components/ui/progress"
import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { Upload, FileIcon, Download, CheckCircle, AlertCircle, Loader2, Shield, type LucideIcon } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { LiveRegion, useAnnouncement } from "@/components/ui/accessibility"
import { useErrorReporting, usePerformanceMonitoring, monitoring } from "@/lib/monitoring"
import {
  validateFile,
  validateFileContent,
  createSecureDownload,
  hashFile,
  type FileValidationResult,
} from "@/lib/security"
import type { RejectedFile, ToolType, FileFormat } from "@/lib/types"

interface ToolPageProps {
  title: string
  description: string
  icon: LucideIcon
  acceptedFormats: FileFormat[]
  outputFormat: string
  toolType: ToolType
  features: string[]
}

interface SecureFile extends File {
  hash?: string
  validationResult?: FileValidationResult
}

export function ToolPage({
  title,
  description,
  icon: Icon,
  acceptedFormats,
  outputFormat,
  toolType,
  features,
}: ToolPageProps) {
  const [files, setFiles] = useState<SecureFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const announce = useAnnouncement()

  const { reportError, trackAction } = useErrorReporting("ToolPage")
  const { startMeasurement, endMeasurement } = usePerformanceMonitoring("ToolPage")

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: RejectedFile[]) => {
      startMeasurement("FileValidation")

      try {
        setError(null)
        setIsComplete(false)
        setProgress(0)
        setIsValidating(true)

        trackAction("FilesDropped", {
          acceptedCount: acceptedFiles.length,
          rejectedCount: rejectedFiles.length,
          totalSize: acceptedFiles.reduce((sum, file) => sum + file.size, 0),
        })

        announce({ message: `Processing ${acceptedFiles.length} files for validation` })

        if (rejectedFiles.length > 0) {
          const rejectionReasons = rejectedFiles
            .map(({ file, errors }) => `${file.name}: ${errors.map((e) => e.message).join(", ")}`)
            .join("\n")
          setError(`Some files were rejected:\n${rejectionReasons}`)
          announce({
            message: `${rejectedFiles.length} files were rejected due to validation errors`,
            priority: "assertive",
          })

          trackAction("FilesRejected", {
            rejectedCount: rejectedFiles.length,
            reasons: rejectedFiles.map(({ errors }) => errors.map((e) => e.code)),
          })
        }

        const validatedFiles: SecureFile[] = []

        for (const file of acceptedFiles) {
          try {
            const validationResult = validateFile(file, acceptedFormats)
            if (!validationResult.isValid) {
              setError((prev) =>
                prev ? `${prev}\n${file.name}: ${validationResult.error}` : `${file.name}: ${validationResult.error}`,
              )
              continue
            }

            const isValidContent = await validateFileContent(file)
            if (!isValidContent) {
              setError((prev) =>
                prev
                  ? `${prev}\n${file.name}: File content validation failed`
                  : `${file.name}: File content validation failed`,
              )
              continue
            }

            const hash = await hashFile(file)

            const secureFile: SecureFile = Object.assign(file, {
              hash,
              validationResult,
            })

            validatedFiles.push(secureFile)
          } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err))
            reportError(error, "FileValidation", { fileName: file.name, fileSize: file.size, fileType: file.type })
            setError((prev) => (prev ? `${prev}\n${file.name}: Validation failed` : `${file.name}: Validation failed`))
          }
        }

        setFiles(validatedFiles)
        setIsValidating(false)

        if (validatedFiles.length > 0) {
          announce({ message: `${validatedFiles.length} files successfully validated and ready for processing` })
          trackAction("FilesValidated", {
            validatedCount: validatedFiles.length,
            totalSize: validatedFiles.reduce((sum, file) => sum + file.size, 0),
          })
        }

        endMeasurement("FileValidation", {
          fileCount: acceptedFiles.length,
          validatedCount: validatedFiles.length,
          success: true,
        })
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        reportError(error, "FileDropError", {
          acceptedCount: acceptedFiles.length,
          rejectedCount: rejectedFiles.length,
        })
        setError("An unexpected error occurred during file validation")
        setIsValidating(false)

        endMeasurement("FileValidation", {
          fileCount: acceptedFiles.length,
          success: false,
          error: error.message,
        })
      }
    },
    [acceptedFormats, announce, reportError, trackAction, startMeasurement, endMeasurement],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats.reduce(
      (acc, format) => {
        const mimeTypes: Record<FileFormat, string[]> = {
          ".pdf": ["application/pdf"],
          ".jpg": ["image/jpeg"],
          ".jpeg": ["image/jpeg"],
          ".png": ["image/png"],
          ".webp": ["image/webp"],
          ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
          ".xlsx": ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
          ".pptx": ["application/vnd.openxmlformats-officedocument.presentationml.presentation"],
        }

        const mimes = mimeTypes[format] || []
        mimes.forEach((mime) => {
          acc[mime] = [format]
        })
        return acc
      },
      {} as Record<string, string[]>,
    ),
    maxFiles: 5,
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: true,
    preventDropOnDocument: true,
  })

  const handleProcess = async () => {
    if (files.length === 0) return

    const processingStartTime = performance.now()
    startMeasurement("FileProcessing")

    try {
      setIsProcessing(true)
      setError(null)

      const totalSize = files.reduce((sum, file) => sum + file.size, 0)

      trackAction("ProcessingStarted", {
        toolType,
        fileCount: files.length,
        totalSize,
      })

      announce({
        message: `Starting ${toolType === "convert" ? "conversion" : "compression"} of ${files.length} files`,
      })

      // Simulate processing with progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 200))

        // Simulate potential processing errors
        if (i === 50 && Math.random() < 0.1) {
          throw new Error("Processing failed due to file corruption")
        }
      }

      const processingTime = performance.now() - processingStartTime

      setIsProcessing(false)
      setIsComplete(true)

      announce({
        message: `${toolType === "convert" ? "Conversion" : "Compression"} completed successfully. Files are ready for download.`,
      })

      // Report successful processing
      monitoring.trackFileProcessing(toolType, files.length, totalSize, processingTime, true)

      trackAction("ProcessingCompleted", {
        toolType,
        fileCount: files.length,
        totalSize,
        processingTime,
        success: true,
      })

      endMeasurement("FileProcessing", {
        fileCount: files.length,
        totalSize,
        success: true,
      })
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      const processingTime = performance.now() - processingStartTime
      const totalSize = files.reduce((sum, file) => sum + file.size, 0)

      reportError(error, "FileProcessing", {
        toolType,
        fileCount: files.length,
        totalSize,
        processingTime,
      })

      setError(error.message)
      setIsProcessing(false)

      announce({ message: "Processing failed. Please check the error message and try again.", priority: "assertive" })

      // Report failed processing
      monitoring.trackFileProcessing(toolType, files.length, totalSize, processingTime, false, error.message)

      trackAction("ProcessingFailed", {
        toolType,
        fileCount: files.length,
        totalSize,
        processingTime,
        error: error.message,
        success: false,
      })

      endMeasurement("FileProcessing", {
        fileCount: files.length,
        totalSize,
        success: false,
        error: error.message,
      })
    }
  }

  const handleDownload = () => {
    try {
      const dummyContent = new Blob(["Processed file content"], { type: "application/octet-stream" })
      createSecureDownload(dummyContent, `processed_file${outputFormat}`)

      announce({ message: "File download started" })

      trackAction("DownloadStarted", {
        outputFormat,
        fileCount: files.length,
      })
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      reportError(error, "FileDownload", { outputFormat })
      setError("Download failed. Please try again.")
      announce({ message: "Download failed. Please try again.", priority: "assertive" })
    }
  }

  return (
    <div className="py-12">
      <LiveRegion>
        {isValidating && "Validating uploaded files..."}
        {isProcessing && `Processing files: ${progress}% complete`}
        {isComplete && "Processing complete. Files ready for download."}
        {error && `Error: ${error}`}
      </LiveRegion>

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <ScrollReveal direction="fade" className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-6 hover:bg-primary/20 hover:scale-110 transition-all duration-300">
            <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
          <h1
            id="main-content"
            className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance"
            tabIndex={-1}
          >
            {title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">{description}</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Tool Area */}
          <ScrollReveal direction="left" delay={200} className="lg:col-span-2">
            <Card className="mb-6 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Upload Your Files
                  <Shield className="h-4 w-4 text-green-500" aria-hidden="true" />
                </CardTitle>
                <CardDescription>
                  Drag and drop your files or click to browse. Supports {acceptedFormats.join(", ")} formats. Max 100MB
                  per file.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* File Upload Area */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
                    isDragActive
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/20 scale-105"
                      : "border-border hover:border-primary/50 hover:bg-primary/5 hover:shadow-md"
                  } ${isValidating ? "pointer-events-none opacity-50" : ""}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Upload files. Supports ${acceptedFormats.join(", ")} formats. Maximum 5 files, 100MB each.`}
                  aria-describedby="upload-instructions"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      const input = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement
                      input?.click()
                    }
                  }}
                >
                  <input {...getInputProps()} aria-describedby="upload-instructions" />
                  <Upload
                    className={`h-12 w-12 mx-auto mb-4 transition-all duration-300 ${
                      isDragActive
                        ? "text-primary scale-110 animate-bounce"
                        : "text-muted-foreground hover:text-primary"
                    } ${isValidating ? "animate-spin" : ""}`}
                    aria-hidden="true"
                  />
                  {isValidating ? (
                    <p className="text-primary font-medium">Validating files...</p>
                  ) : isDragActive ? (
                    <p className="text-primary font-medium animate-pulse">Drop your files here...</p>
                  ) : (
                    <div>
                      <p className="text-foreground font-medium mb-2">Drag & drop files here, or click to select</p>
                      <p id="upload-instructions" className="text-sm text-muted-foreground">
                        Supports {acceptedFormats.join(", ")} • Max 5 files • 100MB limit
                      </p>
                    </div>
                  )}
                </div>

                {/* Uploaded Files */}
                {files.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      Uploaded Files:
                      <Shield className="h-4 w-4 text-green-500" aria-hidden="true" />
                    </h4>
                    <ul role="list" aria-label="Uploaded files">
                      {files.map((file, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-green-200/50"
                          role="listitem"
                        >
                          <FileIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {file.validationResult?.sanitizedName || file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                              {file.hash && <span className="ml-2 text-green-600">✓ Verified</span>}
                            </p>
                          </div>
                          {isComplete && (
                            <CheckCircle className="h-5 w-5 text-green-500" aria-label="File processed successfully" />
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Process Button */}
                {files.length > 0 && !isComplete && (
                  <div className="mt-6">
                    <AnimatedButton
                      onClick={handleProcess}
                      disabled={isProcessing || isValidating}
                      glow
                      pulse={isProcessing}
                      ripple
                      className="w-full group"
                      size="lg"
                      aria-describedby="process-description"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" aria-hidden="true" />
                          {toolType === "convert" ? "Converting..." : "Compressing..."}
                        </>
                      ) : (
                        <>
                          <Shield className="h-5 w-5 mr-2" aria-hidden="true" />
                          {toolType === "convert" ? "Securely Convert Files" : "Securely Compress Files"}
                        </>
                      )}
                    </AnimatedButton>
                    <p id="process-description" className="sr-only">
                      This will {toolType === "convert" ? "convert" : "compress"} your uploaded files securely in your
                      browser
                    </p>
                  </div>
                )}

                {/* Progress Bar */}
                {isProcessing && (
                  <div className="mt-6 animate-in slide-in-from-top-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Processing securely...</span>
                      <span className="text-foreground font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" aria-label={`Processing progress: ${progress}%`} />
                  </div>
                )}

                {/* Download Button */}
                {isComplete && (
                  <div className="mt-6 animate-in slide-in-from-bottom-2">
                    <AnimatedButton
                      onClick={handleDownload}
                      glow
                      ripple
                      className="w-full bg-green-600 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/25"
                      size="lg"
                      aria-describedby="download-description"
                    >
                      <Download className="h-5 w-5 mr-2" aria-hidden="true" />
                      Secure Download {outputFormat}
                    </AnimatedButton>
                    <p id="download-description" className="sr-only">
                      Download your processed {outputFormat} file
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div
                    className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
                    role="alert"
                    aria-live="assertive"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-destructive mb-1">Security Error</p>
                        <pre className="text-xs text-destructive whitespace-pre-wrap">{error}</pre>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Features */}
            <ScrollReveal direction="right" delay={300}>
              <Card className="hover:shadow-md transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3" role="list">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 group" role="listitem">
                        <CheckCircle
                          className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform"
                          aria-hidden="true"
                        />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={400}>
              <Card className="hover:shadow-md transition-shadow duration-300 border-green-200/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" aria-hidden="true" />
                    Security & Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-muted-foreground" role="list">
                    {[
                      "Files are processed locally in your browser",
                      "No files are uploaded to our servers",
                      "File content validation & integrity checks",
                      "Secure filename sanitization",
                      "Protection against malicious file types",
                      "100% secure and private processing",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2 group" role="listitem">
                        <CheckCircle
                          className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform"
                          aria-hidden="true"
                        />
                        <span className="group-hover:text-foreground transition-colors">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  )
}
