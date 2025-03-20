"use client"

import { FileText, Trash2, Edit2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

import type { Document } from '@/lib/types/document'

interface DocumentListProps {
  documents: Document[]
  isLoading: boolean
  error?: Error | null
  onDelete: (id: string) => void
}

export function DocumentList({ documents, isLoading, error, onDelete }: DocumentListProps) {
  const router = useRouter()
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
        <p className="text-sm text-red-600 font-medium">Error loading documents</p>
        <p className="text-xs text-gray-500">{error.message}</p>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        No documents uploaded yet
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <span className="text-sm font-medium truncate">{doc.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                localStorage.setItem('currentDocumentId', doc.id)
                router.push('/documents/view')
              }}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit document"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(doc.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete document"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
