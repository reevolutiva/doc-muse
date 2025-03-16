import { useEffect, useCallback } from 'react'
import type { Node, Edge } from '@xyflow/react'
import type { TemplateNodeData } from '@/components/TemplateNode'

interface UseTemplateEditorKeyboardProps {
  nodes: Node<TemplateNodeData>[]
  edges: Edge[]
  selectedNode: Node<TemplateNodeData> | null
  onNodesChange: (nodes: Node<TemplateNodeData>[]) => void
  onEdgesChange: (edges: Edge[]) => void
  onSave: () => void
  onDelete?: (nodeId: string) => void
  onUndo?: () => void
  onRedo?: () => void
  canUndo?: boolean
  canRedo?: boolean
}

export function useTemplateEditorKeyboard({
  nodes,
  edges,
  selectedNode,
  onNodesChange,
  onEdgesChange,
  onSave,
  onDelete,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}: UseTemplateEditorKeyboardProps) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ignorar eventos si el foco está en un input
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      return
    }

    // Guardar con Cmd/Ctrl + S
    if ((event.metaKey || event.ctrlKey) && event.key === 's') {
      event.preventDefault()
      onSave()
      return
    }

    // Eliminar nodo seleccionado con Delete o Backspace
    if (
      selectedNode && 
      (event.key === 'Delete' || event.key === 'Backspace')
    ) {
      event.preventDefault()
      if (onDelete) {
        onDelete(selectedNode.id)
      } else {
        onNodesChange(nodes.filter(n => n.id !== selectedNode.id))
        onEdgesChange(
          edges.filter(
            e => e.source !== selectedNode.id && e.target !== selectedNode.id
          )
        )
      }
      return
    }

    // Copiar nodo con Cmd/Ctrl + D
    if (selectedNode && (event.metaKey || event.ctrlKey) && event.key === 'd') {
      event.preventDefault()
      const newNode: Node<TemplateNodeData> = {
        ...selectedNode,
        id: `${selectedNode.id}_copy_${Date.now()}`,
        position: {
          x: selectedNode.position.x + 20,
          y: selectedNode.position.y + 20
        }
      }
      onNodesChange([...nodes, newNode])
      return
    }

    // Deshacer con Cmd/Ctrl + Z
    if ((event.metaKey || event.ctrlKey) && !event.shiftKey && event.key === 'z') {
      event.preventDefault()
      if (canUndo && onUndo) {
        onUndo()
      }
      return
    }

    // Rehacer con Cmd/Ctrl + Shift + Z o Cmd/Ctrl + Y
    if (
      ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'z') ||
      ((event.metaKey || event.ctrlKey) && event.key === 'y')
    ) {
      event.preventDefault()
      if (canRedo && onRedo) {
        onRedo()
      }
      return
    }

    // Agrupar/Desagrupar nodos con Cmd/Ctrl + G
    if ((event.metaKey || event.ctrlKey) && event.key === 'g') {
      event.preventDefault()
      // TODO: Implementar lógica de agrupación
      return
    }
  }, [
    nodes, 
    edges, 
    selectedNode, 
    onNodesChange, 
    onEdgesChange, 
    onSave, 
    onDelete,
    onUndo,
    onRedo,
    canUndo,
    canRedo
  ])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return {
    duplicateNode: useCallback(
      (node: Node<TemplateNodeData>) => {
        const newNode: Node<TemplateNodeData> = {
          ...node,
          id: `${node.id}_copy_${Date.now()}`,
          position: {
            x: node.position.x + 20,
            y: node.position.y + 20
          }
        }
        onNodesChange([...nodes, newNode])
      },
      [nodes, onNodesChange]
    )
  }
}