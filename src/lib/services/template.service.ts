import { supabase } from '@/lib/supabase';

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
  async saveTemplate(templateData: {
    title: string;
    description: string;
    visual_data: {
      nodes: any[];
      edges: any[];
    };
  }) {
    const { data, error } = await supabase
      .from('document_templates')
      .insert({
        title: templateData.title,
        description: templateData.description,
        visual_data: templateData.visual_data,
        type: 'visual',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTemplate(id: string, templateData: {
    title: string;
    description: string;
    visual_data: {
      nodes: any[];
      edges: any[];
    };
  }) {
    const { error } = await supabase
      .from('document_templates')
      .update({
        title: templateData.title,
        description: templateData.description,
        visual_data: templateData.visual_data,
      })
      .eq('id', id);

    if (error) throw error;
  },

  async saveDependency(sourceId: string, targetId: string, data: any) {
    const { error } = await supabase
      .from('template_dependencies')
      .insert({
        source_id: sourceId,
        target_id: targetId,
        metadata: data,
      });

    if (error) throw error;
  },

  async getTemplate(id: string) {
    const { data, error } = await supabase
      .from('document_templates')
      .select('*')
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