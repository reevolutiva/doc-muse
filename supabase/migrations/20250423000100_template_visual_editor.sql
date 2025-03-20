-- Enable PostgreSQL extensions
create extension if not exists "uuid-ossp";

-- Update document_templates table to support visual editor
ALTER TABLE document_templates
ADD COLUMN IF NOT EXISTS visual_data JSONB DEFAULT '{"nodes": [], "edges": []}',
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

-- Create table for template field mappings
create table if not exists template_table_mappings (
    id uuid default uuid_generate_v4() primary key,
    template_id uuid references document_templates(id) on delete cascade,
    table_name text not null,
    field_mappings jsonb not null default '{}',
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(template_id, table_name)
);

-- Add updated_at trigger for template_table_mappings
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_template_mappings_updated_at
    before update on template_table_mappings
    for each row
    execute function update_updated_at_column();

-- Add indexes for better query performance
create index if not exists idx_template_visual_data on document_templates using gin (visual_data);
create index if not exists idx_template_mappings_template_id on template_table_mappings(template_id);
create index if not exists idx_template_mappings_table_name on template_table_mappings(table_name);

-- Add helper function to get table columns
create or replace function get_table_columns(table_name text)
returns table (
    column_name text,
    data_type text,
    is_nullable boolean,
    column_default text
) as $$
begin
    return query
    select 
        c.column_name::text,
        c.data_type::text,
        c.is_nullable::boolean,
        c.column_default::text
    from information_schema.columns c
    where c.table_schema = 'public'
    and c.table_name = table_name
    order by c.ordinal_position;
end;
$$ language plpgsql;