import { NextRequest, NextResponse } from 'next/server'
import { generatePresignedUploadUrl } from '@/lib/aws/s3'

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileType, fileSize } = await request.json()

    // Validate file size
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (fileSize > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 2MB limit' },
        { status: 400 }
      )
    }

    const { url, key } = await generatePresignedUploadUrl(
      fileName,
      fileType,
      fileSize
    )

    return NextResponse.json({
      presignedUrl: url,
      s3Key: key,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    )
  }
}



