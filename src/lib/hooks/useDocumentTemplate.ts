"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface UseDocumentTemplateOptions {
  projectId: string
  templateId?: string | null
}

export function useDocumentTemplate({ projectId, templateId }: UseDocumentTemplateOptions) {
  const [availableDocTypes, setAvailableDocTypes] = useState<string[]>([])
  const [requiredDocs, setRequiredDocs] = useState<{[key: string]: boolean}>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTemplateDocuments = async () => {
      if (!templateId) {
        setAvailableDocTypes([])
        setRequiredDocs({})
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('project_template_doc_templates')
          .select(`
            document_template_id,
            is_required
          `)
          .eq('project_template_id', templateId)
          .order('sequence_order')

        if (error) throw error

        const docIds = data.map((d: { document_template_id: string }) => d.document_template_id)
        setAvailableDocTypes(docIds)
        
        const required = data.reduce((acc: {[key: string]: boolean}, curr) => {
          acc[curr.document_template_id] = curr.is_required
          return acc
        }, {})
        setRequiredDocs(required)
      } catch (error) {
        console.error('Error fetching template documents:', error)
        toast.error('Failed to load template documents')
      } finally {
        setLoading(false)
      }
    }

    fetchTemplateDocuments()
  }, [templateId])

  return {
    availableDocTypes,
    requiredDocs,
    loading
  }
}
