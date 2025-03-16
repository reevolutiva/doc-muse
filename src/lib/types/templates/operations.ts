import type { 
  Template, 
  TemplateNode, 
  TemplateNodeData, 
  TemplateEdge,
  TemplateVisualData 
} from './base';

export interface TemplateValidationError {
  field: string;
  message: string;
}

export interface TemplateLoaderResult {
  templates: Template[];
  loading: boolean;
  error: Error | null;
}

export interface TemplateOperations {
  addNode: (node: TemplateNodeData) => Promise<void>;
  removeNode: (id: string) => Promise<void>;
  updateNode: (id: string, data: Partial<TemplateNodeData>) => Promise<void>;
  duplicateNode: (id: string) => Promise<void>;
  addEdge: (source: string, target: string, data?: TemplateEdge['data']) => Promise<void>;
  removeEdge: (id: string) => Promise<void>;
}

export interface TemplateValidationResult {
  isValid: boolean;
  errors?: {
    field: string;
    message: string;
  }[];
}

export interface TemplateServiceResult<T> {
  data: T | null;
  error: Error | null;
}

export interface TemplateHookResult {
  templateData: Template[];
  loading: boolean;
  error: Error | null;
  createDocument?: (template: Template) => Promise<void>;
}

export interface TemplateListItem extends Omit<Template, 'content' | 'visual_data'> {
  is_required?: boolean;
  sequence_order?: number;
}