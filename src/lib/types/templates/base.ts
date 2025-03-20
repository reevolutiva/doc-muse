import { LucideIcon } from 'lucide-react';
import type { Node, Edge, NodeProps } from '@xyflow/react';

export type TemplateType = 'document' | 'project' | 'section';

export interface TemplateBase {
  id: string;
  type: TemplateType;
  [key: string]: unknown; // Para compatibilidad con Record<string, unknown>
}

export interface TemplateBlock extends TemplateBase {
  content: string;
  data?: Record<string, unknown>;
  meta?: {
    description?: string;
    system?: string;
  };
}

export interface TemplateValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  message?: string;
}

export interface TemplateStyle {
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
}

export interface TemplateNodeData extends Record<string, unknown> {
  id: string;
  label: string;
  type: TemplateType;
  description?: string;
  isRequired?: boolean;
  prompt?: string;
  content?: string;
  validation?: TemplateValidation;
  style?: TemplateStyle;
}

export type TemplateNode = Node<TemplateNodeData>;

export interface TemplateEdge extends Edge {
  data?: {
    dependencyType?: 'required' | 'optional';
  };
}

export interface TemplateVisualData {
  nodes: TemplateNode[];
  edges: TemplateEdge[];
}

export interface TemplateContent {
  time: number;
  blocks: TemplateBlock[];
  version: string;
}

export interface Template extends TemplateBase {
  title: string;
  description?: string | null;
  content?: TemplateContent | null;
  visual_data?: TemplateVisualData | null;
  created_at: string;
  updated_at: string;
}

export interface TemplateListItem extends Omit<Template, 'content' | 'visual_data'> {
  is_required?: boolean;
  sequence_order?: number;
}

export interface TemplateFormData extends Omit<Template, 'id' | 'created_at' | 'updated_at'> {
  rating?: number;
  rating_count?: number;
  views?: number;
  featured?: boolean;
  thumbnail_url?: string;
  keywords?: string[];
}

export interface Template {
  id: string;
  name: string;
  // ...other properties...
}