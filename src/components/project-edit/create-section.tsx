"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { useDocumentGeneration } from "@/lib/hooks/useDocumentGeneration"
import { DocumentTemplate } from "@/lib/types/document"
import { supabase } from "@/lib/supabase"
import { DocumentConfigPanel } from "@/components/document-config/document-config-panel"
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { CustomMention } from '../block-editor/extensions/mention'
import { CustomStyles } from '../block-editor/extensions/custom-styles'
import { DOCUMENT_TYPES } from "@/lib/constants/document-types"
import { useDocumentTemplate } from "@/lib/hooks/useDocumentTemplate"
import { DocumentService } from "@/lib/services/document-service"
import EtherpadEmbed from "@/components/document-config/EtherpadEmbed.tsx"

interface CreateSectionProps {
  projectId: string
  projectTitle: string
  templateId?: string | null
}

export function CreateSection({ projectId, projectTitle, templateId }: CreateSectionProps) {
  const router = useRouter()
  const { 
    availableDocTypes, 
    requiredDocs, 
    loading: loadingTemplate 
  } = useDocumentTemplate({ 
    projectId, 
    templateId 
  })
  
  const { isGenerating, generateDocument } = useDocumentGeneration()
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null)
  const [sectionState, setSectionState] = useState({})

  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomMention,
      CustomStyles
    ],
    content: '',
    onUpdate: ({ editor }) => {
      // Store content in editor state
      const content = editor.getHTML()
      // You can trigger auto-save here if needed
    }
  })

  useEffect(() => {
    
    const p = DOCUMENT_TYPES.filter(type => 
      !templateId || availableDocTypes.includes(type.id)
    )

    console.log( "DOCUMENT_TYPES: ", DOCUMENT_TYPES );
    console.log( "p: ", p );
    console.log( "availableDocTypes: ", availableDocTypes );
    console.log( "selectedTemplate", selectedTemplate );
  }, [availableDocTypes])

  const handleCreate = async (template: DocumentTemplate) => {

    if (!template.available) {
      toast.error('This template is not available yet')
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in to create documents')
        return
      }

      console.log( "template: ", template );

      // Set selected template to open config panel
      setSelectedTemplate(template)
    } catch (error: any) {
      console.error('Error selecting template:', error)
      toast.error(error.message || 'Failed to select template')
    }
  }

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setSelectedTemplate(template)
  }

  const handleConfigSave = () => {
    setSelectedTemplate(null)
    toast.success('Document created successfully')
  }

  if (selectedTemplate) {
    return (
      <div className="flex h-[calc(100vh-12rem)]">
        <div className="w-96">
          <DocumentConfigPanel
            templateId={selectedTemplate.id}
            projectId={projectId}
            onConfigSave={(config) => handleConfigSave(selectedTemplate.id, config)}
          />
        </div>
        <div className="flex-1 p-6">
          <EtherpadEmbed />
        </div>
      </div>
    )
  }

  if (loadingTemplate) {
    return (
      <div className="py-6 text-center">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-2 text-muted-foreground">Cargando plantillas disponibles...</p>
      </div>
    )
  }


  

  return (
    <>
      <div className="py-6">
        <h2 className="text-xl font-semibold mb-2">Required Docs</h2>
        <p className="text-muted-foreground mb-8">
          Selecciona el tipo de contenido que deseas generar
        </p>
      


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DOCUMENT_TYPES.filter(type => 
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
                  className="mt-4 w-full text-sm text-white font-medium py-2 bg-blue-600 hover:bg-blue-700 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" />
                      <span>Crear</span>
                    </div>
                  )}
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
    </>
  )
}

export default CreateSection;
