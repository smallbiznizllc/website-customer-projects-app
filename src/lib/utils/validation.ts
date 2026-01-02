import crypto from 'crypto'

export function generatePublicKey(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function hashPublicKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex')
}

export function validateFileSize(fileSize: number, maxSizeMB: number = 2): boolean {
  const maxSize = maxSizeMB * 1024 * 1024
  return fileSize <= maxSize
}

export function validateFileType(fileName: string, allowedTypes?: string[]): boolean {
  if (!allowedTypes || allowedTypes.length === 0) {
    return true
  }
  
  const extension = fileName.split('.').pop()?.toLowerCase()
  return extension ? allowedTypes.includes(extension) : false
}



