"use client"

import { useState } from "react"
import { useTemplates } from "@/lib/hooks/useTemplates"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { FileText, Edit2, Eye, Trash2, AlertCircle } from "lucide-react"
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface DocumentTemplateListProps {
  type?: 'document' | 'project'
}

export function DocumentTemplateList({ type = 'document' }: DocumentTemplateListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { templateData: templates, loading, error } = useTemplates(undefined, type)
  const router = useRouter()
  
  const handleEdit = (templateId: string) => {
    router.push(`/templates/visual-editor?id=${templateId}`)
  }
  
  const handleDelete = async (templateId: string) => {
    try {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) throw new Error('Failed to delete template')
      
      toast.success('Template deleted successfully')
      // Refresh the page to update the list
      router.refresh()
    } catch (error) {
      toast.error('Error deleting template')
      console.error('Error:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Templates</h3>
        <p className="text-gray-500 max-w-md">
          {error.message || "An error occurred while loading templates. Please try again."}
        </p>
      </div>
    )
  }

  const filteredTemplates = templates?.filter(template =>
    template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  return (
    <div className="space-y-6">
      <Input
        type="search"
        placeholder="Search templates..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-md"
      />

      {filteredTemplates.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No templates found. Create your first template by clicking the "Create Template" button above.
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="flex items-center justify-between p-4 bg-white border rounded-lg hover:border-blue-200 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">{template.title}</h3>
                  {template.description && (
                    <p className="text-sm text-gray-500">{template.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(template.id)}
                >
                  <Edit2 className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                
                <AlertDialog.Root>
                  <AlertDialog.Trigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </AlertDialog.Trigger>
                  <AlertDialog.Portal>
                    <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
                    <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                      <AlertDialog.Title className="text-lg font-semibold mb-2">
                        Delete Template
                      </AlertDialog.Title>
                      <AlertDialog.Description className="text-gray-600 mb-4">
                        Are you sure you want to delete this template? This action cannot be undone.
                      </AlertDialog.Description>
                      <div className="flex justify-end gap-3">
                        <AlertDialog.Cancel asChild>
                          <Button variant="outline">Cancel</Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action asChild>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(template.id)}
                          >
                            Delete
                          </Button>
                        </AlertDialog.Action>
                      </div>
                    </AlertDialog.Content>
                  </AlertDialog.Portal>
                </AlertDialog.Root>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
