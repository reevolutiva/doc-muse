"use client"

import { useState } from 'react'
import { toast } from 'sonner'
import type { TemplateFormData } from '@/lib/types/template'

interface UseTemplateFormProps {
  initialData?: TemplateFormData
  onSave: (data: TemplateFormData) => Promise<void>
  onClose: () => void
}

export function useTemplateForm({ initialData, onSave, onClose }: UseTemplateFormProps) {
  const [form, setForm] = useState<TemplateFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    content: initialData?.content || {
      time: Date.now(),
      blocks: [],
      version: '1.0.0'
    }
  })

  const [loading, setLoading] = useState(false)

  const updateForm = (updates: Partial<TemplateFormData>) => {
    setForm(current => ({ ...current, ...updates }))
  }

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required")
      return
    }

    setLoading(true)
    try {
      await onSave(form)
      onClose()
    } catch (error) {
      console.error('Error saving template:', error)
      toast.error('Failed to save template')
    } finally {
      setLoading(false)
    }
  }

  return {
    form,
    loading,
    updateForm,
    handleSubmit
  }
}
