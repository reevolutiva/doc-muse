import type { Json } from '@/lib/supabase.types'

export interface DocumentVersion {
  id: string
  content: string
  title?: string
  project_id: string
  document_id: string
  version_number: number
  created_at: string | null
  created_by: string
  origin_template_id: string | null
  config: Record<string, unknown> | null
}

export interface DocumentVersionResponse {
  id: string
  content: string
  document_id: string
  project_id: string
  version_number: number
  created_at: string | null
  created_by: string
  origin_template_id: string | null
  config: Json | null
}
