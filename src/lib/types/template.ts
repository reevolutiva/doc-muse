import type { Json } from '@/lib/supabase.types'

export interface TemplateBlock {
  blockId: string;
  type: string;
  data: Record<string, unknown>;
  description?: string;
  system?: string | null;
}

export interface TemplateContent {
  time: number;
  blocks: TemplateBlock[];
  version: string;
}

export interface Template {
  id: string;
  title: string;
  description?: string;
  content: TemplateContent;
  type: 'document' | 'project' | 'section';
  created_at: string;
  updated_at: string;
}

export interface TemplateFormData extends Omit<Template, 'id' | 'created_at' | 'updated_at'> {
  rating?: number;
  rating_count?: number;
  views?: number;
  featured?: boolean;
  thumbnail_url?: string;
  keywords?: string[];
  // Override type to make it required since it's optional in the base interface
  type: 'document' | 'project' | 'section';
}

export type TemplateListItem = Template;

export interface DocumentTemplate {
  id: string;
  title: string;
  description: string | null;
  content: string;
}

export interface TemplateFormProps {
  onClose: () => void;
  onSave: (formData: FormData) => Promise<void>;
  initialData?: FormData;
  mode: 'create' | 'edit';
}

export interface TemplateData {
  document_template_id: string;
  is_required: boolean;
  sequence_order: number;
  document_templates: DocumentTemplate;
}

export interface TemplatesListProps {
  projectId?: string;
  onSuccess?: () => void;
}

export interface TemplateLoaderResult {
  templateData: TemplateData[] | null;
  loading: boolean;
  error: Error | null;
}

export interface TemplateHookResult extends TemplateLoaderResult {
  createDocument: (template: TemplateListItem) => Promise<void>;
}
