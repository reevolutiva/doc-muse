import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Database } from "./supabase.types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type DatabaseProject = Database['public']['Tables']['projects']['Row']

export interface Project {
  id: string
  title: string
  type: string
  status: "en-progreso" | "completado"
  progress: number
  documentsCount: number
  lastUpdate: string
}

export function mapDatabaseProjectToProject(dbProject: DatabaseProject): Project {
  return {
    id: dbProject.id,
    title: dbProject.title,
    type: dbProject.type,
    status: dbProject.status as "en-progreso" | "completado",
    progress: dbProject.progress,
    documentsCount: dbProject.documents_count,
    lastUpdate: dbProject.updated_at ?? new Date().toISOString()
  }
}

export function mapDatabaseProjectsToProjects(dbProjects: DatabaseProject[]): Project[] {
  return dbProjects.map(mapDatabaseProjectToProject)
}
