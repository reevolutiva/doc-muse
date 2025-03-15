-- Drop existing tables and dependencies
DROP TABLE IF EXISTS public.project_template_doc_templates CASCADE;
DROP TABLE IF EXISTS public.project_templates CASCADE;

-- Crear tabla para plantillas de proyecto
CREATE TABLE public.project_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL DEFAULT 'general' CHECK (type IN ('course', 'workshop', 'microlearning', 'general')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Añadir políticas RLS para plantillas de proyecto
ALTER TABLE public.project_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir acceso a plantillas de proyecto para usuarios autenticados" ON public.project_templates
    FOR ALL USING (auth.role() = 'authenticated');

-- Política para permitir INSERT en project_templates a usuarios autenticados
CREATE POLICY "Insert project templates for authenticated users"
ON public.project_templates
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Política para permitir UPDATE en project_templates a usuarios autenticados
CREATE POLICY "Update project templates for authenticated users"
ON public.project_templates
FOR UPDATE
USING (auth.role() = 'authenticated');

-- Create index for type column
CREATE INDEX IF NOT EXISTS idx_project_templates_type ON public.project_templates USING btree (type);

-- Crear tabla de relación entre plantillas de proyecto y plantillas de documento
CREATE TABLE public.project_template_doc_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_template_id UUID REFERENCES public.project_templates(id) ON DELETE CASCADE NOT NULL,
    document_template_id UUID REFERENCES public.document_templates(id) ON DELETE CASCADE NOT NULL,
    is_required BOOLEAN DEFAULT TRUE NOT NULL,
    sequence_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(project_template_id, document_template_id)
);

-- Añadir políticas RLS para la relación
ALTER TABLE public.project_template_doc_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir acceso a relaciones de plantillas para usuarios autenticados" ON public.project_template_doc_templates
    FOR ALL USING (auth.role() = 'authenticated');

-- Crear tabla para dependencias entre documentos
CREATE TABLE IF NOT EXISTS public.document_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL,
    target_id UUID NOT NULL,
    dependency_type TEXT NOT NULL CHECK (dependency_type IN ('required', 'optional')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    CONSTRAINT fk_source FOREIGN KEY (source_id) REFERENCES public.document_templates(id) ON DELETE CASCADE,
    CONSTRAINT fk_target FOREIGN KEY (target_id) REFERENCES public.document_templates(id) ON DELETE CASCADE,
    CONSTRAINT different_docs CHECK (source_id <> target_id),
    UNIQUE(source_id, target_id)
);

-- Añadir políticas RLS para dependencias
ALTER TABLE public.document_dependencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir acceso a dependencias de documentos para usuarios autenticados" ON public.document_dependencies
    FOR ALL USING (auth.role() = 'authenticated');

-- Añadir campo template_id a la tabla de proyectos existente
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES public.project_templates(id);

-- Crear triggers para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_project_templates_timestamp
BEFORE UPDATE ON public.project_templates
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER update_project_template_doc_templates_timestamp
BEFORE UPDATE ON public.project_template_doc_templates
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER update_document_dependencies_timestamp
BEFORE UPDATE ON public.document_dependencies
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_project_templates_name ON public.project_templates USING btree (name);
CREATE INDEX IF NOT EXISTS idx_project_template_doc_templates_project_id ON public.project_template_doc_templates USING btree (project_template_id);
CREATE INDEX IF NOT EXISTS idx_project_template_doc_templates_document_id ON public.project_template_doc_templates USING btree (document_template_id);
CREATE INDEX IF NOT EXISTS idx_document_dependencies_source ON public.document_dependencies USING btree (source_id);
CREATE INDEX IF NOT EXISTS idx_document_dependencies_target ON public.document_dependencies USING btree (target_id);