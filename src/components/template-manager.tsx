"use client"

import { useState } from "react"
import { Plus, Loader2, Database } from "lucide-react"
import { DatabaseFormGenerator } from "./template-manager/form-generator/database-form-generator"
import { toast } from "sonner"
import * as Dialog from '@radix-ui/react-dialog'
import { TemplateForm } from "./template-manager/template-form"
import { TemplateListItem } from "./template-manager/components/template-list-item" 
import { TemplatePreviewDialog } from "./template-manager/components/template-preview-dialog"
import { useTemplateManager } from "@/lib/hooks/useTemplateManager"
import type { Template } from "./template-manager/types"

interface TemplateManagerProps {
  onSelect?: (template: Template) => void
  mode?: "select" | "manage"
}

export function TemplateManager({ onSelect, mode = "manage" }: TemplateManagerProps) {
  const {
    templates,
    showDialog,
    editingTemplate,
    loading,
    setShowDialog,
    setEditingTemplate,
    handleSaveTemplate,
    handleDelete,
  } = useTemplateManager()
  
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const [showFormDialog, setShowFormDialog] = useState(false)

  return (
    <div className="relative">
      <Dialog.Root open={showDialog} onOpenChange={setShowDialog}>
        <Dialog.Trigger asChild>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowDialog(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Template
                </>
              )}
            </button>
            <button
              onClick={() => setShowFormDialog(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Database className="w-4 h-4" />
              Generate from DB
            </button>
          </div>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <TemplateForm
            onClose={() => setShowDialog(false)}
            onSave={handleSaveTemplate}
            initialData={editingTemplate ?? undefined}
            mode={editingTemplate ? 'edit' : 'create'}
          />
        </Dialog.Portal>
      </Dialog.Root>

      <div className="mt-4 space-y-2">
        {templates.map((template) => (
          <TemplateListItem
            key={template.id}
            template={template}
            mode={mode}
            onSelect={onSelect}
            onEdit={(template: Template) => {
              setEditingTemplate(template)
              setShowDialog(true)
            }}
            onPreview={setPreviewTemplate}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <TemplatePreviewDialog
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
      />

      {showFormDialog && (
        <Dialog.Root open={showFormDialog} onOpenChange={setShowFormDialog}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <DatabaseFormGenerator
                onClose={() => setShowFormDialog(false)}
                onSave={handleSaveTemplate}
              />
            </div>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </div>
  )
}
