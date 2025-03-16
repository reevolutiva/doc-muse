-- Eliminar la columna type de la tabla projects
ALTER TABLE public.projects DROP COLUMN IF EXISTS type;

-- Eliminar cualquier índice asociado al campo type
DROP INDEX IF EXISTS idx_projects_type;