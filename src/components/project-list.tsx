"use client"

import { ProjectCard } from "@/components/project-card"
import { Search, Plus } from "lucide-react"
import { DocumentManager } from "@/components/document-manager"
import type { Project } from "@/lib/utils"

interface ProjectListProps {
  projects: Project[]
  searchQuery: string
  currentProject: Project | null
  onSearchChange: (query: string) => void
  onNewProject: () => void
  onProjectSelect: (project: Project) => void
}

export function ProjectList({
  projects,
  searchQuery,
  currentProject,
  onSearchChange,
  onNewProject,
  onProjectSelect
}: ProjectListProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Proyectos</h1>
          <p className="text-muted-foreground">
            Gestiona tus proyectos formativos y su documentación
          </p>
        </div>
        <div className="flex gap-4">
          <DocumentManager projectId={currentProject?.id} />
          <button 
            onClick={onNewProject}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Nuevo Proyecto
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar proyectos..."
          className="w-full rounded-lg border bg-white px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No projects found. Create your first project by clicking "Nuevo Proyecto".
          </div>
        ) : (
          projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              {...project}
              onClick={() => onProjectSelect(project)}
            />
          ))
        )}
      </div>
    </div>
  )
}
