"use client"
import { useState, useEffect } from "react"
import { X, Plus, Search, Loader2, SortAsc } from "lucide-react"
import * as Dialog from '@radix-ui/react-dialog'
import { supabase } from "@/lib/supabase"
import { ProjectTemplate } from "@/lib/types/project-template"
import { ProjectTemplateService } from "@/lib/services/project-template-service"
import { toast } from "sonner"

interface DocumentTemplate {
  id: string
  title: string
  description: string | null
  created_at: string
}

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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [documentTemplates, setDocumentTemplates] = useState<DocumentTemplate[]>([])
  const [selectedTemplates, setSelectedTemplates] = useState<{
    [key: string]: { 
      id: string
      title: string
      isRequired: boolean
      order: number
    }
  }>({})
  
  // Cargar plantillas de documento disponibles
  useEffect(() => {
    const fetchDocumentTemplates = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('document_templates')
          .select('id, title, description, created_at')
          .order('title')
        
        if (error) throw error
        setDocumentTemplates(data || [])
      } catch (error) {
        console.error('Error fetching document templates:', error)
        toast.error('Error al cargar las plantillas de documento')
      } finally {
        setLoading(false)
      }
    }

    fetchDocumentTemplates()
  }, [])

  // Filtrar plantillas según la búsqueda
  const filteredTemplates = documentTemplates.filter(template => 
    template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (template.description && template.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleSelectTemplate = (template: DocumentTemplate) => {
    setSelectedTemplates(prev => {
      // Si ya está seleccionada, la quitamos
      if (prev[template.id]) {
        const { [template.id]: removed, ...rest } = prev
        return rest
      }
      
      // Si no, la agregamos con valores predeterminados
      return {
        ...prev,
        [template.id]: {
          id: template.id,
          title: template.title,
          isRequired: false,
          order: Object.keys(prev).length + 1
        }
      }
    })
  }

  const handleToggleRequired = (templateId: string) => {
    setSelectedTemplates(prev => ({
      ...prev,
      [templateId]: {
        ...prev[templateId],
        isRequired: !prev[templateId].isRequired
      }
    }))
  }

  const handleUpdateOrder = (templateId: string, newOrder: number) => {
    // Asegurarse de que el orden sea válido
    if (newOrder < 1) newOrder = 1
    if (newOrder > Object.keys(selectedTemplates).length) {
      newOrder = Object.keys(selectedTemplates).length
    }

    // Actualizar el orden de la plantilla seleccionada
    setSelectedTemplates(prev => {
      const currentOrder = prev[templateId].order
      
      // Si el orden no cambió, no hacemos nada
      if (currentOrder === newOrder) return prev
      
      // Crear un nuevo objeto con los órdenes actualizados
      const updated = { ...prev }
      
      // Ajustar el orden de las demás plantillas
      if (newOrder > currentOrder) {
        // Si movemos hacia abajo, decrementamos todos los que están entre el orden actual y el nuevo
        Object.keys(updated).forEach(key => {
          if (updated[key].order > currentOrder && updated[key].order <= newOrder) {
            updated[key].order--
          }
        })
      } else {
        // Si movemos hacia arriba, incrementamos todos los que están entre el nuevo orden y el actual
        Object.keys(updated).forEach(key => {
          if (updated[key].order >= newOrder && updated[key].order < currentOrder) {
            updated[key].order++
          }
        })
      }
      
      // Actualizar el orden de la plantilla seleccionada
      updated[templateId].order = newOrder
      
      return updated
    })
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      // Convertir el objeto de plantillas seleccionadas a un array
      const selectedArray = Object.values(selectedTemplates).sort((a, b) => a.order - b.order)
      
      // Crear las relaciones en la base de datos
      for (let i = 0; i < selectedArray.length; i++) {
        const template = selectedArray[i]
        const { error } = await ProjectTemplateService.addDocumentToTemplate(
          projectTemplate.id,
          template.id,
          template.isRequired,
          i + 1 // Para asegurar que el orden sea secuencial
        )
        
        if (error) throw error
      }
      
      toast.success('Documentos agregados correctamente')
      onDocumentsAdded()
    } catch (error) {
      console.error('Error adding documents to template:', error)
      toast.error('Error al agregar documentos a la plantilla')
    } finally {
      setSaving(false)
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

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No se encontraron plantillas de documento
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTemplates.map(template => {
                const isSelected = !!selectedTemplates[template.id]
                
                return (
                  <div 
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
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
              {Object.keys(selectedTemplates).length} seleccionados
            </span>
          </div>
          
          {Object.keys(selectedTemplates).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500 border-2 border-dashed rounded-lg border-gray-300 h-48">
              <Plus className="w-8 h-8 mb-2" />
              <p>Selecciona plantillas de documento</p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.values(selectedTemplates)
                .sort((a, b) => a.order - b.order)
                .map(template => (
                  <div key={template.id} className="bg-white border rounded-md p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{template.title}</h3>
                      <button
                        onClick={() => handleSelectTemplate({ id: template.id } as DocumentTemplate)}
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
                            onChange={() => handleToggleRequired(template.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>Requerido</span>
                        </label>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <SortAsc className="w-4 h-4 text-gray-500" />
                        <input
                          type="number"
                          value={template.order}
                          onChange={(e) => handleUpdateOrder(template.id, parseInt(e.target.value))}
                          min="1"
                          max={Object.keys(selectedTemplates).length}
                          className="w-14 py-1 px-2 border rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))
              }
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
          disabled={Object.keys(selectedTemplates).length === 0 || saving}
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

// Componente Check para el icono de checkmark
function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}