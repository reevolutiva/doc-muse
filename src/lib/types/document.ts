import type { FileObject } from '@supabase/storage-js'

export type StorageFile = FileObject & {
  metadata?: {
    size?: number
    mimetype?: string
  }
}

export interface Document {
  name: string
  id: string
  path?: string
  size?: number
  created_at?: string
  updated_at?: string
}

export interface DocumentUploadResult {
  name: string
  id: string
  path: string
  extension: string
  size: number
}

export interface DocumentUploadOptions {
  cacheControl?: string
  upsert?: boolean
  contentType?: string
}

export interface DocumentListOptions {
  projectId: string | undefined
  onCountChange?: (count: number) => void
}

export interface DocumentUploadHookOptions {
  projectId: string | undefined
  onSuccess?: (count: number) => void
}

export type DocumentFile = FileObject & {
  metadata?: {
    size?: number
    mimetype?: string
  }
}

import { LucideIcon } from "lucide-react"

export interface DocumentTemplate {
  id: string
  title: string
  description: string
  icon: LucideIcon
  available: boolean
}

export interface DocumentGenerationOptions {
  type: string
  projectId: string
  title: string
  description: string
  templateId?: string
}
