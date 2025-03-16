"use client"

import { useState, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Template } from '../lib/types/templates/base'
import type { TemplateLoaderResult } from '@/lib/types/templates'
import { handleError, createErrorHandler } from '@/lib/utils/error-handler'

const useTemplateLoader = (): Template[] => {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const errorHandler = createErrorHandler('TemplateLoader')

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setTemplates(data || [])
    } catch (err) {
      const error = errorHandler(err)
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [errorHandler])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  return templates
}

export default useTemplateLoader
