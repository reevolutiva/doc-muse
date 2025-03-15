-- Eliminar la columna type de project_templates
ALTER TABLE public.project_templates DROP COLUMN IF EXISTS type;

-- Eliminar el índice asociado
DROP INDEX IF EXISTS idx_project_templates_type;