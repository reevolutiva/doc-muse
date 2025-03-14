import { DocumentValidationResult } from '../types/upload'
import type { StorageFile } from '@/lib/types/document'

/**
 * Valida un archivo antes de su carga
 * 
 * @param file - Archivo a validar
 * @returns Resultado de la validación con estado y posibles errores
 */
export const validateDocument = (file: File): DocumentValidationResult => {
  const fileExt = file.name.split('.').pop()?.toLowerCase()
  const allowedExtensions = ['pdf', 'doc', 'docx', 'txt']
  
  if (!fileExt || !allowedExtensions.includes(fileExt)) {
    return {
      isValid: false,
      error: 'Invalid file type. Allowed types: PDF, DOC, DOCX, TXT'
    }
  }

  if (file.size > 50 * 1024 * 1024) {
    return {
      isValid: false,
      error: 'File size exceeds 50MB limit'
    }
  }

  return {
    isValid: true,
    extension: fileExt
  }
}

/**
 * Extrae el nombre de visualización de un archivo
 * 
 * @param file - Objeto de archivo de storage
 * @returns Nombre formateado para visualización
 */
export const extractDisplayName = (file: StorageFile): string => {
  const fullName = file.name.split('/').pop() || file.name
  return fullName.includes('-') ? fullName.split('-').slice(1).join('-') : fullName
}

/**
 * Genera una ruta única para almacenar un archivo
 * 
 * @param userId - ID del usuario
 * @param projectId - ID del proyecto
 * @param fileName - Nombre original del archivo
 * @returns Ruta completa para almacenamiento
 */
export const generateStoragePath = (userId: string, projectId: string, fileName: string): string => {
  const uniqueId = crypto.randomUUID()
  return `${userId}/${projectId}/${uniqueId}-${fileName}`
}