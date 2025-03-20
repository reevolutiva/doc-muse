-- Alter the table to add a new column
ALTER TABLE public.project_templates
ADD COLUMN content jsonb NULL;