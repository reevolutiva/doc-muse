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
  onSubmit: (data: { title: string; project_template_id: string }) => Promise<void>
  loading: boolean
}

export function FormContent({ onSubmit, loading }: FormContentProps) {
  const [title, setTitle] = useState("")
  const [templateId, setTemplateId] = useState<string | null>(null)
  const [templates, setTemplates] = useState<Array<{id: string, name: string, description: string}>>([])
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [loadingTemplates, setLoadingTemplates] = useState(false)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoadingTemplates(true)
        const { data, error } = await ProjectTemplateService.getProjectTemplates()
        
        if (error) throw error
        setTemplates((data || []).map(template => ({
          id: template.id,
          name: template.name,
          description: template.description || ''
        })))
      } catch (error) {
        console.error('Error fetching templates:', error)
        toast.error('Error al cargar las plantillas de proyecto')
      } finally {
        setLoadingTemplates(false)
      }
    }
    
    fetchTemplates()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title || !templateId) return

    try {
      await onSubmit({
        title,
        project_template_id: templateId
      })
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  const handleTemplateSelect = (template: ProjectTemplate) => {
    setTemplateId(template.id)
    setShowTemplateSelector(false)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Plantilla de Proyecto
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowTemplateSelector(true)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-left text-gray-700 hover:bg-gray-50"
            >
              {templateId ? (
                templates.find(t => t.id === templateId)?.name || 'Seleccionar plantilla'
              ) : (
                'Seleccionar plantilla'
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !title || !templateId}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creando..." : "Crear Proyecto"}
        </button>
      </form>

      {/* Selector de plantillas */}
      <Dialog.Root 
        open={showTemplateSelector} 
        onOpenChange={setShowTemplateSelector}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <ProjectTemplateManager
            mode="select"
            onSelect={handleTemplateSelect}
          />
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
