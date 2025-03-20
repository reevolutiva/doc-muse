"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface FormContentProps {
  onSubmit: (e: React.FormEvent) => Promise<void>
  loading: boolean
}

export function FormContent({ onSubmit, loading }: FormContentProps) {
  const [title, setTitle] = useState("")
  const [type, setType] = useState("elearning")
  const [templateId, setTemplateId] = useState<string | null>(null)
  const [templates, setTemplates] = useState<Array<{id: string, name: string, description: string}>>([])

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data, error } = await supabase
          .from('project_templates')
          .select('*')
          .order('name')
        
        if (error) throw error
        setTemplates(data || [])
      } catch (error) {
        console.error('Error fetching templates:', error)
      }
    }

    fetchTemplates()
  }, [])

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter project title"
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="elearning">E-Learning</option>
            <option value="workshop">Workshop</option>
            <option value="content">Content</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Template
          </label>
          <select
            value={templateId || ''}
            onChange={(e) => setTemplateId(e.target.value || null)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select a template</option>
            {templates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          {templateId && (
            <p className="mt-1 text-sm text-gray-500">
              {templates.find(t => t.id === templateId)?.description}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Project"}
      </button>
    </form>
  )
}
