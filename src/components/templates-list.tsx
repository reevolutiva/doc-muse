"use client"

import { useState, useEffect } from "react"
import { FileText, Plus } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { useDocumentGeneration } from "@/lib/hooks/useDocumentGeneration"

interface Template {
  id: string
  title: string
  description: string | null
  content: string
  is_required: boolean
  sequence_order: number
}

interface TemplatesListProps {
  projectId?: string
  onSuccess?: () => void
}

export function TemplatesList({ projectId, onSuccess }: TemplatesListProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const { isGenerating, generateDocument } = useDocumentGeneration()

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!projectId) return

      try {
        // First get the project's template ID
        const { data: project, error: projectError } = await supabase
          .from('projects')
          .select('project_template_id')
          .eq('id', projectId)
          .single()

        if (projectError) throw projectError

        if (!project.project_template_id) {
          setTemplates([])
          setLoading(false)
          return
        }

        // Then get all document templates associated with this project template
        const { data, error } = await supabase
          .from('project_template_doc_templates')
          .select(`
            document_template_id,
            is_required,
            sequence_order,
            document_template:document_template_id (
              id,
              title,
              description,
              content
            )
          `)
          .eq('project_template_id', project.project_template_id)
          .order('sequence_order')

        if (error) throw error

        const formattedTemplates = data.map(item => ({
          ...item.document_template,
          is_required: item.is_required,
          sequence_order: item.sequence_order
        }))

        setTemplates(formattedTemplates)
      } catch (error: any) {
        console.error('Error fetching templates:', error)
        toast.error('Failed to load templates')
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [projectId])

  const handleCreateDocument = async (template: Template) => {
    if (!projectId) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in to create documents')
        return
      }

      const { data, error } = await supabase.functions.invoke('create-document', {
        body: { 
          projectId,
          templateId: template.id
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      if (error) throw error
      if (!data.success) throw new Error(data.error)

      toast.success('Document created successfully')
      onSuccess?.()
    } catch (error: any) {
      console.error('Error creating document:', error)
      toast.error(error.message || 'Failed to create document')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        No templates available for this project
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {templates.map((template) => (
        <div
          key={template.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">{template.title}</span>
              {template.description && (
                <span className="text-xs text-gray-500 truncate">{template.description}</span>
              )}
              {template.is_required && (
                <span className="text-xs text-blue-600 font-medium">Required</span>
              )}
            </div>
          </div>
          <button
            onClick={() => handleCreateDocument(template)}
            disabled={isGenerating}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ml-2 flex-shrink-0 disabled:opacity-50"
            title="Create document from template"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
