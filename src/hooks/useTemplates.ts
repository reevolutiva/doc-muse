"use client"

import { useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import useTemplateLoader from "./useTemplateLoader"
import type { Template, TemplateHookResult } from '@/lib/types/templates'
import { handleError, createErrorHandler } from '@/lib/utils/error-handler'

export function useTemplates(projectId?: string): TemplateHookResult {
  const errorHandler = createErrorHandler('Templates')
  const { templates, loading, error } = useTemplateLoader()

  const createDocument = useCallback(async (template: Template): Promise<void> => {
    if (!projectId) {
      const error = new Error('Project ID is required')
      errorHandler(error)
      throw error
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Please log in to create documents')
      }

      const { data, error: invokeError } = await supabase.functions.invoke('create-document', {
        body: { 
          projectId,
          templateId: template.id
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      if (invokeError) throw invokeError
      if (!data?.success) throw new Error(data?.error || 'Failed to create document')

      toast.success('Document created successfully')
    } catch (err) {
      errorHandler(err)
      throw err
    }
  }, [projectId, errorHandler])

  return {
    templateData: templates,
    loading,
    error,
    createDocument
  }
}
