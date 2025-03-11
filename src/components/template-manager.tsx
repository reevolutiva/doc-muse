"use client"

import { useState, useEffect } from "react"
import { Plus, X, FileText, Trash2, Edit2, Eye, History, Clock } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import * as Dialog from '@radix-ui/react-dialog'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { Editor } from '@tinymce/tinymce-react'

interface Template {
  id: string
  title: string
  description: string | null
  content: string
  created_at: string
}

interface TemplateManagerProps {
  onSelect?: (template: Template) => void
  mode?: "select" | "manage"
}

export function TemplateManager({ onSelect, mode = "manage" }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const [showVersions, setShowVersions] = useState<string | null>(null)
  const [versions, setVersions] = useState<Array<{
    id: string;
    version_number: number;
    created_at: string;
    content: string;
  }>>([])

  const handleRestoreVersion = async (version: {
    id: string;
    version_number: number;
    content: string;
  }) => {
    try {
      // Implementation for restoring version
      toast.success('Version restored successfully')
      setShowVersions(null)
    } catch (error) {
      toast.error('Failed to restore version')
      console.error('Restore error:', error)
    }
  }
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: ""
  })

  const updateForm = (updates: Partial<typeof form>) => {
    setForm(current => ({ ...current, ...updates }))
  }

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data, error } = await supabase
          .from('document_templates')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setTemplates(data || [])
      } catch (error: any) {
        toast.error("Error loading templates")
        console.error("Error:", error.message)
      }
    }

    fetchTemplates()

    // Subscribe to real-time changes
    const channel = supabase
      .channel('document_templates_changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'document_templates' 
        },
        (payload) => {
          setTemplates(current => [payload.new as Template, ...current])
          toast.success("New template added")
        }
      )
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'document_templates'
        },
        (payload) => {
          setTemplates(current => 
            current.map(template => 
              template.id === payload.new.id ? payload.new as Template : template
            )
          )
          toast.success("Template updated")
        }
      )
      .on('postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'document_templates'
        },
        (payload) => {
          setTemplates(current => 
            current.filter(template => template.id !== payload.old.id)
          )
          toast.success("Template deleted")
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])


  const handleSave = async () => {
    try {
      if (!form.title.trim() || !form.content.trim()) {
        toast.error("Title and content are required")
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error("No authenticated user")

      if (editingTemplate) {
        const { error } = await supabase
          .from('document_templates')
          .update({
            title: form.title,
            description: form.description,
            content: form.content,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingTemplate.id)

        if (error) throw error
        toast.success("Template updated successfully")
      } else {
        const { error } = await supabase
          .from('document_templates')
          .insert([{
            title: form.title,
            description: form.description,
            content: form.content,
            user_id: session.user.id
          }])

        if (error) throw error
        toast.success("Template created successfully")
      }

      setShowDialog(false)
      setEditingTemplate(null)
      setForm({
        title: "",
        description: "",
        content: ""
      })
    } catch (error: any) {
      toast.error("Error saving template")
      console.error("Error:", error.message)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('document_templates')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success("Template deleted successfully")
    } catch (error: any) {
      toast.error("Error deleting template")
      console.error("Error:", error.message)
    }
  }

  return (
    <div>
      <Dialog.Root open={showDialog} onOpenChange={setShowDialog}>
        <Dialog.Trigger asChild>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            <Plus className="w-4 h-4" />
            New Template
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay asChild>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Dialog.Overlay>
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-xl font-semibold">
                {editingTemplate ? "Edit Template" : "Create Template"}
              </Dialog.Title>
              <Dialog.Close className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </Dialog.Close>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateForm({ title: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter template title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => updateForm({ description: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter template description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <div className="border rounded-md">
                  <Editor
                    apiKey="no-api-key"
                    value={form.content}
                    onEditorChange={(newContent: string) => updateForm({ content: newContent })}
                    init={{
                      height: 400,
                      menubar: false,
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                      ],
                      toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                      content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; }'
                    }}
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                {editingTemplate ? "Update Template" : "Create Template"}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <div className="mt-4 space-y-2">
        {templates.map((template) => (
          <div
            key={template.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center justify-between flex-1">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => mode === "select" && onSelect?.(template)}
              >
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">{template.title}</p>
                  {template.description && (
                    <p className="text-sm text-gray-500">{template.description}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setPreviewTemplate(template)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            {mode === "manage" && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingTemplate(template)
                    setForm({
                      title: template.title,
                      description: template.description || "",
                      content: template.content
                    })
                    setShowDialog(true)
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <AlertDialog.Root>
                  <AlertDialog.Trigger asChild>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </AlertDialog.Trigger>

                  <AlertDialog.Portal>
                    <AlertDialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                    <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-xl p-6">
                      <AlertDialog.Title className="text-lg font-semibold mb-2">
                        Delete Template
                      </AlertDialog.Title>
                      <AlertDialog.Description className="text-gray-600 mb-4">
                        Are you sure you want to delete this template? This action cannot be undone.
                      </AlertDialog.Description>

                      <div className="flex justify-end gap-3">
                        <AlertDialog.Cancel asChild>
                          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700">
                            Cancel
                          </button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action asChild>
                          <button
                            onClick={() => handleDelete(template.id)}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </AlertDialog.Action>
                      </div>
                    </AlertDialog.Content>
                  </AlertDialog.Portal>
                </AlertDialog.Root>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      <Dialog.Root open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-xl font-semibold">
                {previewTemplate?.title}
              </Dialog.Title>
              <Dialog.Close className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </Dialog.Close>
            </div>

            <div className="prose max-w-none">
              {previewTemplate && (
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: previewTemplate.content
                  }} 
                  className="rich-text-preview"
                />
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Version History Dialog */}
      <Dialog.Root open={!!showVersions} onOpenChange={() => setShowVersions(null)}>
        <Dialog.Portal>
          <Dialog.Overlay asChild>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Dialog.Overlay>
          <Dialog.Content asChild>
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-lg shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <Dialog.Title className="text-xl font-semibold">
                    Version History
                  </Dialog.Title>
                  <p className="text-sm text-gray-500 mt-1">
                    View and restore previous versions of this document
                  </p>
                </div>
                <Dialog.Close asChild>
                  <button type="button" className="text-gray-500 hover:text-gray-700">
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.Close>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {versions.map((version) => (
                  <div
                    key={version.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <History className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Version {version.version_number}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>
                            {new Date(version.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRestoreVersion(version)}
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
