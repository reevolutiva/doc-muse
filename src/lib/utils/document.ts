import type { StorageFile } from '@/lib/types/document'

export interface DocumentValidationResult {
  isValid: boolean
  error?: string
  extension?: string
}

export const validateDocument = (file: File): DocumentValidationResult => {
  const fileExt = file.name.split('.').pop()?.toLowerCase()
  const allowedExtensions = ['pdf', 'doc', 'docx', 'txt']
  
  if (!fileExt || !allowedExtensions.includes(fileExt)) {
    return {
      isValid: false,
      error: 'Invalid file type. Allowed types: PDF, DOC, DOCX, TXT'
    }
  }

  if (file.size > 50 * 1024 * 1024) {
    return {
      isValid: false,
      error: 'File size exceeds 50MB limit'
    }
  }

  return {
    isValid: true,
    extension: fileExt
  }
}

export const extractDisplayName = (file: StorageFile): string => {
  const fullName = file.name.split('/').pop() || file.name
  return fullName.includes('-') ? fullName.split('-').slice(1).join('-') : fullName
}

export const generateStoragePath = (userId: string, projectId: string, fileName: string): string => {
  const uniqueId = crypto.randomUUID()
  return `${userId}/${projectId}/${uniqueId}-${fileName}`
}
