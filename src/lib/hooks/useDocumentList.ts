"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Document, DocumentListOptions, DocumentFile } from '@/lib/types/document'
import { extractDisplayName } from '@/lib/utils/document'
import { useSupabaseQuery } from '@/lib/hooks/useSupabase'

export function useDocumentList({ projectId, onCountChange }: DocumentListOptions) {
  const { data: files, loading, error } = useSupabaseQuery<DocumentFile[]>(
    async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          throw new Error('Authentication required')
        }
        if (!projectId) {
          throw new Error('Project ID is required')
        }
        
        const { data, error } = await supabase.storage
          .from('project_documents')
          .list(`${session.user.id}/${projectId}`)

        if (error) throw error
        return { data, error: null }
      } catch (err: any) {
        console.error('Error fetching documents:', err)
        throw new Error(err.message || 'Failed to fetch documents')
      }
    },
    [projectId]
  )

  const [documents, setDocuments] = useState<Document[]>([])

  useEffect(() => {
    if (!files) return
    
    const docs = files
      .filter((file: DocumentFile) => !file.name.endsWith('/'))
      .map((file: DocumentFile) => {
        const fullName = file.name.split('/').pop() || file.name
        return {
          name: fullName.includes('-') ? 
            fullName.split('-').slice(1).join('-') : 
            fullName,
          id: file.name
        }
      })
    setDocuments(docs)
  }, [files])

  const deleteDocument = useCallback(async (docId: string) => {
    if (!projectId) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error("Please log in to delete documents")
        return
      }

      const { error } = await supabase.storage
        .from('project_documents')
        .remove([`${session.user.id}/${projectId}/${docId}`])

      if (error) throw error

      setDocuments(prev => {
        const updated = prev.filter(doc => doc.id !== docId)
        onCountChange?.(updated.length)
        return updated
      })
      
      toast.success('Document deleted successfully')
    } catch (error: any) {
      toast.error(`Error deleting document: ${error.message || 'Unknown error'}`)
    }
  }, [projectId, onCountChange])

  useEffect(() => {
    const channel = supabase.channel('storage_db_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'storage',
          table: 'objects',
          filter: `bucket_id=eq.project_documents`
        },
        () => {
          // Refresh documents list on changes
          if (files) {
            const docs = files
              .filter((file: DocumentFile) => !file.name.endsWith('/'))
              .map((file: DocumentFile) => ({
                name: extractDisplayName(file),
                id: file.name
              }))
            setDocuments(docs)
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [files])

  return {
    documents,
    isLoading: loading,
    deleteDocument,
    addDocument: (doc: Document) => {
      setDocuments(prev => {
        const updated = [...prev, doc]
        onCountChange?.(updated.length)
        return updated
      })
    }
  }
}
