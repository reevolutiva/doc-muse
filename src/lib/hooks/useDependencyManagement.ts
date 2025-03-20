import { useState, useCallback } from 'react'
import { DocumentDependency } from '@/lib/types/project-template'
import { ProjectTemplateService } from '@/lib/services/project-template-service'
import { toast } from 'sonner'

export function useDependencyManagement(initialDependencies: DocumentDependency[] = []) {
  const [dependencies, setDependencies] = useState<DocumentDependency[]>(initialDependencies)
  const [loading, setLoading] = useState(false)

  const toggleDependency = useCallback((sourceId: string, targetId: string) => {
    setDependencies(prev => {
      const existingIndex = prev.findIndex(dep => 
        dep.source_id === sourceId && dep.target_id === targetId
      )
      
      if (existingIndex >= 0) {
        return prev.filter((_, i) => i !== existingIndex)
      }
      
      return [
        ...prev, 
        {
          source_id: sourceId,
          target_id: targetId,
          dependency_type: 'required',
          notes: ''
        }
      ]
    })
  }, [])

  const updateDependencyType = useCallback((sourceId: string, targetId: string, type: 'required' | 'optional') => {
    setDependencies(prev => 
      prev.map(dep => {
        if (dep.source_id === sourceId && dep.target_id === targetId) {
          return { ...dep, dependency_type: type }
        }
        return dep
      })
    )
  }, [])

  const updateDependencyNotes = useCallback((sourceId: string, targetId: string, notes: string) => {
    setDependencies(prev => 
      prev.map(dep => {
        if (dep.source_id === sourceId && dep.target_id === targetId) {
          return { ...dep, notes }
        }
        return dep
      })
    )
  }, [])

  const saveDependencies = useCallback(async () => {
    try {
      setLoading(true)
      const { success, error } = await ProjectTemplateService.saveDependencies(dependencies)
      
      if (error) throw error
      
      if (success) {
        toast.success('Dependencias guardadas correctamente')
        return true
      }
      return false
    } catch (error) {
      console.error('Error saving dependencies:', error)
      toast.error('Error al guardar las dependencias')
      return false
    } finally {
      setLoading(false)
    }
  }, [dependencies])

  return {
    dependencies,
    loading,
    toggleDependency,
    updateDependencyType,
    updateDependencyNotes,
    saveDependencies
  }
}