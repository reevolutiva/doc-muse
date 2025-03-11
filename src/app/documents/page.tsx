"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DocumentEditor } from "@/components/document-editor"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"

export default function DocumentPage() {
  const router = useRouter()
  const [document, setDocument] = useState<{
    id: string
    content: string
    title?: string
    project_id: string
    document_id: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        // Get document ID from localStorage
        const storedDocId = localStorage.getItem('currentDocumentId')
        if (!storedDocId) {
          throw new Error('No document selected')
        }

        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          toast.error("Please log in to view documents")
          router.push("/")
          return
        }

        const { data, error } = await supabase
          .from('document_versions')
          .select('*')
          .eq('id', storedDocId)
          .single()

        if (error) throw error
        if (!data) throw new Error('Document not found')

        setDocument({
          ...data,
          title: data.document_id // Use document_id as fallback title
        })
      } catch (error: any) {
        console.error('Error fetching document:', error)
        toast.error(error.message || 'Error loading document')
        router.push("/projects")
      } finally {
        setLoading(false)
      }
    }

    fetchDocument()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Document not found</h1>
          <p className="text-muted-foreground mb-4">
            The document you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <button
            onClick={() => router.push("/projects")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => router.push("/projects")}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </button>
            <h1 className="text-3xl font-bold">{document.title}</h1>
          </div>
        </div>

        <DocumentEditor
          projectId={document.project_id}
          documentId={document.id}
          initialContent={document.content}
        />
      </div>
    </div>
  )
}
