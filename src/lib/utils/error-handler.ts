"use client"

import { toast } from 'sonner'

interface ErrorOptions {
  silent?: boolean
  customMessage?: string
  context?: string
}

class AppError extends Error {
  constructor(
    message: string,
    public originalError?: unknown,
    public context?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function handleError(error: unknown, options: ErrorOptions = {}) {
  const { silent = false, customMessage, context } = options
  
  // Log error
  console.error('Error:', {
    error,
    context,
    customMessage
  })

  // Determine error message to show
  let displayMessage = customMessage
  
  if (!displayMessage) {
    if (error instanceof AppError) {
      displayMessage = error.message
    } else if (error instanceof Error) {
      displayMessage = error.message
    } else if (typeof error === 'string') {
      displayMessage = error
    } else {
      displayMessage = 'Ha ocurrido un error inesperado'
    }
  }

  // Show toast unless silent
  if (!silent) {
    toast.error(displayMessage)
  }

  // Return formatted error
  return new AppError(displayMessage, error, context)
}

export function createErrorHandler(defaultContext: string) {
  return (error: unknown, options: Omit<ErrorOptions, 'context'> = {}) => {
    return handleError(error, { ...options, context: defaultContext })
  }
}

export { AppError }
