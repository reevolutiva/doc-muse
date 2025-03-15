"use client"

import { useState } from "react"
import { Plus, Database, X, FileText } from "lucide-react"
import { useProjectTemplates } from "@/lib/hooks/useProjectTemplates"
import { ProjectTemplateForm } from "./project-template-form"
import { ProjectTemplateList } from "./project-template-list"
import { DocumentTemplateSelector } from "./document-template-selector"
import { DocumentDependencyEditor } from "./document-dependency-editor"
import * as Dialog from '@radix-ui/react-dialog'
import { ProjectTemplate, ProjectTemplateManagerProps } from "@/lib/types/project-template"

export function ProjectTemplateManager({ onSelect, mode = "manage", typeFilter }: ProjectTemplateManagerProps) {
  const {
    templates,
    loading,
    error,
    showDialog,
    editingTemplate,
    setShowDialog,
    setEditingTemplate,
    handleSaveTemplate,
    handleDelete,
    fetchTemplates
  } = useProjectTemplates()

  const [previewTemplate, setPreviewTemplate] = useState<ProjectTemplate | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null)
  const [showDocumentSelector, setShowDocumentSelector] = useState(false)
  const [showDependencyEditor, setShowDependencyEditor] = useState(false)

  return (
    <div>
      {/* Encabezado con acciones */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Plantillas de Proyecto</h2>
          <p className="text-gray-500">
            Gestiona las plantillas reutilizables para tus proyectos
          </p>
        </div>
        
        {mode === "manage" && (
          <div className="flex gap-3">
            <button
              onClick={() => setShowDialog(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Crear Plantilla
            </button>
          </div>
        )}
      </div>

      {/* Lista de plantillas */}
      <ProjectTemplateList
        templates={templates}
        loading={loading}
        error={error}
        onEdit={(template) => {
          setEditingTemplate(template)
          setShowDialog(true)
        }}
        onPreview={setPreviewTemplate}
        onDelete={handleDelete}
        typeFilter={typeFilter}
      />

      {/* Modal para crear/editar plantillas */}
      <Dialog.Root 
        open={showDialog} 
        onOpenChange={setShowDialog}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <ProjectTemplateForm
            onClose={() => {
              setShowDialog(false)
              setEditingTemplate(null)
            }}
            onSave={handleSaveTemplate}
            initialData={editingTemplate || undefined}
            mode={editingTemplate ? 'edit' : 'create'}
          />
        </Dialog.Portal>
      </Dialog.Root>

      {/* Modal para previsualizar plantillas */}
      <Dialog.Root 
        open={!!previewTemplate} 
        onOpenChange={(open) => !open && setPreviewTemplate(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-white rounded-lg shadow-xl z-50 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <Dialog.Title className="text-xl font-semibold">
                  {previewTemplate?.name}
                </Dialog.Title>
                {previewTemplate?.description && (
                  <Dialog.Description className="text-gray-600 mt-1">
                    {previewTemplate.description}
                  </Dialog.Description>
                )}
              </div>
              <Dialog.Close className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </Dialog.Close>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Documentos</h3>
                  
                  {mode === "manage" && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedTemplate(previewTemplate)
                          setShowDocumentSelector(true)
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Agregar Documentos
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedTemplate(previewTemplate)
                          setShowDependencyEditor(true)
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={!previewTemplate?.documents?.length || previewTemplate.documents.length < 2}
                      >
                        <Database className="w-4 h-4" />
                        Editar Dependencias
                      </button>
                    </div>
                  )}
                </div>

                {previewTemplate?.documents && previewTemplate.documents.length > 0 ? (
                  <div className="space-y-3">
                    {previewTemplate.documents
                      .sort((a, b) => a.sequence_order - b.sequence_order)
                      .map((doc) => (
                        <div 
                          key={doc.id} 
                          className="flex items-center gap-3 p-4 bg-white border rounded-lg"
                        >
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{doc.document_template.title}</h4>
                            {doc.document_template.description && (
                              <p className="text-sm text-gray-500">{doc.document_template.description}</p>
                            )}
                          </div>
                          <div className="ml-auto flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              Orden: {doc.sequence_order}
                            </span>
                            {doc.is_required && (
                              <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                Requerido
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-lg border-dashed text-gray-500">
                    No hay documentos agregados a esta plantilla
                  </div>
                )}
              </div>
            </div>

            {mode === "select" && (
              <div className="p-6 border-t">
                <button
                  onClick={() => {
                    onSelect?.(previewTemplate!)
                    setPreviewTemplate(null)
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Seleccionar esta plantilla
                </button>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Modal para agregar documentos */}
      {selectedTemplate && (
        <Dialog.Root 
          open={showDocumentSelector} 
          onOpenChange={setShowDocumentSelector}
        >
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
            <DocumentTemplateSelector
              projectTemplate={selectedTemplate}
              onClose={() => {
                setShowDocumentSelector(false)
                setSelectedTemplate(null)
              }}
              onDocumentsAdded={async () => {
                await fetchTemplates()
                setShowDocumentSelector(false)
                
                // Actualizar la previsualización con los nuevos datos
                if (previewTemplate && previewTemplate.id === selectedTemplate.id) {
                  const { data } = await ProjectTemplateService.getProjectTemplateById(selectedTemplate.id)
                  if (data) {
                    setPreviewTemplate(data)
                  }
                }
                
                setSelectedTemplate(null)
              }}
            />
          </Dialog.Portal>
        </Dialog.Root>
      )}

      {/* Modal para editar dependencias */}
      {selectedTemplate && (
        <Dialog.Root 
          open={showDependencyEditor} 
          onOpenChange={setShowDependencyEditor}
        >
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
            <DocumentDependencyEditor
              projectTemplate={selectedTemplate}
              onClose={() => {
                setShowDependencyEditor(false)
                setSelectedTemplate(null)
              }}
              onSave={async () => {
                await fetchTemplates()
                setShowDependencyEditor(false)
                setSelectedTemplate(null)
              }}
            />
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </div>
  )
}

// Importar el servicio para obtener detalles actualizados de las plantillas
import { ProjectTemplateService } from "@/lib/services/project-template-service"