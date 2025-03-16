-- Update document_templates table to support visual editor
ALTER TABLE document_templates
ADD COLUMN IF NOT EXISTS visual_data JSONB,
ADD COLUMN IF NOT EXISTS is_required BOOLEAN DEFAULT false;

-- Create a new table for template dependencies
CREATE TABLE IF NOT EXISTS template_dependencies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    source_id UUID REFERENCES document_templates(id) ON DELETE CASCADE,
    target_id UUID REFERENCES document_templates(id) ON DELETE CASCADE,
    dependency_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB,
    UNIQUE(source_id, target_id)
);