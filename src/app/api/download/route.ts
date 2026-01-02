import { NextRequest, NextResponse } from 'next/server'
import { generatePresignedDownloadUrl } from '@/lib/aws/s3'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json(
        { error: 'Missing key parameter' },
        { status: 400 }
      )
    }

    const url = await generatePresignedDownloadUrl(key)

    return NextResponse.json({ url })
  } catch (error: any) {
    console.error('Download URL error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate download URL' },
      { status: 500 }
    )
  }
}



