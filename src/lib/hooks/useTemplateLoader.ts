"use client"

import { useSupabaseQuery } from "./useSupabase"
import { supabase } from "@/lib/supabase"
import type { TemplateData, TemplateLoaderResult } from "@/lib/types/template"
import { handleError, createErrorHandler } from "@/lib/utils/error-handler"

export function useTemplateLoader(projectId?: string, type?: 'document' | 'project'): TemplateLoaderResult {
  const errorHandler = createErrorHandler('Template Loader')
  
  const { data: templateData, loading, error } = useSupabaseQuery<TemplateData[]>(
    async () => {
      try {

        const table = type === 'document' ? 'document_templates' : 'project_templates'

        let query = supabase.from(table).select('*')

        
        // Apply filters
        if (projectId) {
          const { data: project, error: projectError } = await supabase
            .from('projects')
            .select('project_template_id')
            .eq('id', projectId)
            .single()

          if (projectError) throw projectError
          if (!project?.project_template_id) {
            return { data: [], error: null }
          }

          query = query
            .eq('project_template_id', project.project_template_id)
            .order('sequence_order')
        }

        if (type && type === 'document' ) {
          query = query.eq('type', type)
        }

        const { data, error } = await query.order('created_at', { ascending: false })
        if (error) throw error

        return { 
          data: data?.map(template => ({
            ...template,
            content: typeof template.content === 'string'
              ? template.content
              : JSON.stringify(template.content)
          })) || [],
          error: null
        }
      } catch (err) {
        errorHandler(err)
        return { 
          data: [],
          error: err instanceof Error ? err : new Error('Failed to fetch template data')
        }
      }
    },
    [projectId, type]
  )

  return {
    templateData,
    loading,
    error
  }
}
