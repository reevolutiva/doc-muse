"use client"

import { useState } from "react"
import { ArrowLeft, Save, X } from "lucide-react"
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
    status: project.status,
    progress: project.progress,
    loading: false,
    showDeleteDialog: false,
    activeTab: 'Project Data'
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formState.title.trim()) {
      toast.error("Please enter a title")
      return
    }

    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error("Please log in to update projects")
        return
      }

      const updates = {
        title: formState.title,
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
      setLoading(false)
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
    <div className="min-h-screen bg-background animate-in slide-in-from-right duration-300">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75">
        <div className="mx-auto max-w-7xl">
          <div className="flex h-16 items-center justify-between px-8">
            <div className="flex items-center gap-8">
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </button>
              <h1 className="text-lg font-semibold">{project.title}</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-8 py-6">

        <div className="w-full">
          <div className="mb-8">
            <nav className="flex space-x-1 rounded-lg bg-gray-100 p-1" aria-label="Tabs">
              {['Project Data', 'Document Knowledge Base', 'Create'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFormState(prev => ({ ...prev, activeTab: tab }))}
                  className={`
                    flex-1 whitespace-nowrap rounded-md px-3 py-2.5 text-sm font-medium transition-all
                    ${formState.activeTab === tab 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'}
                  `}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-4 space-y-6">
            {formState.activeTab === 'Project Data' && (
              <div className="max-w-2xl">
                <ProjectFormSection
                  title={formState.title}
                  status={formState.status}
                  progress={formState.progress}
                  loading={formState.loading}
                  templateId={project.project_template_id}
                  onSubmit={handleSubmit}
                  onTitleChange={(value) => setFormState(prev => ({ ...prev, title: value }))}
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
                templateId={project.project_template_id}
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
