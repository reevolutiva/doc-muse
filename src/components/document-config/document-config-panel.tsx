"use client"

import React, { useState, useEffect } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { LivePreview } from "./live-preview"
import { appendPadText, setPadText } from "./config/etherpad"
import { EtherpadIdStorage } from "@/lib/localStorage"

interface Field {
  type: string
  label: string
  key: string
  options?: string[]
}

interface Section {
  title: string
  fields: Field[]
}

interface DocumentConfig {
  sections: Section[]
  content: string
}

interface DocumentConfigPanelProps {
  templateId: string
  projectId: string
  onConfigSave: (config: Record<string, unknown>) => void
}

const DocumentConfigPanel = ({ templateId, projectId, onConfigSave }: DocumentConfigPanelProps) => {
  const [loading, setLoading] = useState(true)
  const [template, setTemplate] = useState<{
    title: string
    description: string | null
    config: DocumentConfig
  } | null>(null)
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [configState, setConfigState] = useState({})

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const { data, error } = await supabase
          .from('document_templates')
          .select('title, description, config')
          .eq('title', templateId)
          .single()

        if (error) throw error
        if (!data) throw new Error('Template not found')
        
        // Ensure config exists with default empty sections if needed
        const templateData = {
          title: data?.title || '',
          description: data?.description || null,
          config: {
            sections: Array.isArray((data.config as any)?.sections) ? (data.config as any).sections : [],
            content: typeof (data.config as any)?.content === 'string' ? (data.config as any).content : ''
          }
        }
        setTemplate(templateData)

        // Initialize form values with defaults from template config
        if (Array.isArray((data.config as any)?.sections)) {
          const initialValues: Record<string, any> = {}
          ;(data.config as any).sections.forEach((section: any) => {
            section.fields?.forEach((field: any) => {
              initialValues[field.key] = field.defaultValue || ''
            })
          })
          setFormValues(initialValues)
        }
      } catch (error: any) {
        console.error('Error fetching template:', error)
        toast.error('Failed to load template configuration')
      } finally {
        setLoading(false)
      }
    }

    fetchTemplate()
  }, [templateId])

  const handleInputChange = (key: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSubmit = async () => {

    
    const etherpadIdStorage = new EtherpadIdStorage();
    const storedPadId = etherpadIdStorage.getPadId();

    const body = {
      "template": {
        "key": "title",
        "value": "Blog"
      },
      "task": "doc-gen"
    }

    const { data, error } = await supabase.functions.invoke('llm-contextion', {
      body: body ,
      method: 'POST'
    })

    await appendPadText(storedPadId, data );

  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!template) {
    return (
      <div className="p-4 text-center text-gray-500">
        Template configuration not found
      </div>
    )
  }

  return (
    <div className="flex h-full">
      <div className="flex flex-col w-1/2 bg-white border-r">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold mb-2">{template.title}</h2>
          {template.description && (
            <p className="text-gray-600">{template.description}</p>
          )}
        </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {template.config.sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-lg font-medium">{section.title}</h3>
            <div className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  {field.type === 'text' && (
                    <input
                      type="text"
                      value={formValues[field.key] || ''}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  )}
                  {field.type === 'textarea' && (
                    <textarea
                      value={formValues[field.key] || ''}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      rows={4}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  )}
                  {field.type === 'checkbox' && (
                    <input
                      type="checkbox"
                      checked={formValues[field.key] || false}
                      onChange={(e) => handleInputChange(field.key, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  )}
                  {field.type === 'select' && field.options && (
                    <select
                      value={formValues[field.key] || ''}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select an option</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 border-t">
        <button
          onClick={handleSubmit}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Save Configuration
        </button>
      </div>
      </div>
      
      {/* Live Preview Panel 
      <div className="flex flex-col w-1/2 bg-white">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold mb-2">Live Preview</h2>
          <p className="text-gray-600">Preview how your document will look with the current configuration</p>
        </div>
        <div className="flex-1">
          <LivePreview 
            content={template.config.content} 
            config={formValues} 
          />
        </div>

      </div>
      */}
    </div>
  )
}

export default DocumentConfigPanel;
export { DocumentConfigPanel };
