"use client"

import { useCallback, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import useTemplateLoader from "./useTemplateLoader"
import type { Template, TemplateHookResult } from '@/lib/types/templates'
import { handleError, createErrorHandler } from '@/lib/utils/error-handler'

export interface Template {
  id: string;
  name: string;
  description?: string;
  nodes?: any[];
  edges?: any[];
}

export function useTemplates(projectId?: string): TemplateHookResult {
  const errorHandler = createErrorHandler('Templates')
  const { templates, loading, error } = useTemplateLoader()

  const [templates, setTemplates] = useState<Template[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const { data, error: supabaseError } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      setTemplates(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error fetching templates');
      setTemplates(null);
    } finally {
      setIsLoading(false);
    }
  };

  const createTemplate = async (templateData: Partial<Template>) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('templates')
        .insert([templateData])
        .select()
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      // Actualizar la lista de plantillas
      setTemplates(prev => prev ? [data, ...prev] : [data]);
      return data;
    } catch (err: any) {
      setError(err.message || 'Error creating template');
      throw err;
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const createDocument = useCallback(async (template: Template): Promise<void> => {
    if (!projectId) {
      const error = new Error('Project ID is required')
      errorHandler(error)
      throw error
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Please log in to create documents')
      }

      const { data, error: invokeError } = await supabase.functions.invoke('create-document', {
        body: { 
          projectId,
          templateId: template.id
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      if (invokeError) throw invokeError
      if (!data?.success) throw new Error(data?.error || 'Failed to create document')

      toast.success('Document created successfully')
    } catch (err) {
      errorHandler(err)
      throw err
    }
  }, [projectId, errorHandler])

  return {
    templateData: templates,
    loading,
    error,
    createDocument,
    fetchTemplates,
    createTemplate
  }
}
