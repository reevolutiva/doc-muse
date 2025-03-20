"use client"

import { useState } from 'react'
import { templateValidationSchema } from '../types/validation'
import type { ValidationErrors } from '../types/validation'

export function useFormValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({})

  const validateField = (field: string, value: any): boolean => {
    try {
      const schema = templateValidationSchema.shape[field]
      schema.parse(value)
      setErrors(prev => ({ ...prev, [field]: undefined }))
      return true
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        [field]: {
          type: 'validation',
          message: error instanceof Error ? error.message : 'Invalid value'
        }
      }))
      return false
    }
  }

  const validateForm = (): boolean => {
    try {
      templateValidationSchema.parse({
        title: document.querySelector<HTMLInputElement>('input[name="title"]')?.value,
        description: document.querySelector<HTMLTextAreaElement>('textarea[name="description"]')?.value,
        content: document.querySelector<HTMLDivElement>('.ProseMirror')?.innerHTML
      })
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof Error) {
        setErrors({
          validation: error.message
        })
      }
      return false
    }
  }

  return {
    errors,
    validateField,
    validateForm
  }
}
