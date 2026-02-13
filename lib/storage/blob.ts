import { put, del, list } from '@vercel/blob'

export interface UploadFileResult {
  url: string
  pathname: string
  contentType: string
  contentDisposition: string
}

export async function uploadFile(
  file: File,
  pathname: string
): Promise<UploadFileResult> {
  const blob = await put(pathname, file, {
    access: 'public',
    addRandomSuffix: true,
  })

  return {
    url: blob.url,
    pathname: blob.pathname,
    contentType: blob.contentType,
    contentDisposition: blob.contentDisposition,
  }
}

export async function deleteFile(url: string): Promise<void> {
  await del(url)
}

export async function listFiles(prefix?: string) {
  const { blobs } = await list({
    prefix,
  })
  return blobs
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

export function getFileCategory(filename: string): string {
  const ext = getFileExtension(filename)

  const categories: Record<string, string> = {
    // Design files
    'psd': 'DESIGN',
    'ai': 'DESIGN',
    'sketch': 'DESIGN',
    'fig': 'DESIGN',
    'xd': 'DESIGN',
    'png': 'DESIGN',
    'jpg': 'DESIGN',
    'jpeg': 'DESIGN',
    'svg': 'DESIGN',
    'gif': 'DESIGN',

    // Documents
    'pdf': 'DOCUMENT',
    'doc': 'DOCUMENT',
    'docx': 'DOCUMENT',
    'txt': 'DOCUMENT',
    'rtf': 'DOCUMENT',
    'odt': 'DOCUMENT',

    // Code files
    'js': 'CODE',
    'ts': 'CODE',
    'jsx': 'CODE',
    'tsx': 'CODE',
    'html': 'CODE',
    'css': 'CODE',
    'scss': 'CODE',
    'json': 'CODE',
    'xml': 'CODE',
    'py': 'CODE',
    'java': 'CODE',
    'php': 'CODE',
    'rb': 'CODE',
    'go': 'CODE',
    'rs': 'CODE',
    'zip': 'CODE',
    'tar': 'CODE',
    'gz': 'CODE',
  }

  return categories[ext] || 'GENERAL'
}

export function validateFileSize(size: number, maxSizeMB: number = 50): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return size <= maxSizeBytes
}

export function validateFileType(filename: string, allowedTypes?: string[]): boolean {
  if (!allowedTypes || allowedTypes.length === 0) {
    return true
  }

  const ext = getFileExtension(filename)
  return allowedTypes.includes(ext)
}
