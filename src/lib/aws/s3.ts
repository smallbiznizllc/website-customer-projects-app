import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export const generatePresignedUploadUrl = async (
  fileName: string,
  fileType: string,
  fileSize: number
): Promise<{ url: string; key: string }> => {
  // Validate file size (2MB max)
  const maxSize = 2 * 1024 * 1024 // 2MB in bytes
  if (fileSize > maxSize) {
    throw new Error('File size exceeds 2MB limit')
  }

  const key = `tickets/${Date.now()}-${fileName}`
  
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    ContentType: fileType,
  })

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
  return { url, key }
}

export const generatePresignedDownloadUrl = async (
  s3Key: string
): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: s3Key,
  })

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
  return url
}



