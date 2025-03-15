import { supabase } from '@/lib/supabase'
import { ProjectTemplate } from '@/lib/types/project-template'
import { createErrorHandler } from '@/lib/utils/error-handler'
import { Database } from '@/lib/supabase.types'

type DocumentDependencyRow = Database['public']['Tables']['document_dependencies']['Row']
type ProjectTemplateRow = Database['public']['Tables']['project_templates']['Row']

type ProjectTemplateResponse = ProjectTemplateRow & {
  documents: Array<{
    id: string
    document_template_id: string
    is_required: boolean
    sequence_order: number
    document_template: {
      id: string
      title: string
      description: string | null
    }
  }>
}

const handleError = createErrorHandler('ProjectTemplateService')

const mapTemplateResponse = (template: any): ProjectTemplate => ({
  id: template.id,
  name: template.name,
  description: template.description,
  created_at: template.created_at,
  updated_at: template.updated_at,
  documents: template.documents.map((doc: any) => ({
    id: doc.id,
    document_template_id: doc.document_template_id,
    document_template: {
      id: doc.document_template.id,
      title: doc.document_template.title,
      description: doc.document_template.description
    },
    is_required: doc.is_required,
    sequence_order: doc.sequence_order
  }))
})

export const ProjectTemplateService = {
  async getProjectTemplates(): Promise<{ data: ProjectTemplate[] | null, error: any }> {
    try {
      const { data: templates, error } = await supabase
        .from('project_templates')
        .select(`
          id,
          name,
          description,
          created_at,
          updated_at,
          documents:project_template_doc_templates (
            id,
            document_template_id,
            is_required,
            sequence_order,
            document_template:document_template_id (
              id,
              title,
              description
            )
          )
        `)
        .order('name')
      
      if (error) throw error
      return { 
        data: templates ? templates.map(mapTemplateResponse) : null, 
        error: null 
      }
    } catch (error) {
      return { 
        data: null, 
        error: handleError(error, { 
          customMessage: 'Error al cargar las plantillas de proyecto',
          silent: true 
        })
      }
    }
  },

  async getProjectTemplateById(id: string): Promise<{ data: ProjectTemplate | null, error: any }> {
    try {
      const { data: template, error } = await supabase
        .from('project_templates')
        .select(`
          id,
          name,
          description,
          created_at,
          updated_at,
          documents:project_template_doc_templates (
            id,
            document_template_id,
            is_required,
            sequence_order,
            document_template:document_template_id (
              id,
              title,
              description
            )
          )
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      return { 
        data: template ? mapTemplateResponse(template) : null, 
        error: null 
      }
    } catch (error) {
      return { 
        data: null, 
        error: handleError(error, { 
          customMessage: `Error al cargar la plantilla de proyecto ${id}`,
          silent: true 
        })
      }
    }
  },

  async createProjectTemplate(data: Partial<ProjectTemplate>): Promise<{ data: ProjectTemplate | null, error: any }> {
    try {
      const { data: createdTemplate, error } = await supabase
        .from('project_templates')
        .insert([{
          name: data.name,
          description: data.description
        }])
        .select()
        .single()
      
      if (error) throw error
      return { data: createdTemplate, error: null }
    } catch (error) {
      return { 
        data: null, 
        error: handleError(error, { 
          customMessage: 'Error al crear la plantilla de proyecto',
          silent: true 
        })
      }
    }
  },

  async updateProjectTemplate(id: string, data: Partial<ProjectTemplate>): Promise<{ data: ProjectTemplate | null, error: any }> {
    try {
      const { data: updatedTemplate, error } = await supabase
        .from('project_templates')
        .update({
          name: data.name,
          description: data.description
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return { data: updatedTemplate, error: null }
    } catch (error) {
      return { 
        data: null, 
        error: handleError(error, { 
          customMessage: `Error al actualizar la plantilla de proyecto ${id}`,
          silent: true 
        })
      }
    }
  },

  async deleteProjectTemplate(id: string): Promise<{ success: boolean, error: any }> {
    try {
      const { error } = await supabase
        .from('project_templates')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      return { 
        success: false, 
        error: handleError(error, { 
          customMessage: `Error al eliminar la plantilla de proyecto ${id}`,
          silent: true 
        })
      }
    }
  },

  async addDocumentToTemplate(
    projectTemplateId: string,
    documentTemplateId: string,
    isRequired: boolean,
    sequenceOrder: number
  ): Promise<{ data: any, error: any }> {
    try {
      const { data, error } = await supabase
        .from('project_template_doc_templates')
        .insert([{
          project_template_id: projectTemplateId,
          document_template_id: documentTemplateId,
          is_required: isRequired,
          sequence_order: sequenceOrder
        }])
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { 
        data: null, 
        error: handleError(error, { 
          customMessage: 'Error al agregar documento a la plantilla',
          silent: true 
        })
      }
    }
  },

  async updateDocumentInTemplate(
    id: string,
    updates: { is_required?: boolean, sequence_order?: number }
  ): Promise<{ data: any, error: any }> {
    try {
      const { data, error } = await supabase
        .from('project_template_doc_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { 
        data: null, 
        error: handleError(error, { 
          customMessage: `Error al actualizar documento en la plantilla`,
          silent: true 
        })
      }
    }
  },

  async removeDocumentFromTemplate(id: string): Promise<{ success: boolean, error: any }> {
    try {
      const { error } = await supabase
        .from('project_template_doc_templates')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      return { 
        success: false, 
        error: handleError(error, { 
          customMessage: 'Error al eliminar documento de la plantilla',
          silent: true 
        })
      }
    }
  },

  async getDocumentDependencies(documentTemplateId: string): Promise<{ data: DocumentDependencyRow[], error: any }> {
    try {
      const { data, error } = await supabase
        .from('document_dependencies')
        .select(`
          id,
          source_id,
          target_id,
          dependency_type,
          notes,
          created_at,
          updated_at
        `)
        .eq('source_id', documentTemplateId)
      
      if (error) throw error

      return { data: data || [], error: null }
    } catch (error) {
      return { 
        data: [], 
        error: handleError(error, { 
          customMessage: 'Error al cargar las dependencias del documento',
          silent: true 
        })
      }
    }
  },

  async saveDependencies(dependencies: DocumentDependencyRow[]): Promise<{ success: boolean, error: any }> {
    try {
      if (dependencies.length === 0) {
        return { success: true, error: null }
      }

      const sourceIds = [...new Set(dependencies.map(dep => dep.source_id))]

      for (const sourceId of sourceIds) {
        const { error: deleteError } = await supabase
          .from('document_dependencies')
          .delete()
          .eq('source_id', sourceId)
        
        if (deleteError) throw deleteError
      }

      const { error: insertError } = await supabase
        .from('document_dependencies')
        .insert(dependencies.map(dep => ({
          source_id: dep.source_id,
          target_id: dep.target_id,
          dependency_type: dep.dependency_type,
          notes: dep.notes || null
        })))
      
      if (insertError) throw insertError
      
      return { success: true, error: null }
    } catch (error) {
      return { 
        success: false, 
        error: handleError(error, { 
          customMessage: 'Error al guardar las dependencias',
          silent: true 
        })
      }
    }
  }
}