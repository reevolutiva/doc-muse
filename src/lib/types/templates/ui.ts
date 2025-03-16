import { Template } from './base';

export interface TemplateNodeProps {
  template: Template;
  data: any; // Define the correct type for data
  selected: boolean;
  id: string;
  onEdit: (data: any) => void;
  onDuplicate: (data: any) => void;
  onDelete: (id: string) => void;
  // ...other properties...
}
