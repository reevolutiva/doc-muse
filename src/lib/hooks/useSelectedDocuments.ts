import { useState, useCallback } from 'react'

interface SelectedDocument {
  id: string
  title: string
  isRequired: boolean
  order: number
}

interface UseSelectedDocumentsResult {
  selectedDocuments: { [key: string]: SelectedDocument }
  toggleDocument: (document: { id: string, title: string }) => void
  toggleRequired: (documentId: string) => void
  updateOrder: (documentId: string, newOrder: number) => void
  getSelectedArray: () => SelectedDocument[]
}

export function useSelectedDocuments(): UseSelectedDocumentsResult {
  const [selectedDocuments, setSelectedDocuments] = useState<{ [key: string]: SelectedDocument }>({})

  const toggleDocument = useCallback((document: { id: string, title: string }) => {
    setSelectedDocuments(prev => {
      if (prev[document.id]) {
        const { [document.id]: removed, ...rest } = prev
        return rest
      }
      
      return {
        ...prev,
        [document.id]: {
          id: document.id,
          title: document.title,
          isRequired: false,
          order: Object.keys(prev).length + 1
        }
      }
    })
  }, [])

  const toggleRequired = useCallback((documentId: string) => {
    setSelectedDocuments(prev => ({
      ...prev,
      [documentId]: {
        ...prev[documentId],
        isRequired: !prev[documentId].isRequired
      }
    }))
  }, [])

  const updateOrder = useCallback((documentId: string, newOrder: number) => {
    setSelectedDocuments(prev => {
      const documents = { ...prev }
      const currentOrder = documents[documentId].order

      // Validar límites del orden
      if (newOrder < 1) newOrder = 1
      if (newOrder > Object.keys(documents).length) {
        newOrder = Object.keys(documents).length
      }
      if (newOrder === currentOrder) return prev

      // Actualizar orden de los demás documentos
      Object.keys(documents).forEach(key => {
        if (newOrder > currentOrder) {
          if (documents[key].order <= newOrder && documents[key].order > currentOrder) {
            documents[key].order--
          }
        } else {
          if (documents[key].order >= newOrder && documents[key].order < currentOrder) {
            documents[key].order++
          }
        }
      })
      
      // Actualizar orden del documento seleccionado
      documents[documentId].order = newOrder
      return documents
    })
  }, [])

  const getSelectedArray = useCallback(() => {
    return Object.values(selectedDocuments).sort((a, b) => a.order - b.order)
  }, [selectedDocuments])

  return {
    selectedDocuments,
    toggleDocument,
    toggleRequired,
    updateOrder,
    getSelectedArray
  }
}