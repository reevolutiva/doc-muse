"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DocumentEditor } from "@/components/document-editor"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { ArrowLeft, FileText } from "lucide-react"

interface Document {
  id: string
  title: string
  content: string
  project_id: string
  document_id: string
  version: number
  created_at: string
}

async function getDocuments(): Promise<Document[]> {
  const { data, error } = await supabase.from('document_versions').select('*')
  if (error) throw error
  return data || []
}

export default function DocumentPage() {
  const router = useRouter()
  const [document, setDocument] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        // Get document ID from localStorage
        const storedDocId = localStorage.getItem('currentDocumentId')
        if (!storedDocId) {
          // Don't throw error, just set loading to false so we show the no-document UI
          setLoading(false)
          return
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
        // Don't redirect immediately, show error UI instead
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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-md">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">No document selected</h1>
          <p className="text-gray-500 mb-6">
            Please select a document from a project to view or edit it.
          </p>
          <button
            onClick={() => router.push("/projects")}
            className="flex items-center gap-2 px-4 py-2 mx-auto text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Projects
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
          initialContent={document.content || ""}
          onSave={() => toast.success("Document saved")}
        />
      </div>
    </div>
  )
}
