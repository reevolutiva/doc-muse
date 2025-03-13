"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import type { Template } from '@/components/template-manager/types'

export function useTemplateOperations() {
  const [loading, setLoading] = useState(false)

  const saveTemplate = async (formData: Template, templateId?: string) => {
    if (!formData.title.trim()) {
      throw new Error("Title is required")
    }

    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error("No authenticated user")

      if (templateId) {
        const { error } = await supabase
          .from('document_templates')
          .update({
            title: formData.title,
            description: formData.description,
            content: formData.content,
            updated_at: new Date().toISOString()
          })
          .eq('id', templateId)

        if (error) throw error
        toast.success("Template updated successfully")
      } else {
        const { error } = await supabase
          .from('document_templates')
          .insert([{
            title: formData.title,
            description: formData.description,
            content: formData.content,
            user_id: session.user.id
          }])

        if (error) throw error
        toast.success("Template created successfully")
      }
    } catch (error: any) {
      toast.error("Error saving template")
      console.error("Error:", error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteTemplate = async (id: string) => {
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
      throw error
    }
  }

  return {
    loading,
    saveTemplate,
    deleteTemplate
  }
}
