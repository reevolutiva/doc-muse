"use client"

import { useEffect } from "react"
import { Session } from '@supabase/supabase-js'
import { supabase } from "@/lib/supabase"
import { useProjectState } from "@/hooks/useProjectState"
import { AuthForm } from "@/components/auth/auth-form"
import { ProjectForm } from "@/components/project-form"
import { ProjectEditForm } from "@/components/project-edit-form"
import { ProjectListContainer } from "@/components/project-list/project-list-container"
import { Toaster } from "sonner"

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: Session) => {
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
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      
      <div className={`transition-all duration-300 ${
        state.showProjectDetails ? 'opacity-0 pointer-events-none h-0 overflow-hidden' : 'opacity-100 p-8'
      }`}>
        <ProjectListContainer
          projects={state.projects.filter(project => 
            project.title.toLowerCase().includes(state.searchQuery.toLowerCase())
          )}
          searchQuery={state.searchQuery}
          session={state.session}
          onSearchChange={(query) => updateState({ searchQuery: query })}
          onNewProject={() => updateState({ showProjectForm: true })}
          onProjectSelect={(project) => {
            updateState({
              currentProject: project,
              showProjectDetails: true
            })
            localStorage.setItem('currentProject', JSON.stringify(project))
          }}
        />
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

      <div className={`transition-all duration-300 ${
        state.showProjectDetails ? 'opacity-100' : 'opacity-0 pointer-events-none h-0 overflow-hidden'
      }`}>
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
    </div>
  )
}
