-- Add type column to project_templates table
ALTER TABLE public.project_templates 
ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'document'
CHECK (type IN ('document', 'project', 'section'));

-- Create index for type column
CREATE INDEX IF NOT EXISTS idx_project_templates_type ON public.project_templates USING btree (type);

-- Update existing templates with appropriate types
UPDATE public.project_templates
SET type = CASE 
    WHEN name ILIKE '%course%' THEN 'course'
    WHEN name ILIKE '%workshop%' THEN 'workshop'
    WHEN name ILIKE '%microlearning%' THEN 'microlearning'
    ELSE 'general'
END;