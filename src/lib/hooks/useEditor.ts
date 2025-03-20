"use client"

import { useRef, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import type { EditorRef } from '@/lib/types/editor'

interface UseEditorOptions {
  projectId: string
  documentId: string
  onSave?: () => void
}

export function useEditor({ projectId, documentId, onSave }: UseEditorOptions) {
  const [loading, setLoading] = useState(false)
  const [reuseLoading, setReuseLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const editorRef = useRef<EditorRef | null>(null)

  const handleSave = async () => {
    if (!editorRef.current) return

    try {
      setLoading(true)
      const content = editorRef.current.getContent()

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error("Please log in to save documents")
        return
      }

      const { error } = await supabase.functions.invoke('generate-document', {
        body: {
          projectId,
          documentId,
          content,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (error) throw error

      toast.success("Document saved successfully")
      onSave?.()
    } catch (error) {
      console.error('Error saving document:', error)
      toast.error("Failed to save document")
    } finally {
      setLoading(false)
    }
  }

  const handleReuseContent = async () => {
    if (!editorRef.current) return

    try {
      setReuseLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in to reuse content')
        return
      }

      const { data, error } = await supabase.functions.invoke('get-reusable-content', {
        body: {
          documentId,
          projectId,
          currentContent: editorRef.current.getContent()
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      if (error) throw new Error(error.message || 'Unknown error')
      if (!data?.success) throw new Error(data?.error || 'Unknown error')

      const content = data.content
      editorRef.current.insertContent(content)

      toast.success('Content suggestions added')
    } catch (error: any) {
      console.error('Error reusing content:', error)
      toast.error(error.message || 'Failed to get content suggestions')
    } finally {
      setReuseLoading(false)
    }
  }

  const handleAIOperation = async (operation: 'summarize' | 'keywords' | 'style') => {
    if (!editorRef.current) return

    try {
      setAiLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in to use AI features')
        return
      }

      const content = editorRef.current.getContent()
      const { data, error } = await supabase.functions.invoke('process-content', {
        body: { content, operation },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      if (error) throw error
      if (!data.success) throw new Error(data.error)

      // Create a modal or dialog to display the AI results
      const modalContent = document.createElement('div')
      modalContent.innerHTML = `
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 class="text-lg font-semibold mb-4">AI ${operation.charAt(0).toUpperCase() + operation.slice(1)} Results</h3>
            <div class="prose max-w-none">
              ${data.result.split('\n').map((line: string) => `<p>${line}</p>`).join('')}
            </div>
            <button class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onclick="this.closest('.fixed').remove()">
              Close
            </button>
          </div>
        </div>
      `
      document.body.appendChild(modalContent.firstElementChild!)

      toast.success(`${operation.charAt(0).toUpperCase() + operation.slice(1)} analysis completed`)
    } catch (error: any) {
      console.error('AI operation error:', error)
      toast.error(error.message || 'Failed to process content')
    } finally {
      setAiLoading(false)
    }
  }

  const handleMarkComplete = async () => {
    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error("Please log in to update document status")
        return
      }

      const { error } = await supabase.functions.invoke('update-document-status', {
        body: {
          documentId,
          completed: !isComplete
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      if (error) throw error

      setIsComplete(!isComplete)
      toast.success(isComplete ? 'Document marked as incomplete' : 'Document marked as complete')
    } catch (error: any) {
      console.error('Error updating document status:', error)
      toast.error(error.message || 'Failed to update document status')
    } finally {
      setLoading(false)
    }
  }

  return {
    editorRef,
    loading,
    reuseLoading,
    aiLoading,
    isComplete,
    handleSave,
    handleReuseContent,
    handleAIOperation,
    handleMarkComplete
  }
}
