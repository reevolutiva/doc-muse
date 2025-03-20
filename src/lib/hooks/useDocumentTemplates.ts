import { useState, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { DocumentTemplate } from '@/lib/types/template'
import { useLoadingState } from './useLoadingState'
import { handleError } from '@/lib/utils/error-handler'

interface UseDocumentTemplatesOptions {
  initialFilter?: string
}

export function useDocumentTemplates(options: UseDocumentTemplatesOptions = {}) {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const { initial, loading, startLoading, stopLoading, withLoading } = useLoadingState()

  const fetchTemplates = useCallback(async () => {
    try {
      return await withLoading(async () => {
        const { data, error } = await supabase
          .from('document_templates')
          .select('id, title, description, content, created_at')
          .order('title')


        
          console.log( "fetchTemplates");
        
          console.log( "data: ", data );
          console.log( "error: ", error );
        
        if (error) throw error
        setTemplates(data || [])
      })
    } catch (error) {
      handleError(error, { 
        customMessage: 'Error al cargar las plantillas de documento',
        context: 'useDocumentTemplates.fetchTemplates'
      })
    }
  }, [withLoading])
 
  useEffect(() => {
    fetchTemplates()
  }, [])

  const filteredTemplates = useCallback(() => {
    if (!searchQuery) return templates
    
    const query = searchQuery.toLowerCase()
    return templates.filter(template => 
      template.title.toLowerCase().includes(query) ||
      (template.description && template.description.toLowerCase().includes(query))
    )
  }, [templates, searchQuery])

  return {
    templates: filteredTemplates(),
    searchQuery,
    setSearchQuery,
    loading: initial || loading,
    fetchTemplates
  }
}