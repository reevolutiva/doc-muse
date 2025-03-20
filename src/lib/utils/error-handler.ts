"use client"

import { toast } from 'sonner'

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function handleError(error: unknown) {
  const message = error instanceof Error ? error.message : 'An unknown error occurred'
  
  if (error instanceof AppError) {
    switch (error.status) {
      case 401:
        toast.error('Your session has expired. Please log in again.')
        break
      case 403:
        toast.error('You do not have permission to perform this action.')
        break
      case 404:
        toast.error('The requested resource was not found.')
        break
      default:
        toast.error(message)
    }
  } else {
    toast.error(message)
  }
  
  console.error('Error:', error)
}

export function createErrorHandler(context: string) {
  return (error: unknown) => {
    console.error(`Error in ${context}:`, error)
    handleError(error)
  }
}
