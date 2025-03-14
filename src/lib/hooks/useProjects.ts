"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { ProjectService, ProjectCreateOptions } from "@/lib/services/project-service"
import type { Project } from "@/lib/utils"

interface UseProjectsResult {
  projects: Project[]
  loading: boolean
  error: any
  refreshProjects: () => Promise<void>
  createProject: (data: ProjectCreateOptions) => Promise<Project | null>
  updateProject: (id: string, updates: Partial<Project>) => Promise<Project | null>
  deleteProject: (id: string) => Promise<boolean>
}

export function useProjects(): UseProjectsResult {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<any>(null)

  const refreshProjects = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await ProjectService.getUserProjects()
      setProjects(data)
      setError(error)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createProject = useCallback(async (data: ProjectCreateOptions): Promise<Project | null> => {
    try {
      const { data: project, error } = await ProjectService.createProject(data)
      if (error) throw error
      if (project) {
        setProjects(prevProjects => [project, ...prevProjects])
        toast.success("Proyecto creado con éxito")
        return project
      }
      return null
    } catch (error) {
      toast.error("Error al crear el proyecto")
      return null
    }
  }, [])

  const updateProject = useCallback(async (id: string, updates: Partial<Project>): Promise<Project | null> => {
    try {
      const { data: updatedProject, error } = await ProjectService.updateProject(id, updates)
      if (error) throw error
      if (updatedProject) {
        setProjects(prevProjects => 
          prevProjects.map(project => 
            project.id === id ? updatedProject : project
          )
        )
        toast.success("Proyecto actualizado con éxito")
        return updatedProject
      }
      return null
    } catch (error) {
      toast.error("Error al actualizar el proyecto")
      return null
    }
  }, [])

  const deleteProject = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { success, error } = await ProjectService.deleteProject(id)
      if (error) throw error
      if (success) {
        setProjects(prevProjects => 
          prevProjects.filter(project => project.id !== id)
        )
        toast.success("Proyecto eliminado con éxito")
        return true
      }
      return false
    } catch (error) {
      toast.error("Error al eliminar el proyecto")
      return false
    }
  }, [])

  // Cargar proyectos al montar el componente
  useEffect(() => {
    refreshProjects()
  }, [refreshProjects])

  return {
    projects,
    loading,
    error,
    refreshProjects,
    createProject,
    updateProject,
    deleteProject
  }
}