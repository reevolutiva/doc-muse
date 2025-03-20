import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { handleError } from "@/lib/utils/error-handler"

export interface DocumentCreateOptions {
  projectId: string
  templateId: string
  title?: string
  config?: Record<string, any>
}

export const DocumentService = {
  /**
   * Crea un nuevo documento utilizando una plantilla
   */
  async createDocument({ projectId, templateId, title, config }: DocumentCreateOptions): Promise<{ success: boolean, documentId?: string }> {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Please log in to create documents')
      }

      const { data, error } = await supabase.functions.invoke('create-document', {
        body: { 
          projectId,
          templateId,
          title,
          config
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      if (error) throw error
      if (!data?.success) throw new Error(data?.error || 'Failed to create document')

      return { 
        success: true, 
        documentId: data.documentId 
      }
    } catch (err) {
      handleError(err)
      return { success: false }
    }
  },

  /**
   * Obtiene los documentos de un proyecto
   */
  async getDocumentsByProject(projectId: string) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      handleError(error)
      return { data: null, error }
    }
  },

  /**
   * Obtiene un documento por su ID
   */
  async getDocumentById(documentId: string) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      handleError(error)
      return { data: null, error }
    }
  }
}