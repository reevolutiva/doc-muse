"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import type { TemplateNodeData, TemplateOperations } from '@/lib/types/templates'
import { handleError, createErrorHandler } from '@/lib/utils/error-handler'

export function useTemplateOperations(): TemplateOperations {
  const errorHandler = createErrorHandler('TemplateOperations')

  const addNode = async (node: TemplateNodeData) => {
    try {
      const { error } = await supabase
        .from('template_nodes')
        .insert([node])

      if (error) throw error
      toast.success('Node added successfully')
    } catch (err) {
      errorHandler(err)
    }
  }

  const removeNode = async (id: string) => {
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
  }

  const updateNode = async (id: string, data: Partial<TemplateNodeData>) => {
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
  }

  const duplicateNode = async (id: string) => {
    try {
      const { data: originalNode, error: fetchError } = await supabase
        .from('template_nodes')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      if (originalNode) {
        const newNode = {
          ...originalNode,
          id: undefined,
          label: `${originalNode.label} (copy)`
        }

        const { error: insertError } = await supabase
          .from('template_nodes')
          .insert([newNode])

        if (insertError) throw insertError
        toast.success('Node duplicated successfully')
      }
    } catch (err) {
      errorHandler(err)
    }
  }

  return {
    addNode,
    removeNode,
    updateNode,
    duplicateNode
  }
}
