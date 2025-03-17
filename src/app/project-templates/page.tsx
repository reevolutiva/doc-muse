"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function ProjectTemplatesPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirigir a la nueva página de templates con la pestaña de proyectos seleccionada
    router.replace("/templates?tab=projects")
  }, [router])
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  )
}