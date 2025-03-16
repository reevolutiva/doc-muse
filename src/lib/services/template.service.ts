import { supabase } from '@/lib/supabase'
import { validateTemplateData, validateDependencies } from '../utils/template-helpers'
import type { Template, VisualData } from '../types/template'

interface VisualTemplateData {
  title: string
  description?: string
  visual_data: VisualData
  type?: 'document' | 'project' | 'section'
}

class TemplateService {
  async getTemplate(id: string): Promise<Template> {
    const { data, error } = await supabase
      .from('document_templates')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) throw new Error('Template not found')
    
    return data
  }

  async saveTemplate(template: VisualTemplateData): Promise<Template> {
    // Validate template data
    const validation = validateTemplateData({ 
      id: '', // Temporary ID for validation
      title: template.title,
      visual_data: template.visual_data,
      type: template.type || 'document',
      created_at: '',
      updated_at: ''
    })

    if (!validation.isValid) {
      throw new Error(`Invalid template data: ${validation.errors.join(', ')}`)
    }

    // Validate dependencies if visual data is present
    if (template.visual_data) {
      const depValidation = validateDependencies(template.visual_data)
      if (!depValidation.isValid) {
        throw new Error(`Invalid dependencies: ${depValidation.errors.join(', ')}`)
      }
    }

    const { data, error } = await supabase
      .from('document_templates')
      .insert({
        title: template.title,
        description: template.description,
        visual_data: template.visual_data,
        type: template.type || 'document',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateTemplate(id: string, template: Partial<VisualTemplateData>): Promise<Template> {
    // Get existing template to merge with updates
    const existing = await this.getTemplate(id)
    const merged = {
      ...existing,
      ...template,
      visual_data: template.visual_data || existing.visual_data
    }

    // Validate merged data
    const validation = validateTemplateData(merged)
    if (!validation.isValid) {
      throw new Error(`Invalid template data: ${validation.errors.join(', ')}`)
    }

    // Validate dependencies if visual data is present
    if (merged.visual_data) {
      const depValidation = validateDependencies(merged.visual_data)
      if (!depValidation.isValid) {
        throw new Error(`Invalid dependencies: ${depValidation.errors.join(', ')}`)
      }
    }

    const { data, error } = await supabase
      .from('document_templates')
      .update({
        ...template,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    if (!data) throw new Error('Template not found')
    
    return data
  }

  async deleteTemplate(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('document_templates')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }

  async getTemplates(): Promise<Template[]> {
    const { data, error } = await supabase
      .from('document_templates')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }
}

export const templateService = new TemplateService()