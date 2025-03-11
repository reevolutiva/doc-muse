"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import * as Dialog from '@radix-ui/react-dialog'

interface ProjectFormProps {
  onClose: () => void
  onSuccess: (project: any) => void
}

export function ProjectForm({ onClose, onSuccess }: ProjectFormProps) {
  const [title, setTitle] = useState("")
  const [type, setType] = useState("elearning")
  const [description, setDescription] = useState("")
  const [objectives, setObjectives] = useState("")
  const [templateId, setTemplateId] = useState<string | null>(null)
  const [templates, setTemplates] = useState<Array<{id: string, name: string, description: string}>>([])
  const [loading, setLoading] = useState(false)

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
        toast.error('Failed to load project templates')
      }
    }

    fetchTemplates()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    const errors = []
    if (!title.trim()) errors.push("Title is required")
    if (!type) errors.push("Type is required")
    if (!templateId) errors.push("Please select a template")
    
    if (errors.length > 0) {
      toast.error(errors.join(", "))
      return
    }

    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error("No authenticated user")

      const projectData = {
        title,
        type,
        description,
        objectives,
        user_id: session.user.id,
        status: "en-progreso",
        progress: 0,
        documents_count: 0,
        project_template_id: templateId
      }

      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single()

      if (error) {
        if (error.code === '23502') { // not-null violation
          const column = error.message.match(/column "([^"]+)"/)?.[1]
          throw new Error(`The ${column || 'field'} cannot be empty`)
        } else if (error.code === '23503') { // foreign key violation
          throw new Error('Invalid template selected')
        } else {
          console.error('Database error:', error)
          throw new Error(error.message || 'Failed to create project')
        }
      }

      if (!data) {
        throw new Error('No data returned from database')
      }
      
      toast.success("Project created successfully")
      onSuccess(data)
    } catch (error: any) {
      const errorMessage = error.message || "Error creating project"
      toast.error(errorMessage)
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog.Root open={true} onOpenChange={() => onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-semibold">
              Create New Project
            </Dialog.Title>
            <Dialog.Close className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="space-y-4">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter project description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Objectives
                  </label>
                  <textarea
                    value={objectives}
                    onChange={(e) => setObjectives(e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter project objectives"
                  />
                </div>
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
