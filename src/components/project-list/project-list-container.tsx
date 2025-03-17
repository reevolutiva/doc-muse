"use client"

import { Search, Plus } from "lucide-react"
import { ProjectCard } from "@/components/project-card"
import { Session } from '@supabase/supabase-js'
import type { Project } from "@/lib/utils"

interface ProjectListContainerProps {
  projects: Project[]
  searchQuery: string
  session: Session | null
  onSearchChange: (query: string) => void
  onNewProject: () => void
  onProjectSelect: (project: Project) => void
}

export function ProjectListContainer({
  projects,
  searchQuery,
  session,
  onSearchChange,
  onNewProject,
  onProjectSelect
}: ProjectListContainerProps) {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage your training projects and documentation
          </p>
        </div>
        <div className="flex justify-end">
          <button 
            onClick={onNewProject}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            New Project
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full rounded-lg border bg-white px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No projects found. Create your first project by clicking "New Project".
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
