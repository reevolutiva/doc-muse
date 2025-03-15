"use client"

import { X, Plus, Search, Check, Loader2 } from "lucide-react"
import * as Dialog from '@radix-ui/react-dialog'
import { ProjectTemplate } from "@/lib/types/project-template"
import { ProjectTemplateService } from "@/lib/services/project-template-service"
import { useDocumentTemplates } from "@/lib/hooks/useDocumentTemplates"
import { useLoadingState } from "@/lib/hooks/useLoadingState"
import { useSelectedDocuments } from "@/lib/hooks/useSelectedDocuments"
import { handleError } from "@/lib/utils/error-handler"

interface DocumentTemplateSelectorProps {
  projectTemplate: ProjectTemplate
  onClose: () => void
  onDocumentsAdded: () => void
}

export function DocumentTemplateSelector({ 
  projectTemplate, 
  onClose, 
  onDocumentsAdded 
}: DocumentTemplateSelectorProps) {
  const { templates, searchQuery, setSearchQuery, loading: loadingTemplates } = useDocumentTemplates()
  const { saving, withLoading } = useLoadingState()
  const { 
    selectedDocuments,
    toggleDocument,
    toggleRequired,
    updateOrder,
    getSelectedArray
  } = useSelectedDocuments()

  const handleSave = async () => {
    try {
      await withLoading(async () => {
        const selectedArray = getSelectedArray()
      
        for (let i = 0; i < selectedArray.length; i++) {
          const template = selectedArray[i]
          const { error } = await ProjectTemplateService.addDocumentToTemplate(
            projectTemplate.id,
            template.id,
            template.isRequired,
            i + 1
          )
          
          if (error) throw error
        }
        onDocumentsAdded()
      }, 'saving')
    } catch (error) {
      handleError(error, {
        customMessage: 'Error al agregar documentos a la plantilla',
        context: 'DocumentTemplateSelector.handleSave'
      })
    }
  }

  return (
    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-white rounded-lg shadow-xl z-50 max-h-[80vh] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <Dialog.Title className="text-lg font-semibold">
          Agregar Documentos a "{projectTemplate.name}"
        </Dialog.Title>
        <Dialog.Close className="text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </Dialog.Close>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Lista de plantillas disponibles */}
        <div className="w-1/2 border-r p-4 overflow-y-auto">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar plantillas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {loadingTemplates ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No se encontraron plantillas de documento
            </div>
          ) : (
            <div className="space-y-2">
              {templates.map(template => {
                const isSelected = !!selectedDocuments[template.id]
                
                return (
                  <div 
                    key={template.id}
                    onClick={() => toggleDocument(template)}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm">{template.title}</h3>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-blue-600' : 'border border-gray-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                    {template.description && (
                      <p className="text-xs text-gray-500 mt-1 truncate">{template.description}</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
        
        {/* Lista de plantillas seleccionadas */}
        <div className="w-1/2 p-4 overflow-y-auto bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Documentos Seleccionados</h2>
            <span className="text-sm text-gray-500">
              {Object.keys(selectedDocuments).length} seleccionados
            </span>
          </div>
          
          {Object.keys(selectedDocuments).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500 border-2 border-dashed rounded-lg border-gray-300 h-48">
              <Plus className="w-8 h-8 mb-2" />
              <p>Selecciona plantillas de documento</p>
            </div>
          ) : (
            <div className="space-y-3">
              {getSelectedArray().map(template => (
                <div key={template.id} className="bg-white border rounded-md p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{template.title}</h3>
                    <button
                      onClick={() => toggleDocument(template)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={template.isRequired}
                          onChange={() => toggleRequired(template.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>Requerido</span>
                      </label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-gray-500" />
                      <input
                        type="number"
                        value={template.order}
                        onChange={(e) => updateOrder(template.id, parseInt(e.target.value))}
                        min="1"
                        max={Object.keys(selectedDocuments).length}
                        className="w-14 py-1 px-2 border rounded text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 mr-3"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={Object.keys(selectedDocuments).length === 0 || saving}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin w-4 h-4 mr-2" />
              Guardando...
            </>
          ) : (
            'Guardar Documentos'
          )}
        </button>
      </div>
    </Dialog.Content>
  )
}