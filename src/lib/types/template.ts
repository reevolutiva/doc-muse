export interface TemplateBlock {
  blockId: string;
  type: string;
  data: Record<string, any>;
  description?: string;
  system?: string;
}

export interface TemplateContent {
  time: number;
  blocks: TemplateBlock[];
  version: string;
}

export interface BaseTemplate {
  id: string;
  title: string;
  description: string | null;
}

export interface Template extends BaseTemplate {
  content: TemplateContent;
  is_required: boolean;
  sequence_order: number;
  rating?: number;
  rating_count?: number;
  views?: number;
  type?: string;
  featured?: boolean;
  thumbnail_url?: string;
  keywords?: string[];
  created_at: string;
  updated_at: string;
}

export type TemplateListItem = Template;

export interface TemplateFormData extends Omit<Template, 'id' | 'created_at' | 'updated_at' | 'is_required' | 'sequence_order'> {
  content: TemplateContent;
}

export interface TemplateOperations {
  saveTemplate: (template: TemplateFormData) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  loading: boolean;
}

export interface DocumentTemplate extends BaseTemplate {
  content: string;
}

export interface TemplateFormProps {
  onClose: () => void;
  onSave: (formData: TemplateFormData) => Promise<void>;
  initialData?: TemplateFormData;
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
