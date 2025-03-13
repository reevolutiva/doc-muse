"use client"

import { useState } from 'react'
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { FormElement } from './form-element'
import { FormElementPalette } from './form-element-palette'
import { FormPreview } from './form-preview'
import { useTemplateOperations } from '@/lib/hooks/useTemplateOperations'
import { toast } from 'sonner'

export interface FormField {
  id: string
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'radio'
  label: string
  required: boolean
  options?: string[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

export function FormBuilder() {
  const [fields, setFields] = useState<FormField[]>([])
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor')
  const { saveTemplate } = useTemplateOperations()
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const oldIndex = fields.findIndex(f => f.id === active.id)
    const newIndex = fields.findIndex(f => f.id === over.id)

    const newFields = [...fields]
    const [removed] = newFields.splice(oldIndex, 1)
    newFields.splice(newIndex, 0, removed)
    setFields(newFields)
  }

import type { Template } from '@/lib/types/template'

export function FormBuilder() {
  // ... rest of the code ...

  const handleSave = async () => {
    try {
      const template: Omit<Template, 'id' | 'created_at' | 'updated_at'> = {
        id: crypto.randomUUID(),
        title: 'Form Template',
        description: 'Custom form template',
        content: JSON.stringify({
          time: Date.now(),
          blocks: fields.map(field => ({
            blockId: field.id,
            type: 'form-field',
            data: field,
            description: `Form field: ${field.label}`,
            system: ''
          })),
          version: '1.0.0'
        }),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      await saveTemplate(template)
      toast.success('Form template saved successfully')
    } catch (error) {
      toast.error('Failed to save form template')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'editor' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'preview'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Preview
          </button>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Template
        </button>
      </div>

      {activeTab === 'editor' ? (
        <div className="grid grid-cols-[300px_1fr] gap-6">
          <FormElementPalette onAddField={(field) => setFields([...fields, field])} />
          
          <div className="border rounded-lg p-6 bg-white">
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={fields} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {fields.map((field) => (
                    <FormElement
                      key={field.id}
                      field={field}
                      onUpdate={(updated) => {
                        setFields(fields.map(f => 
                          f.id === updated.id ? updated : f
                        ))
                      }}
                      onDelete={(id) => {
                        setFields(fields.filter(f => f.id !== id))
                      }}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {fields.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Drag and drop form elements here to build your form
              </div>
            )}
          </div>
        </div>
      ) : (
        <FormPreview fields={fields} />
      )}
    </div>
  )
}
