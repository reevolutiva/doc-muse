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

interface ErrorWithMessage {
  message: string
  code?: string
  status?: number
  details?: any
}

/**
 * Maneja errores de manera centralizada para mostrar mensajes de error apropiados
 * y registrar detalles del error cuando sea necesario.
 */
export function handleError(error: unknown): void {
  // Convierte el error a un formato consistente
  const processedError = normalizeError(error)
  
  // Registra el error en consola para depuración
  console.error(
    "Error:", 
    processedError.message, 
    processedError.code ? `(Código: ${processedError.code})` : "",
    processedError.details || ""
  )

  // Mostrar mensaje apropiado basado en el tipo de error
  if (processedError.code === "PGRST301" || processedError.status === 401) {
    toast.error("La sesión ha expirado. Por favor, inicia sesión de nuevo.")
    // Aquí se podría redirigir al login o invocar logout
  } else if (processedError.code === "23502") { // Violación de no nulos en PostgreSQL
    const column = String(processedError.message).match(/column "([^"]+)"/)?.[1] || "campo"
    toast.error(`El campo ${column} es obligatorio`)
  } else if (processedError.code === "23503") { // Violación de clave foránea
    toast.error("Se ha seleccionado una referencia no válida")
  } else if (processedError.status === 404) {
    toast.error("No se encontró el recurso solicitado")
  } else if (processedError.status && processedError.status >= 500) {
    toast.error("Error interno del servidor. Por favor, inténtalo de nuevo más tarde.")
  } else {
    // Mensaje genérico para otros errores
    toast.error(processedError.message || "Ocurrió un error inesperado")
  }
}

/**
 * Normaliza diferentes formatos de error en una estructura consistente
 */
function normalizeError(error: unknown): ErrorWithMessage {
  if (typeof error === "string") {
    return { message: error }
  }
  
  if (error instanceof Error) {
    const anyError = error as any
    return {
      message: error.message || "Error desconocido",
      code: anyError.code,
      status: anyError.status || anyError.statusCode,
      details: anyError.details || undefined
    }
  }
  
  // Manejo de errores de Supabase
  if (typeof error === "object" && error !== null) {
    const anyError = error as any
    return {
      message: anyError.message || anyError.error_description || "Error desconocido",
      code: anyError.code,
      status: anyError.status || anyError.statusCode,
      details: anyError.details || undefined
    }
  }
  
  return { message: "Error desconocido" }
}

export function createErrorHandler(context: string) {
  return (error: unknown) => {
    console.error(`Error in ${context}:`, error)
    handleError(error)
  }
}
