"use client"

import { FileText, Edit2, Eye, Trash2, AlertCircle } from "lucide-react"
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { ProjectTemplate, ProjectTemplateListProps } from "@/lib/types/project-template"

interface ExtendedProjectTemplateListProps extends ProjectTemplateListProps {
  typeFilter?: string
}

export function ProjectTemplateList({
  templates,
  onEdit,
  onPreview,
  onDelete,
  loading = false,
  error = null,
  typeFilter
}: ExtendedProjectTemplateListProps) {
  // Filtrar las plantillas por tipo si se proporciona un filtro

  let filteredTemplates = templates

  if( typeFilter === 'document' ) {
    filteredTemplates = typeFilter
    ? templates.filter(template => template.type === typeFilter)
    : templates

  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <p className="text-red-700">
              Error al cargar las plantillas: {error.message}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (filteredTemplates.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {typeFilter 
          ? `No hay plantillas disponibles para el tipo "${typeFilter}"`
          : "No hay plantillas de proyecto disponibles. Crea tu primera plantilla haciendo clic en 'Crear Plantilla'."
        }
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {filteredTemplates.map((template) => (
        <div 
          key={template.id} 
          className="flex items-center justify-between p-4 bg-white border rounded-lg hover:border-blue-200 transition-colors"
        >
          <div className="flex flex-grow items-center gap-3 overflow-hidden">
            <div 
              className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center"
            >
              <FileText className="h-5 w-5 text-blue-600" />
            </div>

            <div className="overflow-hidden">
              <h3 className="font-medium truncate">{template.name}</h3>
              {template.description && (
                <p className="text-sm text-gray-500 truncate">{template.description}</p>
              )}
            </div>
            
            <div className="ml-4 text-sm flex items-center">
              {template.documents && (
                <span className="text-gray-500">
                  {template.documents.length} {template.documents.length === 1 ? 'documento' : 'documentos'}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onPreview(template)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Ver detalles"
            >
              <Eye className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => onEdit(template)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            
            <AlertDialog.Root>
              <AlertDialog.Trigger asChild>
                <button 
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </AlertDialog.Trigger>
              
              <AlertDialog.Portal>
                <AlertDialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
                <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-xl p-6 z-50">
                  <AlertDialog.Title className="text-lg font-semibold mb-2">
                    Eliminar Plantilla
                  </AlertDialog.Title>
                  <AlertDialog.Description className="text-gray-600 mb-4">
                    ¿Estás seguro que deseas eliminar esta plantilla? Esta acción no se puede deshacer y
                    también eliminará todas las dependencias y configuraciones asociadas.
                  </AlertDialog.Description>

                  <div className="flex justify-end gap-3">
                    <AlertDialog.Cancel asChild>
                      <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700">
                        Cancelar
                      </button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                      <button
                        onClick={() => onDelete(template.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                      >
                        Eliminar
                      </button>
                    </AlertDialog.Action>
                  </div>
                </AlertDialog.Content>
              </AlertDialog.Portal>
            </AlertDialog.Root>
          </div>
        </div>
      ))}
    </div>
  )
}