"use client"
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import type { Template, TemplateFormData } from '@/lib/types/template'
import { useAuth } from "@/hooks/useAuth"

export function useTemplateManager() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(false)
  const { session } = useAuth()

  // Fetch templates on component mount
  useEffect(() => {
    fetchTemplates()
  }, [])

  const handleSaveTemplate = async (formData: TemplateFormData) => {
    if (!formData.title?.trim()) {
      toast.error("Title is required")
      return
    }

    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error("Please log in to save templates")
        return
      }

      // Parse content to ensure it's properly formatted
      let parsedContent = formData.content
      if (typeof formData.content === 'string') {
        try {
          parsedContent = JSON.parse(formData.content)
        } catch (e) {
          // If content is not valid JSON, create a default block structure
          parsedContent = {
            time: Date.now(),
            blocks: [{
              blockId: crypto.randomUUID(),
              type: 'paragraph',
              data: { text: formData.content },
              description: '',
              system: ''
            }],
            version: '1.0.0'
          }
        }
      }

      const templateData = {
        title: formData.title.trim(),
        description: formData.description?.trim() || null,
        content: parsedContent,
        user_id: session.user.id,
        updated_at: new Date().toISOString()
      }

      if (editingTemplate) {
        const { error } = await supabase
          .from('document_templates')
          .update(templateData)
          .eq('id', editingTemplate.id)

        if (error) throw error
        toast.success("Template updated successfully")
      } else {
        const { error } = await supabase
          .from('document_templates')
          .insert([templateData])

        if (error) throw error
        toast.success("Template created successfully")
      }

      setShowDialog(false)
      setEditingTemplate(null)
      await fetchTemplates()
    } catch (error: any) {
      console.error("Error saving template:", error)
      toast.error(error.message || "Error saving template")
    } finally {
      setLoading(false)
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
      await fetchTemplates()
    } catch (error: any) {
      toast.error("Error deleting template")
      console.error("Error:", error.message)
    }
  }

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Ensure content is properly formatted for each template
      setTemplates((data || []).map(template => {
        let parsedContent = template.content
        
        // If content is a string, try to parse it as JSON
        if (typeof template.content === 'string') {
          try {
            parsedContent = JSON.parse(template.content)
          } catch (e) {
            // If parsing fails, keep as is
            console.warn(`Failed to parse template content for ID: ${template.id}`)
          }
        }
        
        return {
          ...template,
          content: parsedContent
        }
      }))
    } catch (error: any) {
      toast.error("Error loading templates")
      console.error("Error:", error.message)
    }
  }

  return {
    templates,
    showDialog,
    editingTemplate,
    loading,
    setShowDialog,
    setEditingTemplate,
    handleSaveTemplate,
    handleDelete,
    fetchTemplates
  }
}
