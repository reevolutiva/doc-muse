-- Add visual_data column to document_templates table
ALTER TABLE document_templates
ADD COLUMN IF NOT EXISTS visual_data JSONB;

-- Add index for visual_data to improve query performance
CREATE INDEX IF NOT EXISTS idx_document_templates_visual_data
ON document_templates USING GIN (visual_data);

-- Add type column if it doesn't exist
ALTER TABLE document_templates
ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'document';

-- Add constraint to validate type values
ALTER TABLE document_templates
ADD CONSTRAINT document_templates_type_check
CHECK (type IN ('document', 'project', 'section'));