"use client"

import { TemplatesManager } from "@/components/templates/TemplatesManager"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function TemplatesPage() {
  const { session, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!session) {
    router.replace("/")
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <TemplatesManager />
    </div>
  )
}
