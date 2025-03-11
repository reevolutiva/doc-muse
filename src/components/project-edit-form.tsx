"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { DocumentManager } from "./document-manager"
import { CreateSection } from "./project-edit/create-section"

interface ProjectEditFormProps {
  project: any
  onClose: () => void
  onUpdate: (project: any) => void
  onDelete: (id: string) => void
}

import { ProjectFormSection } from "./project-edit/project-form-section"
import { DocumentsSection } from "./project-edit/documents-section"

export function ProjectEditForm({ project, onClose, onUpdate, onDelete }: ProjectEditFormProps) {
  const [formState, setFormState] = useState({
    title: project.title,
    type: project.type,
    status: project.status,
    progress: project.progress,
    loading: false,
    showDeleteDialog: false,
    activeTab: 'Project Data'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formState.title.trim()) {
      toast.error("Please enter a title")
      return
    }

    setFormState(prev => ({ ...prev, loading: true }))
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error("Please log in to update projects")
        return
      }

      const updates = {
        title: formState.title,
        type: formState.type,
        status: formState.status,
        progress: formState.progress,
        updated_at: new Date().toISOString()
      }

      const { error, data } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', project.id)
        .eq('user_id', session.user.id)
        .select('*')
        .single()

      if (error) {
        console.error('Update error:', error)
        throw new Error(error.message || 'Failed to update project')
      }

      if (!data) {
        throw new Error('No project found or permission denied')
      }
      
      toast.success("Project updated successfully")
      onUpdate({
        ...project,
        ...updates
      })
    } catch (error: any) {
      toast.error(`Error updating project: ${error.message}`)
      console.error("Error:", error)
    } finally {
      setFormState(prev => ({ ...prev, loading: false }))
    }
  }


  const handleDelete = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error("Please log in to delete projects")
        return
      }

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id)
        .eq('user_id', session.user.id)

      if (error) {
        console.error('Delete error:', error)
        throw new Error(error.message || 'Failed to delete project')
      }
      
      toast.success("Project deleted successfully")
      onDelete(project.id)
    } catch (error: any) {
      toast.error(`Error deleting project: ${error.message}`)
      console.error("Error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-8 py-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Edit Project</h1>
            <p className="text-muted-foreground">
              Update project details and manage documents
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100"
          >
            Close
          </button>
        </div>

        <div className="w-full">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {['Project Data', 'Document Knowledge Base', 'Create'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFormState(prev => ({ ...prev, activeTab: tab }))}
                  className={`
                    whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium
                    ${formState.activeTab === tab 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}
                  `}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-8">
            {formState.activeTab === 'Project Data' && (
              <div className="max-w-2xl">
                <ProjectFormSection
                  title={formState.title}
                  type={formState.type}
                  status={formState.status}
                  progress={formState.progress}
                  loading={formState.loading}
                  onSubmit={handleSubmit}
                  onTitleChange={(value) => setFormState(prev => ({ ...prev, title: value }))}
                  onTypeChange={(value) => setFormState(prev => ({ ...prev, type: value }))}
                  onStatusChange={(value) => setFormState(prev => ({ ...prev, status: value }))}
                  onProgressChange={(value) => setFormState(prev => ({ ...prev, progress: value }))}
                  onDelete={() => setFormState(prev => ({ ...prev, showDeleteDialog: true }))}
                />
              </div>
            )}

            {formState.activeTab === 'Document Knowledge Base' && (
              <DocumentsSection
                projectId={project.id}
                onDocumentChange={(count) => {
                  onUpdate({
                    ...project,
                    documents_count: count
                  })
                }}
              />
            )}

            {formState.activeTab === 'Create' && (
              <CreateSection
                projectId={project.id}
                projectTitle={project.title}
              />
            )}
          </div>
        </div>
      </div>

      <AlertDialog.Root 
        open={formState.showDeleteDialog} 
        onOpenChange={(open) => setFormState(prev => ({ ...prev, showDeleteDialog: open }))}
      >
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-xl p-6">
            <AlertDialog.Title className="text-lg font-semibold mb-2">
              Delete Project
            </AlertDialog.Title>
            <AlertDialog.Description className="text-gray-600 mb-4">
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialog.Description>

            <div className="flex justify-end gap-3">
              <AlertDialog.Cancel asChild>
                <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700">
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  onClick={handleDelete}
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
  )
}
