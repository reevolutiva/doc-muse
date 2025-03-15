import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { ProjectTemplate, DocumentDependency } from '@/lib/types/project-template'

export const ProjectTemplateService = {
  /**
   * Obtiene todas las plantillas de proyecto
   */
  async getProjectTemplates(): Promise<{ data: ProjectTemplate[] | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('project_templates')
        .select('*')
        .order('name')
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching project templates:', error)
      return { data: null, error }
    }
  },

  /**
   * Obtiene una plantilla de proyecto por su ID
   */
  async getProjectTemplateById(id: string): Promise<{ data: ProjectTemplate | null, error: any }> {
    try {
      // Primero, obtener la información básica de la plantilla
      const { data: templateData, error: templateError } = await supabase
        .from('project_templates')
        .select('*')
        .eq('id', id)
        .single()
      
      if (templateError) throw templateError

      // Luego, obtener los documentos asociados a la plantilla
      const { data: documentsData, error: documentsError } = await supabase
        .from('project_template_doc_templates')
        .select(`
          id,
          document_template_id,
          is_required,
          sequence_order,
          document_template:document_template_id (
            id,
            title,
            description
          )
        `)
        .eq('project_template_id', id)
        .order('sequence_order')
      
      if (documentsError) throw documentsError

      const template: ProjectTemplate = {
        ...templateData,
        documents: documentsData || []
      }
      
      return { data: template, error: null }
    } catch (error) {
      console.error(`Error fetching project template with ID ${id}:`, error)
      return { data: null, error }
    }
  },

  /**
   * Crea una nueva plantilla de proyecto
   */
  async createProjectTemplate(data: Partial<ProjectTemplate>): Promise<{ data: ProjectTemplate | null, error: any }> {
    try {
      const { data: createdTemplate, error } = await supabase
        .from('project_templates')
        .insert([data])
        .select()
        .single()
      
      if (error) throw error
      return { data: createdTemplate, error: null }
    } catch (error) {
      console.error('Error creating project template:', error)
      return { data: null, error }
    }
  },

  /**
   * Actualiza una plantilla de proyecto existente
   */
  async updateProjectTemplate(id: string, data: Partial<ProjectTemplate>): Promise<{ data: ProjectTemplate | null, error: any }> {
    try {
      const { data: updatedTemplate, error } = await supabase
        .from('project_templates')
        .update(data)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return { data: updatedTemplate, error: null }
    } catch (error) {
      console.error(`Error updating project template with ID ${id}:`, error)
      return { data: null, error }
    }
  },

  /**
   * Elimina una plantilla de proyecto
   */
  async deleteProjectTemplate(id: string): Promise<{ success: boolean, error: any }> {
    try {
      // Primero, eliminar las relaciones con documentos
      const { error: docsError } = await supabase
        .from('project_template_doc_templates')
        .delete()
        .eq('project_template_id', id)
      
      if (docsError) throw docsError

      // Luego, eliminar la plantilla
      const { error } = await supabase
        .from('project_templates')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      console.error(`Error deleting project template with ID ${id}:`, error)
      return { success: false, error }
    }
  },

  /**
   * Agrega un documento a una plantilla de proyecto
   */
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
      console.error('Error adding document to project template:', error)
      return { data: null, error }
    }
  },

  /**
   * Actualiza un documento en una plantilla de proyecto
   */
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
      console.error(`Error updating document in project template with ID ${id}:`, error)
      return { data: null, error }
    }
  },

  /**
   * Elimina un documento de una plantilla de proyecto
   */
  async removeDocumentFromTemplate(id: string): Promise<{ success: boolean, error: any }> {
    try {
      const { error } = await supabase
        .from('project_template_doc_templates')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      console.error(`Error removing document from project template with ID ${id}:`, error)
      return { success: false, error }
    }
  },

  /**
   * Obtiene las dependencias de un documento
   */
  async getDocumentDependencies(documentTemplateId: string): Promise<{ data: DocumentDependency[], error: any }> {
    try {
      const { data, error } = await supabase
        .from('document_dependencies')
        .select('*')
        .eq('source_id', documentTemplateId)
      
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      console.error('Error fetching document dependencies:', error)
      return { data: [], error }
    }
  },

  /**
   * Guarda las dependencias de documentos
   * Esta función elimina primero todas las dependencias existentes y luego inserta las nuevas
   */
  async saveDependencies(dependencies: DocumentDependency[]): Promise<{ success: boolean, error: any }> {
    try {
      // Si no hay dependencias, no hacemos nada
      if (dependencies.length === 0) {
        return { success: true, error: null }
      }

      // Obtenemos los IDs únicos de documentos fuente
      const sourceIds = [...new Set(dependencies.map(dep => dep.source_id))]

      // Eliminar todas las dependencias existentes para estos documentos
      for (const sourceId of sourceIds) {
        const { error: deleteError } = await supabase
          .from('document_dependencies')
          .delete()
          .eq('source_id', sourceId)
        
        if (deleteError) throw deleteError
      }

      // Insertar las nuevas dependencias
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
      console.error('Error saving document dependencies:', error)
      return { success: false, error }
    }
  }
}