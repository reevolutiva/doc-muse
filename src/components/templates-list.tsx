"use client"

import { useMemo } from "react"
import { FileText, Plus, Loader2 } from "lucide-react"
import { useDocumentGeneration } from "@/lib/hooks/useDocumentGeneration"
import { useTemplates } from "@/lib/hooks/useTemplates"
import type { TemplatesListProps, Template, TemplateListItem } from "@/lib/types/template"

interface TemplateItemProps {
  template: Template
  onSelect: (template: Template) => void
  isGenerating: boolean
}

function TemplateItem({ template, onSelect, isGenerating }: TemplateItemProps) {
  return (
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
        onClick={() => onSelect(template)}
        disabled={isGenerating}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ml-2 flex-shrink-0 disabled:opacity-50"
        title="Create document from template"
      >
        {isGenerating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </button>
    </div>
  )
}

export function TemplatesList({ projectId, onSuccess }: TemplatesListProps) {
  const { isGenerating } = useDocumentGeneration()
  const { templateData, loading, createDocument } = useTemplates(projectId)
  const templates = useMemo(() => {
    if (!templateData) return []
    
    return templateData.map(item => ({
      id: item.document_templates.id,
      title: item.document_templates.title,
      description: item.document_templates.description,
      content: item.document_templates.content,
      is_required: item.is_required,
      sequence_order: item.sequence_order
    }))
  }, [templateData])

  const handleCreateDocument = async (template: TemplateListItem) => {
    try {
      await createDocument(template)
      onSuccess?.()
    } catch (error) {
      // Error is already handled by the hook
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
