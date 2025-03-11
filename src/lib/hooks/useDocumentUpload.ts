"use client"

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { 
  DocumentUploadResult, 
  DocumentUploadOptions, 
  DocumentUploadHookOptions 
} from '@/lib/types/document'
import { validateDocument, generateStoragePath } from '@/lib/utils/document'

export function useDocumentUpload({ projectId, onSuccess }: DocumentUploadHookOptions) {
  const [uploadProgress, setUploadProgress] = useState(0)

  const uploadFile = useCallback(async (file: File): Promise<DocumentUploadResult> => {
    if (!projectId) {
      throw new Error('No project selected')
    }

    setUploadProgress(0)
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Please log in to upload documents')
    }

    try {
      const validation = validateDocument(file)
      if (!validation.isValid || !validation.extension) {
        throw new Error(validation.error || 'Invalid file')
      }

      const filePath = generateStoragePath(session.user.id, projectId, file.name)
      
      const options: DocumentUploadOptions = {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      }

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('project_documents')
        .upload(filePath, file, options)

      if (uploadError) {
        throw uploadError
      }

      if (!uploadData) {
        throw new Error('No upload data received')
      }

      setUploadProgress(100)
      setTimeout(() => setUploadProgress(0), 1000)

      return {
        name: file.name,
        id: filePath.split('/').pop() || file.name,
        path: filePath,
        extension: validation.extension,
        size: file.size
      }
    } catch (error) {
      setUploadProgress(0)
      throw error
    }
  }, [projectId])

  return {
    uploadProgress,
    uploadFile
  }
}
