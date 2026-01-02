'use client'

import { useState } from 'react'

interface FileUploadProps {
  attachments: Array<{ fileName: string; s3Key: string; fileSize: number }>
  onAttachmentsChange: (
    attachments: Array<{ fileName: string; s3Key: string; fileSize: number }>
  ) => void
}

export default function FileUpload({
  attachments,
  onAttachmentsChange,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const maxSize = 2 * 1024 * 1024 // 2MB

    if (file.size > maxSize) {
      alert('File size must be less than 2MB')
      return
    }

    setUploading(true)

    try {
      // Get presigned URL
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const { presignedUrl, s3Key } = await response.json()

      // Upload to S3
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload to S3')
      }

      // Add to attachments
      onAttachmentsChange([
        ...attachments,
        {
          fileName: file.name,
          s3Key,
          fileSize: file.size,
        },
      ])
    } catch (error: any) {
      console.error('Upload error:', error)
      alert(error.message || 'Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Attachments</label>
      <input
        type="file"
        onChange={handleFileSelect}
        disabled={uploading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
      />
      {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
      {attachments.length > 0 && (
        <ul className="mt-2 space-y-1">
          {attachments.map((att, idx) => (
            <li key={idx} className="text-sm text-gray-600">
              {att.fileName} ({(att.fileSize / 1024).toFixed(2)} KB)
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}



