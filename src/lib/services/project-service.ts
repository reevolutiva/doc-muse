import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Project, mapDatabaseProjectsToProjects, mapDatabaseProjectToProject } from "@/lib/utils"
import { handleError } from "@/lib/utils/error-handler"

export interface ProjectCreateOptions {
  title: string
  type: string
  description?: string
  objectives?: string
  project_template_id?: string
}

export const ProjectService = {
  /**
   * Obtiene todos los proyectos del usuario actual
   */
  async getUserProjects(): Promise<{ data: Project[], error: any }> {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Please log in to view projects')
      }

      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          type,
          status,
          progress,
          documents_count,
          updated_at
        `)
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false })

      if (error) throw error

      return { 
        data: mapDatabaseProjectsToProjects(data || []), 
        error: null 
      }
    } catch (error) {
      handleError(error)
      return { data: [], error }
    }
  },

  /**
   * Crea un nuevo proyecto
   */
  async createProject(projectData: ProjectCreateOptions): Promise<{ data: Project | null, error: any }> {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Please log in to create projects')
      }

      const newProject = {
        ...projectData,
        user_id: session.user.id,
        status: "en-progreso",
        progress: 0,
        documents_count: 0,
      }

      const { data, error } = await supabase
        .from('projects')
        .insert([newProject])
        .select()
        .single()

      if (error) {
        if (error.code === '23502') { // not-null violation
          const column = error.message.match(/column "([^"]+)"/)?.[1]
          throw new Error(`The ${column || 'field'} cannot be empty`)
        } else if (error.code === '23503') { // foreign key violation
          throw new Error('Invalid template selected')
        } else {
          throw error
        }
      }

      if (!data) {
        throw new Error('Failed to create project')
      }

      const project = mapDatabaseProjectToProject(data)
      return { data: project, error: null }
    } catch (error) {
      handleError(error)
      return { data: null, error }
    }
  },

  /**
   * Actualiza un proyecto existente
   */
  async updateProject(projectId: string, updates: Partial<Project>): Promise<{ data: Project | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          title: updates.title,
          type: updates.type,
          status: updates.status,
          // Evita actualizar campos que no existen en la tabla
          ...(updates.progress !== undefined ? { progress: updates.progress } : {}),
        })
        .eq('id', projectId)
        .select()
        .single()

      if (error) throw error
      
      if (!data) {
        throw new Error('Failed to update project')
      }

      const project = mapDatabaseProjectToProject(data)
      return { data: project, error: null }
    } catch (error) {
      handleError(error)
      return { data: null, error }
    }
  },

  /**
   * Elimina un proyecto
   */
  async deleteProject(projectId: string): Promise<{ success: boolean, error: any }> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      handleError(error)
      return { success: false, error }
    }
  }
}