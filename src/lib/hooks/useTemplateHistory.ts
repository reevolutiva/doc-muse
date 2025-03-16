import { useCallback, useRef, useState } from 'react'
import type { Node, Edge } from '@xyflow/react'
import type { TemplateNodeData } from '@/components/TemplateNode'

interface HistoryState {
  nodes: Node<TemplateNodeData>[]
  edges: Edge[]
  title: string
  description: string
}

interface UseTemplateHistoryResult<T> {
  canUndo: boolean
  canRedo: boolean
  undo: () => T | undefined
  redo: () => T | undefined
  saveState: (state: T) => void
}

const MAX_HISTORY_SIZE = 50

export function useTemplateHistory<T>(): UseTemplateHistoryResult<T> {
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  
  const history = useRef<T[]>([])
  const currentIndex = useRef(-1)

  const saveState = useCallback((state: T) => {
    const nextIndex = currentIndex.current + 1
    history.current = history.current.slice(0, nextIndex)
    history.current.push(state)
    
    if (history.current.length > MAX_HISTORY_SIZE) {
      history.current.shift()
      currentIndex.current--
    }
    
    currentIndex.current = nextIndex
    setCanUndo(true)
    setCanRedo(false)
  }, [])

  const undo = useCallback((): T | undefined => {
    if (currentIndex.current <= 0) return undefined
    
    currentIndex.current--
    setCanRedo(true)
    setCanUndo(currentIndex.current > 0)
    
    return history.current[currentIndex.current]
  }, [])

  const redo = useCallback((): T | undefined => {
    if (currentIndex.current >= history.current.length - 1) return undefined
    
    currentIndex.current++
    setCanUndo(true)
    setCanRedo(currentIndex.current < history.current.length - 1)
    
    return history.current[currentIndex.current]
  }, [])

  return {
    canUndo,
    canRedo,
    undo,
    redo,
    saveState
  }
}