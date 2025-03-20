"use client"

import { useState, useEffect } from "react"
import { Plus, Database, X } from "lucide-react"
import { useTemplates } from "@/lib/hooks/useTemplates"
import { Button } from "@/components/ui/button"
import { ProjectTemplateList } from "./project-template-list"
import { DocumentTemplateSelector } from "./document-template-selector"
import { DocumentDependencyEditor } from "./document-dependency-editor"
import * as Dialog from '@radix-ui/react-dialog'
import { Template } from "@/lib/types/template"

interface ProjectTemplateManagerProps {
  onSelect?: (template: Template) => void
  mode?: "select" | "manage"
  type?: string
}

export function ProjectTemplateManager({ onSelect, mode = "manage", type = "project" }: ProjectTemplateManagerProps) {
  const { templateData: templates, loading, error } = useTemplates(undefined, type as 'document' | 'project')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [showDocumentSelector, setShowDocumentSelector] = useState(false)
  const [showDependencyEditor, setShowDependencyEditor] = useState(false)

  useEffect(() => {
    
    console.log("templates" , templates);
    
  }, [templates]);
  
  return (
    <div>
      {mode === "manage" && (
        <div className="flex justify-end mb-6">
          <Button
            onClick={() => setShowDocumentSelector(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Documents
          </Button>
        </div>
      )}

      <ProjectTemplateList
        templates={templates || []}
        loading={loading}
        error={error}
        onEdit={(template) => setSelectedTemplate(template)}
        onPreview={(template) => setSelectedTemplate(template)}
        typeFilter={type}
      />

      {/* Document Selector Dialog */}
      <Dialog.Root
        open={showDocumentSelector}
        onOpenChange={setShowDocumentSelector}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-xl font-semibold">
                Add Documents to Template
              </Dialog.Title>
              <Dialog.Close className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </Dialog.Close>
            </div>

            {selectedTemplate && (
              <DocumentTemplateSelector
                template={selectedTemplate}
                onCancel={() => {
                  setShowDocumentSelector(false)
                  setSelectedTemplate(null)
                }}
                onSave={() => {
                  setShowDocumentSelector(false)
                  setSelectedTemplate(null)
                }}
              />
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Dependency Editor Dialog */}
      <Dialog.Root
        open={showDependencyEditor}
        onOpenChange={setShowDependencyEditor}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-xl font-semibold">
                Edit Document Dependencies
              </Dialog.Title>
              <Dialog.Close className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </Dialog.Close>
            </div>

            {selectedTemplate && (
              <DocumentDependencyEditor
                template={selectedTemplate}
                onCancel={() => {
                  setShowDependencyEditor(false)
                  setSelectedTemplate(null)
                }}
                onSave={() => {
                  setShowDependencyEditor(false)
                  setSelectedTemplate(null)
                }}
              />
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}