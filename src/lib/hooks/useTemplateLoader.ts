"use client"

import { useSupabaseQuery } from "./useSupabase"
import { supabase } from "@/lib/supabase"
import type { TemplateData, TemplateLoaderResult } from "@/lib/types/template"
import { handleError, createErrorHandler } from "@/lib/utils/error-handler"

export function useTemplateLoader(projectId?: string): TemplateLoaderResult {
  const errorHandler = createErrorHandler('Template Loader');
  
  const { data: templateData, loading, error } = useSupabaseQuery<TemplateData[]>(
    async () => {
      try {
        type QueryResult = {
          document_template_id: string
          is_required: boolean
          sequence_order: number
          document_templates: {
            id: string
            title: string
            description: string
            content: string
          }
        }
        if (!projectId) {
          return { data: [], error: new Error('No project ID') }
        }

        const { data: project, error: projectError } = await supabase
          .from('projects')
          .select('project_template_id')
          .eq('id', projectId)
          .single()

        if (projectError) throw projectError
        if (!project?.project_template_id) {
          return { data: [], error: null }
        }

        const { data, error: templatesError } = await supabase
          .from('project_template_doc_templates')
          .select(`
            document_template_id,
            is_required,
            sequence_order,
            document_templates:document_template_id (
              id,
              title,
              description,
              content
            )
          `)
          .eq('project_template_id', project.project_template_id)
          .order('sequence_order')

        if (templatesError) throw templatesError
        return { 
          data: data?.map(item => ({
            document_template_id: item.document_template_id,
            is_required: item.is_required,
            sequence_order: item.sequence_order,
            document_templates: {
              ...item.document_templates,
              content: typeof item.document_templates.content === 'string' 
                ? item.document_templates.content 
                : JSON.stringify(item.document_templates.content)
            }
          })) as TemplateData[],
          error: null 
        }
      } catch (err) {
        errorHandler(err, { silent: true });
        return { data: [], error: err instanceof Error ? err : new Error('Failed to fetch template data') }
      }
    },
    [projectId]
  )

  return {
    templateData,
    loading,
    error
  }
}
