import type { Node, Edge } from '@xyflow/react'
import type { Json } from '@/lib/supabase.types'

export interface TemplateBlock {
  blockId: string
  type: string
  data: Record<string, unknown>
  description?: string
  system?: string | null
}

export interface TemplateContent {
  time: number
  blocks: TemplateBlock[]
  version: string
}

export interface VisualData {
  nodes: Node[]
  edges: Edge[]
}

export interface Template {
  id: string
  title: string
  description?: string | null
  content?: TemplateContent | null
  visual_data?: VisualData | null
  type: 'document' | 'project' | 'section'
  created_at: string
  updated_at: string
}

export interface TemplateFormData extends Omit<Template, 'id' | 'created_at' | 'updated_at'> {
  rating?: number
  rating_count?: number
  views?: number
  featured?: boolean
  thumbnail_url?: string
  keywords?: string[]
  // Override type to make it required since it's optional in the base interface
  type: 'document' | 'project' | 'section'
}

export interface TemplateNodeData {
  label: string
  type: 'document' | 'project'
  description?: string
  isRequired?: boolean
  prompt?: string
}

export interface TemplateSettings {
  isRequired: boolean
  sequenceOrder: number
  dependencies?: string[]
}

export interface TemplateFormProps {
  onClose: () => void
  onSave: (formData: TemplateFormData) => Promise<void>
  initialData?: Partial<TemplateFormData>
  mode: 'create' | 'edit'
}

export interface TemplatesListProps {
  projectId?: string
  onSuccess?: () => void
}
