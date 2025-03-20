"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import * as Dialog from '@radix-ui/react-dialog'
import { FormContent } from "./project-form/form-content"

interface ProjectFormProps {
  onClose: () => void
  onSuccess: (project: any) => void
}

export function ProjectForm({ onClose, onSuccess }: ProjectFormProps) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: { title: string; project_template_id: string }) => {
    const { title, project_template_id: templateId } = data
    const description = ""
    const objectives = ""

    // Validate required fields
    const errors = []
    if (!title.trim()) errors.push("Title is required")
    if (!templateId) errors.push("Please select a template")
    
    if (errors.length > 0) {
      toast.error(errors.join(", "))
      return
    }

    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error("No authenticated user")

      const projectData = {
        title,
        description,
        objectives,
        user_id: session.user.id,
        status: "en-progreso",
        progress: 0,
        documents_count: 0,
        project_template_id: templateId
      }

      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single()

      if (error) {
        if (error.code === '23502') { // not-null violation
          const column = error.message.match(/column "([^"]+)"/)?.[1]
          throw new Error(`The ${column || 'field'} cannot be empty`)
        } else if (error.code === '23503') { // foreign key violation
          throw new Error('Invalid template selected')
        } else {
          console.error('Database error:', error)
          throw new Error(error.message || 'Failed to create project')
        }
      }

      if (!data) {
        throw new Error('No data returned from database')
      }
      
      toast.success("Project created successfully")
      onSuccess(data)
    } catch (error: any) {
      const errorMessage = error.message || "Error creating project"
      toast.error(errorMessage)
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-semibold">
              Create New Project
            </Dialog.Title>
            <Dialog.Close className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <FormContent onSubmit={handleSubmit} loading={loading} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
