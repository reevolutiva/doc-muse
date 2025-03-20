"use client"

import { useState } from "react"
import { ProjectListContainer } from "@/components/project-list/project-list-container"
import { useProjects } from "@/lib/hooks/useProjects"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export default function ProjectsClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const { projects, loading, error } = useProjects()
  const { session } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600">Failed to load projects</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
        >
          Try again
        </button>
      </div>
    )
  }

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  )


  return (
    <ProjectListContainer 
      projects={filteredProjects}
      searchQuery={searchQuery}
      session={session}
      onSearchChange={setSearchQuery}
      onNewProject={() => router.push("/projects/new")}
      onProjectSelect={(project) => router.push(`/projects/${project.id}`)}
    />
  )
}
