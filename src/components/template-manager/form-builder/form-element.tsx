"use client"

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X, Settings } from 'lucide-react'
import { useState } from 'react'
import type { FormField } from './form-builder'

interface FormElementProps {
  field: FormField
  onUpdate: (field: FormField) => void
  onDelete: (id: string) => void
}

export function FormElement({ field, onUpdate, onDelete }: FormElementProps) {
  const [showSettings, setShowSettings] = useState(false)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg group relative"
    >
      <button
        {...attributes}
        {...listeners}
        className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(field.id)}
              className="p-1 text-gray-400 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {field.type === 'text' && (
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder={`Enter ${field.label.toLowerCase()}`}
            disabled
          />
        )}

        {field.type === 'number' && (
          <input
            type="number"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="0"
            disabled
          />
        )}

        {field.type === 'date' && (
          <input
            type="date"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled
          />
        )}

        {field.type === 'select' && (
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}

        {field.type === 'checkbox' && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled
            />
            <span className="text-sm text-gray-600">
              {field.label}
            </span>
          </div>
        )}

        {field.type === 'radio' && (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={field.id}
                  className="border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled
                />
                <span className="text-sm text-gray-600">{option}</span>
              </div>
            ))}
          </div>
        )}

        {showSettings && (
          <div className="mt-4 p-4 bg-white border rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Label
              </label>
              <input
                type="text"
                value={field.label}
                onChange={(e) => onUpdate({ ...field, label: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => onUpdate({ ...field, required: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="text-sm text-gray-600">Required field</label>
            </div>

            {(field.type === 'select' || field.type === 'radio') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Options (one per line)
                </label>
                <textarea
                  value={field.options?.join('\n')}
                  onChange={(e) => onUpdate({
                    ...field,
                    options: e.target.value.split('\n').filter(Boolean)
                  })}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}

            {(field.type === 'text' || field.type === 'number') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Validation
                </label>
                <div className="space-y-2">
                  {field.type === 'number' && (
                    <>
                      <input
                        type="number"
                        placeholder="Minimum value"
                        value={field.validation?.min ?? ''}
                        onChange={(e) => onUpdate({
                          ...field,
                          validation: {
                            ...field.validation,
                            min: e.target.value ? Number(e.target.value) : undefined
                          }
                        })}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Maximum value"
                        value={field.validation?.max ?? ''}
                        onChange={(e) => onUpdate({
                          ...field,
                          validation: {
                            ...field.validation,
                            max: e.target.value ? Number(e.target.value) : undefined
                          }
                        })}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </>
                  )}
                  {field.type === 'text' && (
                    <input
                      type="text"
                      placeholder="Validation pattern (regex)"
                      value={field.validation?.pattern ?? ''}
                      onChange={(e) => onUpdate({
                        ...field,
                        validation: {
                          ...field.validation,
                          pattern: e.target.value || undefined
                        }
                      })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  )}
                  <input
                    type="text"
                    placeholder="Validation message"
                    value={field.validation?.message ?? ''}
                    onChange={(e) => onUpdate({
                      ...field,
                      validation: {
                        ...field.validation,
                        message: e.target.value || undefined
                      }
                    })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
