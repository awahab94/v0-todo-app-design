"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { useAttachments } from "@/lib/hooks/use-attachments"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Paperclip, Upload, X, File, ImageIcon, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface AttachmentUploadProps {
  taskId: string
}

export function AttachmentUpload({ taskId }: AttachmentUploadProps) {
  const { attachments, uploadAttachment, deleteAttachment, isUploading } = useAttachments(taskId)
  const [isDragging, setIsDragging] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        uploadAttachment({ file, taskId })
      })
      setIsDragging(false)
    },
    [taskId, uploadAttachment],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (fileType.includes("pdf") || fileType.includes("document")) return <FileText className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive || isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{isDragActive ? "Drop files here" : "Drag & drop files here"}</p>
            <p className="text-xs text-muted-foreground">or click to browse (max 10MB)</p>
          </div>
        </div>
      </div>

      {/* Attachments List */}
      {attachments && attachments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Paperclip className="h-4 w-4" />
            Attachments ({attachments.length})
          </h4>
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <Card key={attachment.id} className="p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileIcon(attachment.file_type)}
                    <div className="flex-1 min-w-0">
                      <a
                        href={attachment.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium hover:underline truncate block"
                      >
                        {attachment.file_name}
                      </a>
                      <p className="text-xs text-muted-foreground">{formatFileSize(attachment.file_size)}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteAttachment(attachment.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {isUploading && <p className="text-sm text-muted-foreground text-center">Uploading...</p>}
    </div>
  )
}
