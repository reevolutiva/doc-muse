"use client"

import { useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import type { 
  TemplateNodeData, 
  TemplateOperations,
  TemplateEdge,
  TemplateServiceResult
} from '@/lib/types/templates'
import { handleError, createErrorHandler } from '@/lib/utils/error-handler'

export function useTemplateOperations(): TemplateOperations {
  const errorHandler = createErrorHandler('TemplateOperations')

  const addNode = useCallback(async (node: TemplateNodeData): Promise<void> => {
    try {
      const { error } = await supabase
        .from('template_nodes')
        .insert([node])

      if (error) throw error
      toast.success('Node added successfully')
    } catch (err) {
      errorHandler(err)
    }
  }, [errorHandler])

  const removeNode = useCallback(async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('template_nodes')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Node removed successfully')
    } catch (err) {
      errorHandler(err)
    }
  }, [errorHandler])

  const updateNode = useCallback(async (id: string, data: Partial<TemplateNodeData>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('template_nodes')
        .update(data)
        .eq('id', id)

      if (error) throw error
      toast.success('Node updated successfully')
    } catch (err) {
      errorHandler(err)
    }
  }, [errorHandler])

  const duplicateNode = useCallback(async (id: string): Promise<void> => {
    try {
      const { data: originalNode, error: fetchError } = await supabase
        .from('template_nodes')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      if (originalNode) {
        const newNode: Omit<typeof originalNode, 'id'> & { label: string } = {
          ...originalNode,
          label: `${originalNode.label} (copy)`
        }
        delete (newNode as any).id

        const { error: insertError } = await supabase
          .from('template_nodes')
          .insert([newNode])

        if (insertError) throw insertError
        toast.success('Node duplicated successfully')
      }
    } catch (err) {
      errorHandler(err)
    }
  }, [errorHandler])

  const addEdge = useCallback(async (source: string, target: string, data?: TemplateEdge['data']): Promise<void> => {
    try {
      const { error } = await supabase
        .from('template_edges')
        .insert([{ source, target, data }])

      if (error) throw error
      toast.success('Edge added successfully')
    } catch (err) {
      errorHandler(err)
    }
  }, [errorHandler])

  const removeEdge = useCallback(async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('template_edges')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Edge removed successfully')
    } catch (err) {
      errorHandler(err)
    }
  }, [errorHandler])

  return {
    addNode,
    removeNode,
    updateNode,
    duplicateNode,
    addEdge,
    removeEdge
  }
}
