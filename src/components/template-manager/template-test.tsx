"use client"

import { useState } from 'react'
import { useTemplateOperations } from '@/lib/hooks/useTemplateOperations'
import { toast } from 'sonner'
import type { Template } from '@/lib/types/template'

export function TemplateTest() {
  const { saveTemplate } = useTemplateOperations()
  const [loading, setLoading] = useState(false)

  const handleCreateTemplate = async () => {
    setLoading(true)
    try {
      const templateData: Template = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        title: "Formulario de Levantamiento y Script de Entrevista",
        description: "Documento para guiar la entrevista inicial con el cliente, incluyendo instrucciones, checklists y bloques de preguntas clave.",
        content: {
          time: 1677605600000,
          blocks: [
            {
              blockId: "BLOCK-01-INSTRUCCIONES",
              type: "header",
              data: {
                text: "1. Instrucciones para el Entrevistador",
                level: 2
              },
              description: "Guía y recomendaciones para realizar la entrevista de manera efectiva.",
              system: "Describe el propósito de la entrevista y las recomendaciones para el entrevistador."
            }
          ],
          version: "1.0.0"
        }
      }

      await saveTemplate(templateData)
      toast.success('Template created successfully')
    } catch (error) {
      console.error('Error creating template:', error)
      toast.error('Failed to create template')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <button
        onClick={handleCreateTemplate}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating Template...' : 'Create Test Template'}
      </button>
    </div>
  )
}
