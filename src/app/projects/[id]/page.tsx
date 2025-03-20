"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ProjectEditForm } from "@/components/project-edit-form"
import { Project } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function ProjectEditPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          toast.error("Please log in to view this project")
          router.push("/")
          return
        }

        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("id", params.id)
          .eq("user_id", session.user.id)
          .single()

        if (error) throw error
        if (!data) throw new Error("Project not found")

        setProject(data)
      } catch (error: any) {
        console.error("Error:", error)
        toast.error(error.message)
        router.push("/projects")
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [params.id, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!project) {
    return null
  }

  return (

    <ProjectEditForm
      project={project}
      onClose={() => router.push("/projects")}
      onUpdate={(updatedProject) => {
        setProject(updatedProject)
      }}
      onDelete={() => {
        router.push("/projects")
      }}
    />
    
  )
}
