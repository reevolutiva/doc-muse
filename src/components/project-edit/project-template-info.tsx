"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { FileText, AlertCircle } from "lucide-react"

interface ProjectTemplateInfoProps {
  templateId: string
}

interface TemplateDoc {
  id: string
  sequence_order: number
  is_required: boolean
  document_template: {
    title: string
    description: string
  }
}

export function ProjectTemplateInfo({ templateId }: ProjectTemplateInfoProps) {
  const [template, setTemplate] = useState<{
    name: string
    description: string
    documents: TemplateDoc[]
  } | null>(null)

  useEffect(() => {
    const fetchTemplateInfo = async () => {
      try {
        // Fetch template details
        const { data: templateData, error: templateError } = await supabase
          .from('project_templates')
          .select('*')
          .eq('id', templateId)
          .single()

        if (templateError) throw templateError

        // Fetch associated document templates
        const { data: docsData, error: docsError } = await supabase
          .from('project_template_doc_templates')
          .select(`
            id,
            sequence_order,
            is_required,
            document_template:document_template_id (
              title,
              description
            )
          `)
          .eq('project_template_id', templateId)
          .order('sequence_order')

        if (docsError) throw docsError

        setTemplate({
          ...templateData,
          documents: docsData
        })
      } catch (error) {
        console.error('Error fetching template info:', error)
      }
    }

    if (templateId) {
      fetchTemplateInfo()
    }
  }, [templateId])

  if (!template) return null

  return (
    <div className="mt-2 space-y-3">
      <p className="text-sm text-blue-700">{template.description}</p>
      
      {template.documents?.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-xs font-medium text-blue-900">Required Documents:</h5>
          <div className="space-y-2">
            {template.documents.map((doc) => (
              <div 
                key={doc.id}
                className="flex items-start gap-2 text-sm"
              >
                <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">{doc.document_template.title}</p>
                  {doc.document_template.description && (
                    <p className="text-xs text-blue-700">{doc.document_template.description}</p>
                  )}
                </div>
                {doc.is_required && (
                  <AlertCircle className="h-4 w-4 text-blue-600 ml-auto mt-0.5" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
