"use client"

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { DocumentUploadOptions } from '@/features/documents/types/upload'
import { validateDocument, generateStoragePath } from '@/features/documents/utils/document'

export interface DocumentUploadResult {
  name: string
  id: string
  path: string
  extension: string
  size: number
}

export interface DocumentUploadHookOptions {
  projectId: string | undefined
  onSuccess?: (count: number) => void
}

/**
 * Hook para gestionar la carga de documentos
 * 
 * @param options - Opciones de configuración para la carga de documentos
 * @returns Objeto con el progreso de carga y la función para cargar archivos
 */
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