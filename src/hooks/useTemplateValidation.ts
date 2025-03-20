"use client"

import { useCallback } from 'react'
import type { 
  TemplateNodeData, 
  TemplateValidationResult 
} from '@/lib/types/templates'
import { createErrorHandler } from '@/lib/utils/error-handler'

export function useTemplateValidation() {
  const errorHandler = createErrorHandler('TemplateValidation')

  const validateNode = useCallback((node: TemplateNodeData): TemplateValidationResult => {
    const errors: { field: string; message: string }[] = []

    // Validaciones requeridas
    if (!node.label?.trim()) {
      errors.push({
        field: 'label',
        message: 'Label is required'
      })
    }

    if (!node.type) {
      errors.push({
        field: 'type',
        message: 'Type is required'
      })
    }

    // Validaciones condicionales basadas en validation
    if (node.validation) {
      if (node.content) {
        if (node.validation.minLength && node.content.length < node.validation.minLength) {
          errors.push({
            field: 'content',
            message: `Content must be at least ${node.validation.minLength} characters`
          })
        }

        if (node.validation.maxLength && node.content.length > node.validation.maxLength) {
          errors.push({
            field: 'content',
            message: `Content must not exceed ${node.validation.maxLength} characters`
          })
        }

        if (node.validation.pattern) {
          try {
            const regex = new RegExp(node.validation.pattern)
            if (!regex.test(node.content)) {
              errors.push({
                field: 'content',
                message: node.validation.message || 'Content does not match required pattern'
              })
            }
          } catch (err) {
            errorHandler(err)
            errors.push({
              field: 'validation.pattern',
              message: 'Invalid regex pattern'
            })
          }
        }
      }
    }

    // Validaciones de estilo
    if (node.style) {
      if (node.style.textAlign && !['left', 'center', 'right'].includes(node.style.textAlign)) {
        errors.push({
          field: 'style.textAlign',
          message: 'Invalid text alignment'
        })
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    }
  }, [errorHandler])

  return {
    validateNode
  }
}
