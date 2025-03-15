"use client"

import { FileText, Edit2, Eye, Trash2, AlertCircle } from "lucide-react"
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import type { Template } from "./types"

interface TemplateListProps {
  templates: Template[]
  onEdit: (template: Template) => void
  onPreview: (template: Template) => void
  onDelete: (id: string) => void
  mode?: "select" | "manage"
  onSelect?: (template: Template) => void
  loading?: boolean
  error?: Error | null
  typeFilter?: 'document' | 'project' | 'section'
}

export function TemplateList({
  templates,
  onEdit,
  onPreview,
  onDelete,
  mode = "manage",
  onSelect,
  loading,
  error,
  typeFilter
}: TemplateListProps) {
  const filteredTemplates = typeFilter 
    ? templates.filter(template => template.type === typeFilter)
    : templates;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Templates</h3>
        <p className="text-gray-500 max-w-md">
          {error.message || "An error occurred while loading templates. Please try again."}
        </p>
      </div>
    )
  }

  if (filteredTemplates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Templates Found</h3>
        <p className="text-gray-500">
          {typeFilter ? `No ${typeFilter} templates found.` : 'Get started by creating your first template.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {filteredTemplates.map((template) => (
        <div
          key={template.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center justify-between flex-1">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => mode === "select" && onSelect?.(template)}
            >
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium">{template.title}</p>
                {template.description && (
                  <p className="text-sm text-gray-500">{template.description}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => onPreview(template)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {mode === "manage" && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(template)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <AlertDialog.Root>
                <AlertDialog.Trigger asChild>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </AlertDialog.Trigger>

                <AlertDialog.Portal>
                  <AlertDialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                  <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-xl p-6">
                    <AlertDialog.Title className="text-lg font-semibold mb-2">
                      Delete Template
                    </AlertDialog.Title>
                    <AlertDialog.Description className="text-gray-600 mb-4">
                      Are you sure you want to delete this template? This action cannot be undone.
                    </AlertDialog.Description>

                    <div className="flex justify-end gap-3">
                      <AlertDialog.Cancel asChild>
                        <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700">
                          Cancel
                        </button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action asChild>
                        <button
                          onClick={() => onDelete(template.id)}
                          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </AlertDialog.Action>
                    </div>
                  </AlertDialog.Content>
                </AlertDialog.Portal>
              </AlertDialog.Root>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
