"use client"

import { useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import type { Template, TemplateFormData } from '@/lib/types/template'

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
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    content?: string;
    validation?: string;
  }>({})
  const [touched, setTouched] = useState<{
    title?: boolean;
    description?: boolean;
    content?: boolean;
  }>({})

  const updateForm = (updates: Partial<TemplateFormData>) => {
    setForm(current => ({ ...current, ...updates }))
    
    // Mark fields as touched
    Object.keys(updates).forEach(key => {
      setTouched(prev => ({ ...prev, [key]: true }))
    })

    // Clear errors for updated fields
    Object.keys(updates).forEach(key => {
      setErrors(prev => ({ ...prev, [key]: undefined }))
    })

    // Validate immediately if field was previously touched
    if (touched.title && updates.title) {
      validateField('title', updates.title)
    }
    if (touched.content && updates.content) {
      validateField('content', updates.content)
    }
  }

  const validateField = (field: string, value: any) => {
    let fieldError: string | undefined

    switch (field) {
      case 'title':
        if (!value?.trim()) {
          fieldError = 'Title is required'
        } else if (value.length < 3) {
          fieldError = 'Title must be at least 3 characters'
        } else if (value.length > 100) {
          fieldError = 'Title must be less than 100 characters'
        }
        break

      case 'content':
        if (!value) {
          fieldError = 'Content is required'
        } else if (typeof value === 'object' && (!value.blocks || value.blocks.length === 0)) {
          fieldError = 'Content must not be empty'
        }
        break
    }

    setErrors(prev => ({
      ...prev,
      [field]: fieldError
    }))

    return !fieldError
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
    } else if (typeof form.content === 'object') {
      const content = form.content as { blocks?: unknown[] }
      if (!content.blocks || content.blocks.length === 0) {
        newErrors.content = "Content is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }


  const handleRestoreVersion = async (version: {
    id: string;
    version_number: number;
    content: string;
  }) => {
    try {
      setLoading(true)
      updateForm({ content: version.content })
      toast.success('Version restored successfully')
    } catch (error) {
      console.error('Error restoring version:', error)
      toast.error('Failed to restore version')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    // Mark all fields as touched
    setTouched({
      title: true,
      description: true,
      content: true
    })

    // Validate all fields
    const titleValid = validateField('title', form.title)
    const contentValid = validateField('content', form.content)

    if (!titleValid || !contentValid) {
      toast.error('Please fix the validation errors')
      return
    }

    setLoading(true)
    try {
      // Check for existing template with same title
      if (!initialData) {
        const { data: existing } = await supabase
          .from('document_templates')
          .select('id')
          .eq('title', form.title.trim())
          .single()

        if (existing) {
          setErrors(prev => ({
            ...prev,
            validation: 'A template with this title already exists'
          }))
          toast.error('A template with this title already exists')
          return
        }
      }

      await onSave({
        title: form.title.trim(),
        description: form.description?.trim() ?? null,
        content: form.content
      })

      toast.success(`Template ${initialData ? 'updated' : 'created'} successfully`)
      onClose()
    } catch (error: any) {
      console.error('Error saving template:', error)
      setErrors(prev => ({
        ...prev,
        validation: error.message || 'Failed to save template'
      }))
      toast.error(error.message || 'Failed to save template')
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
