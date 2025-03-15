"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Eye, X, Loader2 } from "lucide-react"
import * as Dialog from '@radix-ui/react-dialog'
import { ProjectTemplateManager } from "@/components/project-template/project-template-manager"
import { ProjectTemplate } from "@/lib/types/project-template"
import { ProjectTemplateService } from "@/lib/services/project-template-service"
import { toast } from "sonner"

interface FormContentProps {
  onSubmit: (e: React.FormEvent) => Promise<void>
  loading: boolean
}

export function FormContent({ onSubmit, loading }: FormContentProps) {
  const [title, setTitle] = useState("")
  const [type, setType] = useState("")
  const [templateId, setTemplateId] = useState<string | null>(null)
  const [templates, setTemplates] = useState<Array<{id: string, name: string, description: string, type?: string}>>([])
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [loadingTemplates, setLoadingTemplates] = useState(false)
  
  // Tipos de proyecto filtrados a partir de los templates disponibles
  const projectTypes = Array.from(new Set(templates.map(t => t.type).filter(Boolean)))

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoadingTemplates(true)
        const { data, error } = await ProjectTemplateService.getProjectTemplates()
        
        if (error) throw error
        setTemplates(data || [])
        
        // Establecer el primer tipo como predeterminado si hay tipos disponibles
        if (data && data.length > 0 && data[0].type) {
          setType(data[0].type)
        }
      } catch (error) {
        console.error('Error fetching templates:', error)
        toast.error('Error al cargar las plantillas de proyecto')
      } finally {
        setLoadingTemplates(false)
      }
    }
    
    fetchTemplates()
  }, [])

  // Filtrar templates por tipo seleccionado
  const filteredTemplates = type 
    ? templates.filter(t => t.type === type)
    : templates

  const handleTemplateSelect = (template: ProjectTemplate) => {
    setTemplateId(template.id)
    if (template.type) {
      setType(template.type)
    }
    setShowTemplateSelector(false)
  }

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter project title"
            required
          />
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Type
            </label>
            {loadingTemplates ? (
              <div className="flex items-center gap-2 py-2">
                <Loader2 className="animate-spin h-4 w-4" />
                <span className="text-sm text-gray-500">Loading types...</span>
              </div>
            ) : (
              <select
                name="type"
                value={type}
                onChange={(e) => {
                  setType(e.target.value)
                  setTemplateId(null) // Reset template selection when type changes
                }}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="" disabled>Select a project type</option>
                {projectTypes.length > 0 ? (
                  projectTypes.map((projectType, index) => (
                    <option key={index} value={projectType}>
                      {projectType}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="elearning">E-Learning</option>
                    <option value="workshop">Workshop</option>
                    <option value="content">Content</option>
                  </>
                )}
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Template
            </label>
            <div className="flex gap-2">
              <select
                name="templateId"
                value={templateId || ''}
                onChange={(e) => setTemplateId(e.target.value || null)}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select a template</option>
                {filteredTemplates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowTemplateSelector(true)}
                className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                title="Browse templates"
              >
                <Eye className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {templateId && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-md">
                <h4 className="text-sm font-medium text-blue-900">{templates.find(t => t.id === templateId)?.name}</h4>
                <p className="mt-1 text-sm text-blue-700">
                  {templates.find(t => t.id === templateId)?.description}
                </p>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              name="description"
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Describe the project purpose and objectives"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Objectives (Optional)
            </label>
            <textarea
              name="objectives"
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="List the main project objectives"
            ></textarea>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || !title || !type}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>
      {/* Selector de plantillas */}
      <Dialog.Root 
        open={showTemplateSelector} 
        onOpenChange={setShowTemplateSelector}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl bg-white rounded-lg shadow-xl z-50 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <Dialog.Title className="text-xl font-semibold">
                Select a Project Template
              </Dialog.Title>
              <Dialog.Close className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </Dialog.Close>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <ProjectTemplateManager 
                onSelect={handleTemplateSelect} 
                mode="select" 
                typeFilter={type}
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
