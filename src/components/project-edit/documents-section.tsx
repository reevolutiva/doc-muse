"use client"

import { DocumentManager } from "../document-manager"

interface DocumentsSectionProps {
  projectId: string
  onDocumentChange: (count: number) => void
}

export function DocumentsSection({ projectId, onDocumentChange }: DocumentsSectionProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="mb-6 text-xl font-semibold">Document Knowledge Base</h2>
      <DocumentManager 
        projectId={projectId}
        onDocumentChange={onDocumentChange}
      />
    </div>
  )
}
