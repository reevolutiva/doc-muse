"use client"

import { useState } from "react"
import { X, Save, Loader2 } from "lucide-react"
import * as Dialog from '@radix-ui/react-dialog'
import * as Tabs from '@radix-ui/react-tabs'
import { ProjectTemplateFormProps } from "@/lib/types/project-template"

export function ProjectTemplateForm({ onClose, onSave, initialData = {}, mode }: ProjectTemplateFormProps) {
  const [formState, setFormState] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    loading: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formState.name.trim()) {
      alert('Por favor ingresa un nombre para la plantilla')
      return
    }
    
    try {
      setFormState(prev => ({ ...prev, loading: true }))
      
      await onSave({
        name: formState.name,
        description: formState.description || null
      })
      
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setFormState(prev => ({ ...prev, loading: false }))
    }
  }

  return (
    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-lg shadow-xl z-50 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <Dialog.Title className="text-xl font-semibold">
            {mode === 'create' ? 'Crear Plantilla de Proyecto' : 'Editar Plantilla de Proyecto'}
          </Dialog.Title>
          <p className="text-gray-500 mt-1">
            {mode === 'create'
              ? 'Crea una plantilla reutilizable para proyectos con documentos predefinidos'
              : 'Modifica los detalles de la plantilla de proyecto'
            }
          </p>
        </div>
        <Dialog.Close className="text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-6 h-6" />
        </Dialog.Close>
      </div>
      
      <Tabs.Root defaultValue="details" className="w-full">
        <Tabs.List className="flex gap-4 mb-8 border-b p-6 pb-0">
          <Tabs.Trigger 
            value="details"
            className="px-4 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
          >
            Detalles
          </Tabs.Trigger>
          <Tabs.Trigger
            value="info"
            className="px-4 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
          >
            Información
          </Tabs.Trigger>
        </Tabs.List>
        
        <Tabs.Content value="details" className="p-6 pt-0 outline-none">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  id="name"
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  id="description"
                  value={formState.description}
                  onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="mr-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formState.loading}
                  className={`inline-flex items-center gap-2 rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50`}
                >
                  {formState.loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {mode === 'create' ? 'Crear Plantilla' : 'Actualizar Plantilla'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </Tabs.Content>
        
        <Tabs.Content value="info" className="p-6 pt-0 outline-none">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">¿Qué son las plantillas de proyecto?</h3>
            <p className="text-gray-600">
              Las plantillas de proyecto te permiten definir un conjunto de documentos que deben crearse para cada proyecto basado en esta plantilla.
              Esto facilita la estandarización de proyectos y asegura que todos los documentos necesarios estén incluidos.
            </p>
            
            <h3 className="text-lg font-semibold">¿Cómo usar las plantillas?</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Crea una plantilla con un nombre descriptivo</li>
              <li>Agrega documentos desde la biblioteca de plantillas de documentos</li>
              <li>Define cuáles son obligatorios y el orden sugerido</li>
              <li>Configura dependencias entre documentos si es necesario</li>
              <li>Utiliza la plantilla al crear nuevos proyectos</li>
            </ul>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </Dialog.Content>
  )
}