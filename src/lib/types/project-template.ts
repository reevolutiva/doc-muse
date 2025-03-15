import { Template } from "./template";
import { ReactNode } from "react"

/**
 * Interfaz que define una dependencia entre documentos en una plantilla de proyecto
 */
export interface DocumentDependency {
  source_id: string
  target_id: string
  dependency_type: 'required' | 'optional'
  notes?: string | null
}

/**
 * Interfaz que define la relación entre una plantilla de proyecto y una plantilla de documento
 */
export interface ProjectTemplateDocument {
  id: string
  document_template_id: string
  document_template: {
    id: string
    title: string
    description: string | null
  }
  is_required: boolean
  sequence_order: number
}

/**
 * Interfaz principal para una plantilla de proyecto
 */
export interface ProjectTemplate {
  id: string
  name: string
  description?: string | null
  created_at?: string
  updated_at?: string
  documents?: ProjectTemplateDocument[]
}

/**
 * Opciones para crear una nueva plantilla de proyecto
 */
export interface ProjectTemplateCreateOptions {
  name: string
  description?: string | null
}

/**
 * Props para el componente de formulario de plantilla de proyecto
 */
export interface ProjectTemplateFormProps {
  onClose: () => void
  onSave: (data: Partial<ProjectTemplate>) => Promise<void>
  initialData?: Partial<ProjectTemplate>
  mode: 'create' | 'edit'
}

/**
 * Props para el componente de lista de plantillas de proyecto
 */
export interface ProjectTemplateListProps {
  templates: ProjectTemplate[]
  onEdit: (template: ProjectTemplate) => void
  onPreview: (template: ProjectTemplate) => void
  onDelete: (id: string) => void
  loading?: boolean
  error?: any
}

/**
 * Props para el componente de gestión de plantillas de proyecto
 */
export interface ProjectTemplateManagerProps {
  onSelect?: (template: ProjectTemplate) => void
  mode?: "select" | "manage"
  typeFilter?: string
}

/**
 * Resultado del hook para gestionar plantillas de proyecto
 */
export interface UseProjectTemplatesResult {
  templates: ProjectTemplate[]
  loading: boolean
  error: any
  showDialog: boolean
  editingTemplate: ProjectTemplate | null
  setShowDialog: (show: boolean) => void
  setEditingTemplate: (template: ProjectTemplate | null) => void
  handleSaveTemplate: (data: Partial<ProjectTemplate>) => Promise<void>
  handleDelete: (id: string) => Promise<void>
  fetchTemplates: () => Promise<void>
}

/**
 * Props para el editor de dependencias de documentos
 */
export interface DocumentDependencyEditorProps {
  projectTemplate: ProjectTemplate
  onSave: () => void
  onClose: () => void
}

/**
 * Props para el componente de visualización de dependencias
 */
export interface DependencyViewProps {
  projectTemplate: ProjectTemplate;
}