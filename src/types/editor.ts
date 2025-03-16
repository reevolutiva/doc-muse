import { Node, Edge } from '@xyflow/react';

// Tipos base para los props de cada tipo de nodo
interface HeaderProps {
  title: string;
  subtitle?: string;
}

interface ParagraphProps {
  text: string;
}

interface ImageProps {
  url: string;
  alt?: string;
  caption?: string;
}

interface ListProps {
  items: string[];
}

interface TableProps {
  headers: string[];
  rows: string[][];
}

interface FormFieldProps {
  label: string;
  type: 'text' | 'number' | 'email' | 'tel' | 'date' | 'select' | 'textarea';
  required?: boolean;
  options?: string[]; // Para campos de tipo select
}

// Tipo unión para todos los props posibles
export type NodeProps = 
  | HeaderProps 
  | ParagraphProps 
  | ImageProps 
  | ListProps 
  | TableProps 
  | FormFieldProps;

// Tipo para los bloques disponibles en la paleta
export interface BlockType {
  id: number;
  type: string;
  name: string;
  icon: string;
  fields: string[];
  description: string;
  defaultProps: NodeProps;
}

// Tipo para los datos específicos de nuestros nodos
export interface TemplateNodeData {
  type: string;
  name: string;
  icon: string;
  label?: string;
  props: NodeProps;
}

// Extensión del tipo Node de React Flow para nuestros nodos
export interface TemplateNode extends Node {
  data: TemplateNodeData;
}

// Extensión del tipo Edge de React Flow para nuestras conexiones
export interface TemplateEdge extends Edge {
  data?: {
    relationship: string;
  };
}

// Tipo para el estado del editor
export interface EditorState {
  nodes: TemplateNode[];
  edges: TemplateEdge[];
  selectedNode: TemplateNode | null;
}

// Tipo para las acciones del editor
export type EditorAction = 
  | { type: 'SET_NODES'; payload: TemplateNode[] }
  | { type: 'SET_EDGES'; payload: TemplateEdge[] }
  | { type: 'SELECT_NODE'; payload: TemplateNode | null }
  | { type: 'UPDATE_NODE'; payload: { id: string; data: TemplateNodeData } }
  | { type: 'ADD_NODE'; payload: TemplateNode }
  | { type: 'REMOVE_NODE'; payload: string }
  | { type: 'ADD_EDGE'; payload: TemplateEdge }
  | { type: 'REMOVE_EDGE'; payload: string };

export interface Template {
  id?: string;
  name: string;
  description?: string;
  is_required: boolean;
  visual_data: {
    nodes: TemplateNode[];
    edges: TemplateEdge[];
  };
  table_mappings?: {
    table_name: string;
    field_mappings: FieldMappings;
  };
}

export interface FieldMappings {
  [nodeId: string]: {
    [fieldName: string]: string;
  };
}

export interface TableColumn {
  name: string;
  type: string;
  isNullable?: boolean;
  defaultValue?: string | null;
}