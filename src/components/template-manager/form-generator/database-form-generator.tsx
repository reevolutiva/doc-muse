"use client"

import { useState, useEffect } from 'react'
import { X, Save, Eye, ArrowLeft, ArrowRight } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase.types'

type TableInfo = {
  name: string
  columns: {
    name: string
    type: string
    isNullable: boolean
    hasDefault: boolean
    isIdentity: boolean
    isUnique: boolean
    isForeignKey: boolean
    references?: {
      table: string
      column: string
    }
  }[]
}

interface DatabaseFormGeneratorProps {
  onClose: () => void
  onSave: (template: any) => Promise<void>
}

export function DatabaseFormGenerator({ onClose, onSave }: DatabaseFormGeneratorProps) {
  const [step, setStep] = useState(1)
  const [tables, setTables] = useState<TableInfo[]>([])
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null)
  const [formConfig, setFormConfig] = useState<{
    [key: string]: {
      label: string
      type: string
      required: boolean
      validation?: {
        min?: number
        max?: number
        pattern?: string
        message?: string
      }
    }
  }>({})
  const [loading, setLoading] = useState(true)
  const [preview, setPreview] = useState(false)

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const { data, error } = await supabase.rpc('get_table_info')

        if (error) throw error

        const tableMap = new Map<string, TableInfo>()

        data.forEach(column => {
          const tableName = column.table_name
          if (!tableMap.has(tableName)) {
            tableMap.set(tableName, {
              name: tableName,
              columns: []
            })
          }

          const table = tableMap.get(tableName)!
          table.columns.push({
            name: column.column_name,
            type: column.data_type,
            isNullable: column.is_nullable === 'YES',
            hasDefault: column.column_default !== null,
            isIdentity: column.is_identity === 'YES',
            isUnique: false, // Would need additional query to determine this
            isForeignKey: false // Would need additional query to determine this
          })
        })

        setTables(Array.from(tableMap.values()))
      } catch (error) {
        console.error('Error fetching tables:', error)
        toast.error('Failed to load database schema')
      } finally {
        setLoading(false)
      }
    }

    fetchTables()
  }, [])

  const handleTableSelect = (table: TableInfo) => {
    setSelectedTable(table)
    const initialConfig = table.columns.reduce((acc, column) => {
      if (!column.isIdentity) {
        acc[column.name] = {
          label: column.name.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          type: mapDbTypeToInputType(column.type),
          required: !column.isNullable && !column.hasDefault
        }
      }
      return acc
    }, {} as typeof formConfig)
    setFormConfig(initialConfig)
    setStep(2)
  }

  const mapDbTypeToInputType = (dbType: string): string => {
    switch (dbType.toLowerCase()) {
      case 'integer':
      case 'bigint':
      case 'numeric':
        return 'number'
      case 'boolean':
        return 'checkbox'
      case 'date':
        return 'date'
      case 'timestamp':
      case 'timestamptz':
        return 'datetime-local'
      case 'json':
      case 'jsonb':
        return 'textarea'
      default:
        return 'text'
    }
  }

  const handleSave = async () => {
    if (!selectedTable) return

    try {
      const template = {
        title: `${selectedTable.name} Form`,
        description: `Auto-generated form for ${selectedTable.name} table`,
        content: {
          time: Date.now(),
          blocks: [{
            blockId: crypto.randomUUID(),
            type: 'form',
            data: {
              table: selectedTable.name,
              fields: formConfig
            },
            description: `Form fields for ${selectedTable.name}`,
            system: null as string | null
          }],
          version: '1.0.0'
        }
      }

      await onSave(template)
      toast.success('Form template created successfully')
      onClose()
    } catch (error) {
      console.error('Error saving template:', error)
      toast.error('Failed to create form template')
    }
  }

  return (
    <Dialog.Content className="w-full max-w-4xl bg-white rounded-xl shadow-2xl p-8">
      <div className="flex items-center justify-between border-b pb-6 mb-8">
        <div>
          <Dialog.Title className="text-2xl font-bold text-gray-900">
            Generate Form Template
          </Dialog.Title>
          <p className="mt-1 text-sm text-gray-500">
            Create a form template based on your database schema
          </p>
        </div>
        <Dialog.Close className="text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-6 h-6" />
        </Dialog.Close>
      </div>

      <div className="mb-8">
        <div className="relative">
          <div className="absolute top-0 h-1 w-full bg-gray-200 rounded">
            <div 
              className="absolute h-full bg-blue-600 rounded transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
          <div className="relative flex justify-between">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-[400px]">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Select a Table</h3>
            <div className="grid grid-cols-3 gap-4">
              {tables.map(table => (
                <button
                  key={table.name}
                  onClick={() => handleTableSelect(table)}
                  className="p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <h4 className="font-medium mb-1">{table.name}</h4>
                  <p className="text-sm text-gray-500">
                    {table.columns.length} columns
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && selectedTable && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Configure Form Fields</h3>
            <div className="space-y-4">
              {Object.entries(formConfig).map(([fieldName, config]) => (
                <div key={fieldName} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4 flex-1">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Field Label
                        </label>
                        <input
                          type="text"
                          value={config.label}
                          onChange={(e) => setFormConfig(prev => ({
                            ...prev,
                            [fieldName]: { ...prev[fieldName], label: e.target.value }
                          }))}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Input Type
                        </label>
                        <select
                          value={config.type}
                          onChange={(e) => setFormConfig(prev => ({
                            ...prev,
                            [fieldName]: { ...prev[fieldName], type: e.target.value }
                          }))}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="email">Email</option>
                          <option value="tel">Phone</option>
                          <option value="date">Date</option>
                          <option value="datetime-local">DateTime</option>
                          <option value="checkbox">Checkbox</option>
                          <option value="radio">Radio</option>
                          <option value="select">Select</option>
                          <option value="textarea">Textarea</option>
                        </select>
                      </div>
                    </div>

                    <div className="ml-4 space-y-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={config.required}
                          onChange={(e) => setFormConfig(prev => ({
                            ...prev,
                            [fieldName]: { ...prev[fieldName], required: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">Required field</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && selectedTable && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Preview Form</h3>
            <div className="border rounded-lg p-6 space-y-6">
              {Object.entries(formConfig).map(([fieldName, config]) => (
                <div key={fieldName}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {config.label}
                    {config.required && <span className="text-red-500 ml-1">*</span>}
                  </label>

                  {config.type === 'textarea' ? (
                    <textarea
                      disabled
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      rows={3}
                    />
                  ) : config.type === 'select' ? (
                    <select
                      disabled
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option>Select an option</option>
                    </select>
                  ) : (
                    <input
                      type={config.type}
                      disabled
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t">
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        ) : (
          <div />
        )}

        <div className="flex gap-3">
          <Dialog.Close className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
            Cancel
          </Dialog.Close>
          
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Save className="w-4 h-4" />
              Save Template 
            </button>
          )}
        </div>
      </div>
    </Dialog.Content>
  )
}
