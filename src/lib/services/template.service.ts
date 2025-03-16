import { supabase } from '../supabase';

export interface TemplateVisualData {
  nodes: any[];
  edges: any[];
}

export interface TemplateData {
  id?: string;
  title: string;
  description: string;
  content?: any;
  visual_data?: TemplateVisualData;
  is_required?: boolean;
}

export const templateService = {
  async saveTemplate(templateData: TemplateData) {
    const { data, error } = await supabase
      .from('document_templates')
      .insert({
        title: templateData.title,
        description: templateData.description,
        content: templateData.content,
        visual_data: templateData.visual_data,
        is_required: templateData.is_required
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTemplate(id: string, templateData: Partial<TemplateData>) {
    const { data, error } = await supabase
      .from('document_templates')
      .update({
        ...templateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async saveDependency(sourceId: string, targetId: string, metadata?: any) {
    const { data, error } = await supabase
      .from('template_dependencies')
      .insert({
        source_id: sourceId,
        target_id: targetId,
        metadata
      })
      .select();

    if (error) throw error;
    return data;
  },

  async getTemplate(id: string) {
    const { data, error } = await supabase
      .from('document_templates')
      .select(`
        *,
        dependencies:template_dependencies(
          id,
          target_id,
          dependency_type,
          metadata
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getTemplatesWithDependencies() {
    const { data, error } = await supabase
      .from('document_templates')
      .select(`
        *,
        dependencies:template_dependencies(
          id,
          target_id,
          dependency_type,
          metadata
        )
      `);

    if (error) throw error;
    return data;
  }
};