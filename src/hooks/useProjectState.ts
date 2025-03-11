"use client"

import { useState, useCallback } from 'react'
import { Session } from '@supabase/supabase-js'
import { Project, mapDatabaseProjectToProject } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface ProjectState {
  loading: boolean
  session: Session | null
  projects: Project[]
  showAuthForm: boolean
  showProjectForm: boolean
  showProjectDetails: boolean
  showEditForm: boolean
  searchQuery: string
  currentProject: Project | null
}

export function useProjectState() {
  const [state, setState] = useState<ProjectState>(() => ({
    loading: true,
    session: null,
    projects: [],
    showAuthForm: false,
    showProjectForm: false,
    showProjectDetails: false,
    showEditForm: false,
    searchQuery: "",
    currentProject: null
  }))

  const updateState = useCallback((updates: Partial<ProjectState>) => {
    setState(current => ({ ...current, ...updates }))
  }, [])

  const fetchProjects = useCallback(async () => {
    if (!state.session) return

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        toast.error(error.message)
        return
      }

      updateState({ projects: data?.map(mapDatabaseProjectToProject) || [] })
    } catch (error: any) {
      toast.error('Error fetching projects')
      console.error('Fetch error:', error)
    }
  }, [state.session])

  const loadStoredProject = useCallback(() => {
    if (typeof window === 'undefined') return

    try {
      const storedProject = localStorage.getItem('currentProject')
      if (!storedProject) return

      const parsed = JSON.parse(storedProject)
      updateState({
        currentProject: parsed,
        showProjectDetails: true
      })
    } catch (error) {
      console.error('Error loading stored project:', error)
      localStorage.removeItem('currentProject')
    }
  }, [updateState])

  return {
    state,
    updateState,
    fetchProjects,
    loadStoredProject
  }
}
