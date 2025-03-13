"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProjectCard } from "@/components/project-card"
import { ProjectForm } from "@/components/project-form"
import { ProjectEditForm } from "@/components/project-edit-form"
import { Search, Plus } from "lucide-react"
import { AuthForm } from "@/components/auth/auth-form"
import { supabase } from "@/lib/supabase"
import { Toaster, toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { Session } from '@supabase/supabase-js'

interface Project {
  id: string
  title: string
  type: string
  status: "en-progreso" | "completado"
  progress: number
  documentsCount: number
  lastUpdate: string
}

export default function HomePage() {
  const router = useRouter()
  const [projectsList, setProjectsList] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showProjectDetails, setShowProjectDetails] = useState(false)
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleProjectSelect = (project: any) => {
    setIsTransitioning(true)
    setCurrentProject(project)
    setShowProjectDetails(true)
    localStorage.setItem('currentProject', JSON.stringify(project))
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const handleProjectClose = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setShowProjectDetails(false)
      setCurrentProject(null)
      localStorage.removeItem('currentProject')
      setIsTransitioning(false)
    }, 300)
  }

  const { session, loading, isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchProjects = async () => {
      if (!session?.user?.id) return
      
      try {
        const { data: projects, error } = await supabase
          .from('projects')
          .select('*')
          //.eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        console.log('Projects:', projects)

        if (error) {
          toast.error('Error loading projects')
          console.error('Error:', error)
          return
        }

        setProjectsList(projects.map(project => ({
          id: project.id,
          title: project.title,
          type: project.type,
          status: project.status as "en-progreso" | "completado",
          progress: project.progress,
          documentsCount: project.documents_count,
          lastUpdate: new Date(project.updated_at || project.created_at).toLocaleDateString()
        })))
      } catch (error) {
        toast.error('Error loading projects')
        console.error('Error:', error)
      }
    }

    if (session?.user?.id) {
      fetchProjects()
    }
  }, [session?.user?.id])


  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
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
        showProjectDetails ? 'opacity-0 pointer-events-none h-0 overflow-hidden' : 'opacity-100 p-8'
      }`}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Projects</h1>
              <p className="text-muted-foreground">
                Manage your training projects and documentation
              </p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowProjectForm(true)}
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
              placeholder="Buscar proyectos..."
              className="w-full rounded-lg border bg-white px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projectsList.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No projects found. Create your first project by clicking "Nuevo Proyecto".
            </div>
          ) : (
            projectsList.map((project) => (
            <ProjectCard 
              key={project.title} 
              {...project}
              onClick={() => handleProjectSelect(project)}
            />
            ))
          )}
        </div>
        </div>
      </div>

      {showProjectForm && (
        <ProjectForm
          onClose={() => setShowProjectForm(false)}
          onSuccess={(project) => {
            setProjectsList([project, ...projectsList])
            setShowProjectForm(false)
            toast.success("Project created successfully")
          }}
        />
      )}

      <div className={`transition-all duration-300 ${
        showProjectDetails ? 'opacity-100' : 'opacity-0 pointer-events-none h-0 overflow-hidden'
      }`}>
        {showProjectDetails && currentProject && !isTransitioning && (
          <ProjectEditForm
            project={currentProject}
            onClose={() => {
              setShowProjectDetails(false)
              setCurrentProject(null)
              localStorage.removeItem('currentProject')
            }}
            onUpdate={(updatedProject) => {
              setProjectsList(projectsList.map(p => 
                p.id === updatedProject.id ? updatedProject : p
              ))
              setCurrentProject(updatedProject)
              localStorage.setItem('currentProject', JSON.stringify(updatedProject))
            }}
            onDelete={(deletedId) => {
              setProjectsList(projectsList.filter(p => p.id !== deletedId))
              setShowProjectDetails(false)
              setCurrentProject(null)
              localStorage.removeItem('currentProject')
            }}
          />
        )}
      </div>
    </div>
  )
}
