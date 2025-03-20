"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import type { DocumentVersion } from "@/lib/types/document-version"

export function useDocumentView() {
  const [document, setDocument] = useState<DocumentVersion | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchDocument = async () => {
    try {
      const storedDocId = localStorage.getItem('currentDocumentId')
      if (!storedDocId) {
        throw new Error('No document selected')
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Please log in to view documents')
      }

      const { data, error } = await supabase
        .from('document_versions')
        .select('*')
        .eq('id', storedDocId)
        .single()

      if (error) throw error
      if (!data) throw new Error('Document not found')

      const documentData = {
        ...data,
        title: data.document_id,
        config: data.config
      } as DocumentVersion
      
      setDocument(documentData)
    } catch (error: any) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocument()
  }, [])

  return {
    document,
    loading,
    fetchDocument
  }
}
