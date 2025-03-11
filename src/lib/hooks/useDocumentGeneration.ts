"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { DocumentGenerationOptions } from '@/lib/types/document'

export function useDocumentGeneration() {
  const [isGenerating, setIsGenerating] = useState(false)

  const generateDocument = async (options: DocumentGenerationOptions) => {
    setIsGenerating(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Please log in to create documents')
      }

      const { error } = await supabase.functions.invoke('generate-document', {
        body: options,
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      if (error) throw error
      toast.success('Document created successfully')
    } catch (error: any) {
      console.error('Error creating document:', error)
      toast.error('Failed to create document')
      throw error
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    isGenerating,
    generateDocument
  }
}
