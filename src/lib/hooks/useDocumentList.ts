"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Document, DocumentListOptions, DocumentFile } from '@/lib/types/document'
import { extractDisplayName } from '@/lib/utils/document'
import { useSupabaseQuery } from '@/lib/hooks/useSupabase'

export function useDocumentList({ projectId, onCountChange }: DocumentListOptions) {
  const [documents, setDocuments] = useState<Document[]>([])
  const { data: files, loading: isLoading } = useSupabaseQuery<DocumentFile[]>(
    async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session || !projectId) {
        return { data: null, error: new Error('No session or project ID') }
      }
      
      return supabase.storage
        .from('project_documents')
        .list(`${session.user.id}/${projectId}`)
    },
    [projectId]
  )

  useEffect(() => {
    if (files) {
      const docs = (files || [])
        .filter((file: DocumentFile) => !file.name.endsWith('/'))
        .map((file: DocumentFile) => {
          const fullName = file.name.split('/').pop() || file.name
          const displayName = fullName.includes('-') ? 
            fullName.split('-').slice(1).join('-') : 
            fullName
          return {
            name: displayName,
            id: file.name
          }
        })
      setDocuments(docs)
    }
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
        const updated = prev.filter((doc: Document) => doc.id !== docId)
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
    isLoading,
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
