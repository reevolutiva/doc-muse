"use client"

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Document, DocumentListOptions, DocumentFile } from '@/lib/types/document'
import { extractDisplayName } from '@/lib/utils/document'

export function useDocumentList({ projectId, onCountChange }: DocumentListOptions) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchDocuments = useCallback(async () => {
    if (!projectId) return

    setIsLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data: files, error } = await supabase.storage
        .from('project_documents')
        .list(`${session.user.id}/${projectId}`)

      if (error && error.message !== 'The resource was not found') {
        throw error
      }

      const docs = (files || [])
        .filter(file => !file.name.endsWith('/'))
        .map(file => {
          // Extract the original filename after the UUID prefix
          const fullName = file.name.split('/').pop() || file.name;
          const displayName = fullName.includes('-') ? fullName.split('-').slice(1).join('-') : fullName;
          return {
            name: displayName,
            id: file.name
          };
        })

      setDocuments(docs)
    } catch (error: any) {
      if (error.message !== 'The resource was not found') {
        toast.error(`Error loading documents: ${error.message || 'Unknown error'}`)
      }
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

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
    fetchDocuments()

    const channel = supabase.channel('storage_db_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'storage',
          table: 'objects',
          filter: `bucket_id=eq.project_documents`
        },
        fetchDocuments
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [fetchDocuments])

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
