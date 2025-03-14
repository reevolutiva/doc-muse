"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { DocumentService } from "../services/document-service"
import { handleError } from "../utils/error-handler"

interface Document {
  id: string
  title: string
  content: any
  status: string
  project_id: string
  created_at: string
  updated_at: string
}

interface DocumentContextType {
  documents: Document[]
  currentDocument: Document | null
  loading: boolean
  fetchDocuments: (projectId: string) => Promise<void>
  getDocument: (documentId: string) => Promise<Document | null>
  createDocument: (projectId: string, templateId: string, config?: Record<string, any>) => Promise<boolean>
  updateDocument: (documentId: string, updates: Partial<Document>) => Promise<boolean>
  setCurrentDocument: (document: Document | null) => void
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined)

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const fetchDocuments = useCallback(async (projectId: string) => {
    setLoading(true)
    try {
      const { data, error } = await DocumentService.getDocumentsByProject(projectId)
      if (error) throw error
      if (data) {
        setDocuments(data)
      }
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }, [])

  const getDocument = useCallback(async (documentId: string): Promise<Document | null> => {
    try {
      const { data, error } = await DocumentService.getDocumentById(documentId)
      if (error) throw error
      return data
    } catch (error) {
      handleError(error)
      return null
    }
  }, [])

  const createDocument = useCallback(async (projectId: string, templateId: string, config?: Record<string, any>): Promise<boolean> => {
    try {
      const result = await DocumentService.createDocument({ 
        projectId, 
        templateId, 
        config 
      })
      
      if (result.success && result.documentId) {
        // Actualizar la lista de documentos
        const newDoc = await getDocument(result.documentId)
        if (newDoc) {
          setDocuments(prev => [newDoc, ...prev])
        }
        return true
      }
      return false
    } catch (error) {
      handleError(error)
      return false
    }
  }, [getDocument])

  const updateDocument = useCallback(async (documentId: string, updates: Partial<Document>): Promise<boolean> => {
    // Implementación de actualización de documento
    // Esto requeriría agregar un método en DocumentService
    return false
  }, [])

  return (
    <DocumentContext.Provider value={{
      documents,
      currentDocument,
      loading,
      fetchDocuments,
      getDocument,
      createDocument,
      updateDocument,
      setCurrentDocument
    }}>
      {children}
    </DocumentContext.Provider>
  )
}

export function useDocuments() {
  const context = useContext(DocumentContext)
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider')
  }
  return context
}