export interface TemplateNodeData {
  id: string;
  type: string;
  // ...other properties...
}

export interface TemplateNodeProps {
  data: TemplateNodeData;
  // ...other props...
}

export interface TemplateCanvasProps {
  nodes: TemplateNodeData[];
  // ...other props...
}

export interface TemplateLoaderResult {
  templates: TemplateNodeData[];
  // ...other properties...
}

export interface TemplatesResult {
  templates: TemplateNodeData[];
  // ...other properties...
}

export interface TemplateValidationResult {
  isValid: boolean;
  // ...other properties...
}

export interface TemplateOperations {
  addNode: (node: TemplateNodeData) => void;
  removeNode: (id: string) => void;
  // ...other operations...
}
