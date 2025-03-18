-- Agrega nuevamente la columna 'type' a la tabla projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS type TEXT;

-- Establece un valor por defecto para registros existentes
-- Ajusta este valor según las necesidades del negocio
UPDATE projects SET type = 'standard' WHERE type IS NULL;

-- Opcional: Agrega restricciones si son necesarias
-- ALTER TABLE projects ADD CONSTRAINT projects_type_check 
--    CHECK (type IN ('standard', 'premium', 'custom'));

-- Comentar la columna para documentación
COMMENT ON COLUMN projects.type IS 'Tipo de proyecto';