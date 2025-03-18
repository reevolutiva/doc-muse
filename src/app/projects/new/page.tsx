"use client"

import { ProjectForm } from "@/components/project-form"
import { useRouter } from "next/navigation"

export default function NewProjectPage() {
  const router = useRouter()

  return (
    <ProjectForm 
      onClose={() => router.back()}
      onSuccess={() => router.push("/projects")}
    />
  )
}
