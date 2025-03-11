"use client"

import { useEffect, useCallback } from "react"
import { useProjectState } from "@/hooks/useProjectState"
import { ProjectCard } from "@/components/project-card"
import { Search, Plus } from "lucide-react"
import { DocumentManager } from "@/components/document-manager"
import { AuthForm } from "@/components/auth/auth-form"
import { ProjectForm } from "@/components/project-form"
import { ProjectEditForm } from "@/components/project-edit-form"
import { supabase } from "@/lib/supabase"
import { Toaster, toast } from "sonner"
import { Session } from '@supabase/supabase-js'
import { Project, mapDatabaseProjectToProject } from "@/lib/utils"

export default function ProjectsPage() {
  const { state, updateState, fetchProjects, loadStoredProject } = useProjectState()

  // Initialize auth
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        updateState({ session })
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        updateState({ loading: false })
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      updateState({ session })
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])


  useEffect(() => {
    if (!state.session) return

    // Initial fetch
    fetchProjects()

    // Subscribe to real-time changes
    const channel = supabase.channel('projects')
    
    channel
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'projects' 
        }, 
        fetchProjects
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [state.session, fetchProjects])

  // Load stored project
  useEffect(() => {
    loadStoredProject()
  }, [loadStoredProject])

  if (state.loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!state.session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <AuthForm />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <Toaster position="top-right" />
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground">
              Manage your training projects and documentation
            </p>
          </div>
          <div className="flex gap-4">
            <DocumentManager 
              projectId={state.currentProject?.id} 
              onDocumentChange={(count) => {
                if (state.currentProject) {
                  updateState({
                    currentProject: {
                      ...state.currentProject,
                      documentsCount: count
                    }
                  })
                }
              }}
            />
            <button 
              onClick={() => updateState({ showProjectForm: true })}
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
              value={state.searchQuery}
              onChange={(e) => updateState({ searchQuery: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {state.projects
            .filter(project => 
              project.title.toLowerCase().includes(state.searchQuery.toLowerCase())
            )
            .map((project) => (
              <ProjectCard 
                key={project.id}
                {...project}
                onClick={() => {
                  updateState({
                    currentProject: project,
                    showProjectDetails: true
                  })
                  localStorage.setItem('currentProject', JSON.stringify(project))
                }}
              />
            ))
          }
        </div>
      </div>

      {state.showProjectForm && (
        <ProjectForm
          onClose={() => updateState({ showProjectForm: false })}
          onSuccess={(project) => {
            updateState({
              projects: [project, ...state.projects],
              showProjectForm: false
            })
          }}
        />
      )}

      {state.showProjectDetails && state.currentProject && (
        <ProjectEditForm
          project={state.currentProject}
          onClose={() => {
            updateState({
              showProjectDetails: false,
              currentProject: null
            })
            localStorage.removeItem('currentProject')
          }}
          onUpdate={(updatedProject) => {
            updateState({
              projects: state.projects.map(p => 
                p.id === updatedProject.id ? updatedProject : p
              ),
              currentProject: updatedProject
            })
            localStorage.setItem('currentProject', JSON.stringify(updatedProject))
          }}
          onDelete={(deletedId) => {
            updateState({
              projects: state.projects.filter(p => p.id !== deletedId),
              showProjectDetails: false,
              currentProject: null
            })
            localStorage.removeItem('currentProject')
          }}
        />
      )}
    </div>
  )
}
