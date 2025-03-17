"use client"

import { Suspense } from "react"
import { TemplatesManager } from "@/components/templates/TemplatesManager"
import { Loader2 } from "lucide-react"

// Componente de carga
function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  )
}

export default function TemplatesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <TemplatesManager />
    </Suspense>
  )
}
