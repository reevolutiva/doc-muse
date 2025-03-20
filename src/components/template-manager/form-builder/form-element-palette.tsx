"use client"

import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { FormField } from './form-builder'

interface FormElementPaletteProps {
  onAddField: (field: FormField) => void
}

const elementTypes = [
  { type: 'text', label: 'Text Input' },
  { type: 'number', label: 'Number Input' },
  { type: 'date', label: 'Date Input' },
  { type: 'select', label: 'Dropdown' },
  { type: 'checkbox', label: 'Checkbox' },
  { type: 'radio', label: 'Radio Group' }
] as const

export function FormElementPalette({ onAddField }: FormElementPaletteProps) {
  const handleAddField = (type: FormField['type']) => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      type,
      label: `New ${type} field`,
      required: false,
      options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2'] : undefined
    }
    onAddField(newField)
  }

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="font-medium text-gray-900 mb-4">Form Elements</h3>
      <div className="space-y-2">
        {elementTypes.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => handleAddField(type)}
            className="flex items-center gap-2 w-full p-2 text-sm text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
