/**
 * Tipos relacionados con la carga de documentos
 */

/**
 * Opciones para la carga de documentos
 */
export interface DocumentUploadOptions {
  cacheControl?: string
  upsert?: boolean
  contentType?: string
}

/**
 * Resultado de la validación de documentos
 */
export interface DocumentValidationResult {
  isValid: boolean
  error?: string
  extension?: string
}