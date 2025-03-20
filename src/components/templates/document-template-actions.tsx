"use client"

import { Button } from "@/components/ui/button"
import { Pencil, Eye, Trash } from "lucide-react"
import { useRouter } from "next/navigation"

export function DocumentTemplateActions({ templateId }: { templateId: string }) {
  const router = useRouter()
  
  const handleEdit = () => {
    // Redirigir siempre al nuevo editor visual
    router.push(`/templates/visual-editor?id=${templateId}`)
  }
  
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleEdit}>
        <Pencil className="h-4 w-4 mr-2" /> Edit
      </Button>
    </div>
  )
}
