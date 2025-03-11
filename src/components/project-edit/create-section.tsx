"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { 
  FileText, Share2, BookOpen, GraduationCap, Route, Layout, 
  Book, ClipboardList, Lightbulb, Presentation, BarChart, 
  ClipboardCheck, Video, type LucideIcon 
} from "lucide-react"
import { useDocumentGeneration } from "@/lib/hooks/useDocumentGeneration"
import { DocumentTemplate } from "@/lib/types/document"
import { supabase } from "@/lib/supabase"

interface CreateSectionProps {
  projectId: string
  projectTitle: string
  templateId?: string | null
}

const documentTypes: DocumentTemplate[] = [
  {
    id: 'blog',
    title: 'Publicación para Blog',
    description: 'Genera contenido en formato de artículo para blogs corporativos o personales',
    icon: FileText,
    available: true
  },
  {
    id: 'social',
    title: 'Publicación para Redes Sociales',
    description: 'Crea posts breves o hilos para plataformas como Twitter, LinkedIn, Instagram',
    icon: Share2,
    available: true
  },
  {
    id: 'research',
    title: 'Documento de Investigación',
    description: 'Elabora documentos de análisis o reportes en profundidad',
    icon: BookOpen,
    available: true
  },
  {
    id: 'training',
    title: 'Plan de Formación',
    description: 'Diseña un plan formativo con objetivos, competencias y contenidos',
    icon: GraduationCap,
    available: true
  },
  {
    id: 'learning-path',
    title: 'Ruta de Aprendizaje',
    description: 'Estructura una secuencia de recursos y actividades formativas',
    icon: Route,
    available: true
  },
  {
    id: 'instructional',
    title: 'Proyecto Instruccional',
    description: 'Diseña, Planifica e implementa tu plan de formación',
    icon: Layout,
    available: true
  },
  {
    id: 'course-input',
    title: 'Insumo Base para Curso',
    description: 'Crea recursos iniciales (textos, presentaciones, lecturas)',
    icon: Book,
    available: true
  },
  {
    id: 'quiz',
    title: 'Evaluaciones o Quizzes',
    description: 'Genera cuestionarios, pruebas o ejercicios para medir el progreso',
    icon: ClipboardList,
    available: true
  },
  {
    id: 'case-study',
    title: 'Caso de Estudio',
    description: 'Desarrolla escenarios reales o ficticios que permitan analizar y resolver',
    icon: Lightbulb,
    available: false
  },
  {
    id: 'interactive',
    title: 'Presentaciones Interactivas',
    description: 'Crea diapositivas con elementos interactivos, ideales para exponer',
    icon: Presentation,
    available: false
  },
  {
    id: 'infographic',
    title: 'Infografías',
    description: 'Sintetiza datos e información en formatos visuales claros y atractivos',
    icon: BarChart,
    available: true
  },
  {
    id: 'checklist',
    title: 'Checklists o Fichas Didácticas',
    description: 'Listados de pasos o fichas breves para guiar procesos',
    icon: ClipboardCheck,
    available: false
  },
  {
    id: 'guide',
    title: 'Guías o Manuales Rápidos',
    description: 'Documentos concisos para que el usuario domine rápidamente una',
    icon: Book,
    available: false
  },
  {
    id: 'video-script',
    title: 'Video Scripts o Podcast Scripts',
    description: 'Genera guiones para la creación de contenido audiovisual o de audio',
    icon: Video,
    available: false
  }
]

export function CreateSection({ projectId, projectTitle, templateId }: CreateSectionProps) {
  const router = useRouter()
  const [availableDocTypes, setAvailableDocTypes] = useState<string[]>([])
  const [requiredDocs, setRequiredDocs] = useState<{[key: string]: boolean}>({})

  useEffect(() => {
    const fetchTemplateDocuments = async () => {
      if (!templateId) {
        setAvailableDocTypes(documentTypes.map(d => d.id))
        return
      }

      try {
        const { data, error } = await supabase
          .from('project_template_doc_templates')
          .select(`
            document_template_id,
            is_required
          `)
          .eq('project_template_id', templateId)
          .order('sequence_order')

        if (error) throw error

        const docIds = data.map((d: { document_template_id: string }) => d.document_template_id)
        setAvailableDocTypes(docIds)
        
        const required = data.reduce((acc: {[key: string]: boolean}, curr) => {
          acc[curr.document_template_id] = curr.is_required
          return acc
        }, {})
        setRequiredDocs(required)
      } catch (error) {
        console.error('Error fetching template documents:', error)
      }
    }

    fetchTemplateDocuments()
  }, [templateId])
  const { isGenerating, generateDocument } = useDocumentGeneration()

  const handleCreate = async (template: DocumentTemplate) => {
    if (!template.available) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in to create documents')
        return
      }

      toast.loading('Creating document...')

      const { data, error } = await supabase.functions.invoke('create-document', {
        body: {
          projectId,
          templateId: template.id,
          title: `${template.title} - ${projectTitle}`,
          description: template.description
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      if (error) throw error
      if (!data.success) throw new Error(data.error)

      toast.dismiss()
      toast.success('Document created successfully')

      // Redirect to document editor
      if (data.documentId) {
        router.push(`/documents/${data.documentId}`)
      }
    } catch (error: any) {
      toast.dismiss()
      console.error('Error creating document:', error)
      toast.error(error.message || 'Failed to create document')
    }
  }
  return (
    <div className="py-6">
      <h2 className="text-xl font-semibold mb-2">Required Docs</h2>
      <p className="text-muted-foreground mb-8">
        Selecciona el tipo de contenido que deseas generar
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documentTypes.filter(type => 
          !templateId || availableDocTypes.includes(type.id)
        ).map((type) => {
          const Icon = type.icon
          return (
            <div
              key={type.id}
              className={`relative flex flex-col p-6 bg-white rounded-lg border transition-colors ${
                type.available 
                  ? 'hover:border-blue-500 cursor-pointer group'
                  : 'opacity-50 cursor-not-allowed'
              }`}
              onClick={() => handleCreate(type)}
            >
              <div className="flex items-center gap-3 mb-3">
                <Icon className={`w-5 h-5 ${type.available ? 'text-blue-600' : 'text-gray-400'}`} />
                <div>
                  <h3 className="font-medium">{type.title}</h3>
                  {requiredDocs[type.id] && (
                    <span className="text-xs font-medium text-blue-600">Required</span>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2">
                {type.description}
              </p>
              {type.available ? (
                <button 
                  className="mt-4 w-full text-sm text-blue-600 font-medium py-2 border border-blue-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generando...' : '+ Crear'}
                </button>
              ) : (
                <div className="mt-4 w-full text-sm text-gray-400 font-medium py-2 text-center">
                  Próximamente
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
