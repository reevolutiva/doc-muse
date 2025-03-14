import type { Json } from '@/lib/supabase.types'
import type { Template as LibTemplate } from '@/lib/types/template'

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

export type Template = LibTemplate;

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

export interface TemplateFormData {
  title: string;
  description: string | null;
  content: Json;
}

export interface DatabaseColumn {
  table_catalog: string;
  table_schema: string;
  table_name: string;
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  is_identity: string;
}

export interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  options?: string[];
}

export interface FormConfig {
  [key: string]: {
    label: string;
    type: string;
    required: boolean;
    validation?: {
      min?: number;
      max?: number;
      pattern?: string;
      message?: string;
    };
  };
}
