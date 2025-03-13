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

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    content?: string;
  }>({});

  const updateForm = (updates: Partial<TemplateFormData>) => {
    setForm(current => ({ ...current, ...updates }));
    // Clear errors when user starts typing
    if (updates.title) setErrors(prev => ({ ...prev, title: undefined }));
    if (updates.description) setErrors(prev => ({ ...prev, description: undefined }));
    if (updates.content) setErrors(prev => ({ ...prev, content: undefined }));
  }

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!form.title?.trim()) {
      newErrors.title = "Title is required";
    } else if (form.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (typeof form.content === 'string' && !form.content.trim()) {
      newErrors.content = "Content is required";
    } else if (typeof form.content === 'object' && (!form.content.blocks || form.content.blocks.length === 0)) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async () => {

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
    errors,
    updateForm,
    handleSubmit,
    validateForm
  }
}
