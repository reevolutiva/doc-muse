"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { X, Loader2, Save } from "lucide-react"
import * as Dialog from '@radix-ui/react-dialog'
import { ProjectTemplate, DocumentDependencyEditorProps } from "@/lib/types/project-template"
import { ProjectTemplateService } from "@/lib/services/project-template-service"
import { useDependencyManagement } from "@/lib/hooks/useDependencyManagement"

export function DocumentDependencyEditor({ 
  projectTemplate, 
  onSave, 
  onClose 
}: DocumentDependencyEditorProps) {
  const [initialLoading, setInitialLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Extraer los documentos de la plantilla y memorizarlos
  const documents = useMemo(() => projectTemplate.documents || [], [projectTemplate.documents])
  
  const {
    dependencies,
    loading: savingDependencies,
    toggleDependency,
    updateDependencyType,
    updateDependencyNotes,
    saveDependencies
  } = useDependencyManagement([])
  
  // Cargar dependencias existentes
  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        setInitialLoading(true)
        const documentIds = documents.map(doc => doc.document_template_id)
        const allDependencies = []
        
        for (const docId of documentIds) {
          const { data, error } = await ProjectTemplateService.getDocumentDependencies(docId)
          if (error) throw error
          
          const relevantDependencies = data.filter(dep => 
            documentIds.includes(dep.target_id)
          )
          
          allDependencies.push(...relevantDependencies)
        }
        
        // Inicializar el estado de dependencias
        toggleDependency(...allDependencies)
      } catch (error) {
        console.error('Error fetching dependencies:', error)
      } finally {
        setInitialLoading(false)
      }
    }
    
    if (documents.length > 0) {
      fetchDependencies()
    } else {
      setInitialLoading(false)
    }
  }, [documents, toggleDependency])
  
  // Funciones memorizadas para verificaciones de dependencias
  const hasDependency = useCallback((sourceId: string, targetId: string): boolean => {
    return dependencies.some(dep => 
      dep.source_id === sourceId && dep.target_id === targetId
    )
  }, [dependencies])
  
  const getDependencyType = useCallback((sourceId: string, targetId: string): 'required' | 'optional' => {
    const dependency = dependencies.find(dep => 
      dep.source_id === sourceId && dep.target_id === targetId
    )
    return dependency ? dependency.dependency_type : 'optional'
  }, [dependencies])
  
  // Obtener el título del documento (memorizado)
  const getDocumentTitle = useCallback((documentId: string): string => {
    const doc = documents.find(d => d.document_template_id === documentId)
    return doc ? doc.document_template.title : 'Documento desconocido'
  }, [documents])
  
  // Manejar guardado
  const handleSave = async () => {
    try {
      setSaving(true)
      const success = await saveDependencies()
      if (success) {
        onSave()
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white rounded-lg shadow-xl z-50 max-h-[80vh] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <Dialog.Title className="text-xl font-semibold">
            Dependencias entre Documentos
          </Dialog.Title>
          <Dialog.Description className="text-gray-600 mt-1">
            Define qué documentos dependen de otros en la plantilla "{projectTemplate.name}"
          </Dialog.Description>
        </div>
        <Dialog.Close className="text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-6 h-6" />
        </Dialog.Close>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        {initialLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
          </div>
        ) : documents.length < 2 ? (
          <div className="text-center py-8 text-gray-500">
            Se necesitan al menos 2 documentos para definir dependencias
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-gray-600">
              Una dependencia significa que un documento (fuente) necesita información de otro documento (objetivo) para completarse.
              Haz clic en las celdas para establecer o eliminar dependencias.
            </p>

            {/* Matriz de dependencias */}
            <div className="border rounded-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 border-r">
                      Fuente ↓ / Objetivo →
                    </th>
                    {documents.map((doc) => (
                      <th 
                        key={doc.document_template_id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        title={doc.document_template.description || undefined}
                      >
                        {doc.document_template.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {documents.map((sourceDoc) => (
                    <tr key={sourceDoc.document_template_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10 border-r">
                        {sourceDoc.document_template.title}
                      </td>
                      {documents.map((targetDoc) => {
                        const isSelf = sourceDoc.document_template_id === targetDoc.document_template_id
                        const hasDepend = hasDependency(sourceDoc.document_template_id, targetDoc.document_template_id)
                        const dependType = getDependencyType(sourceDoc.document_template_id, targetDoc.document_template_id)
                        
                        return (
                          <td 
                            key={targetDoc.document_template_id}
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              isSelf 
                                ? 'bg-gray-100' 
                                : 'cursor-pointer hover:bg-gray-50'
                            }`}
                            onClick={() => {
                              if (!isSelf) {
                                toggleDependency(
                                  sourceDoc.document_template_id, 
                                  targetDoc.document_template_id
                                )
                              }
                            }}
                          >
                            {isSelf ? (
                              <span className="text-gray-400">-</span>
                            ) : hasDepend ? (
                              <div className="flex flex-col items-start gap-2">
                                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                  dependType === 'required' 
                                    ? 'bg-red-100 text-red-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {dependType === 'required' ? 'Requerido' : 'Opcional'}
                                </span>
                                <select
                                  value={dependType}
                                  onChange={(e) => updateDependencyType(
                                    sourceDoc.document_template_id,
                                    targetDoc.document_template_id,
                                    e.target.value as 'required' | 'optional'
                                  )}
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-xs border rounded px-1 py-0.5"
                                >
                                  <option value="required">Requerido</option>
                                  <option value="optional">Opcional</option>
                                </select>
                              </div>
                            ) : (
                              <span className="text-gray-300">Sin dependencia</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Notas para las dependencias seleccionadas */}
            {dependencies.length > 0 && (
              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-medium">Notas de Dependencia</h3>
                
                {dependencies.map((dep, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-medium">{getDocumentTitle(dep.source_id)}</span>
                        {" depende de "}
                        <span className="font-medium">{getDocumentTitle(dep.target_id)}</span>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        dep.dependency_type === 'required' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {dep.dependency_type === 'required' ? 'Requerido' : 'Opcional'}
                      </span>
                    </div>
                    
                    <textarea
                      value={dep.notes || ''}
                      onChange={(e) => updateDependencyNotes(
                        dep.source_id,
                        dep.target_id,
                        e.target.value
                      )}
                      placeholder="Agregar notas sobre esta dependencia (opcional)"
                      className="w-full border rounded-md p-2 text-sm"
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
          disabled={saving || savingDependencies}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {saving || savingDependencies ? (
            <>
              <Loader2 className="animate-spin w-4 h-4 mr-2" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Guardar Dependencias
            </>
          )}
        </button>
      </div>
    </Dialog.Content>
  )
}