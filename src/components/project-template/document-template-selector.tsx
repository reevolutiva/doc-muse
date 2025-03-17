"use client"

import { useState } from "react"
import { useTemplates } from "@/lib/hooks/useTemplates"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Template } from "@/lib/types/template"
import { toast } from "sonner"

interface DocumentTemplateSelectorProps {
  template: Template
  onCancel: () => void
  onSave: () => void
}

export function DocumentTemplateSelector({
  template,
  onCancel,
  onSave
}: DocumentTemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { templateData: availableTemplates, loading } = useTemplates(undefined, "document")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const handleSave = async () => {
    try {
      await fetch(`/api/templates/${template.id}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentIds: Array.from(selectedIds)
        }),
      })
      
      toast.success("Documents added successfully")
      onSave()
    } catch (error) {
      console.error('Error:', error)
      toast.error("Failed to add documents")
    }
  }

  const filteredTemplates = availableTemplates?.filter(t => 
    !searchQuery || 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  return (
    <div className="space-y-6">
      <Input
        type="search"
        placeholder="Search documents..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="max-h-[400px] overflow-y-auto space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No document templates found matching your search.
          </div>
        ) : (
          filteredTemplates.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-4 p-4 bg-white border rounded-lg hover:border-blue-200 cursor-pointer"
              onClick={() => handleToggleSelect(doc.id)}
            >
              <input
                type="checkbox"
                checked={selectedIds.has(doc.id)}
                onChange={() => handleToggleSelect(doc.id)}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <h3 className="font-medium">{doc.title}</h3>
                {doc.description && (
                  <p className="text-sm text-gray-500">{doc.description}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={selectedIds.size === 0}
        >
          Add Selected Documents
        </Button>
      </div>
    </div>
  )
}