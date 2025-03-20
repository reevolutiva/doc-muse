"use client"

import { useState, useEffect, useCallback } from 'react'
import { Session } from '@supabase/supabase-js'
import { useSupabaseQuery } from '@/lib/hooks/useSupabase'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Project, DatabaseProject, mapDatabaseProjectToProject, mapDatabaseProjectsToProjects } from '@/lib/utils'

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

  const { data: dbProjects, loading, error } = useSupabaseQuery<DatabaseProject[]>(
    async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          throw new Error('No authenticated session')
        }

        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
        
        if (error) throw error
        return { data, error }
      } catch (err) {
        console.error('Error fetching projects:', err)
        throw err
      }
    },
    [state.session]
  )

  useEffect(() => {
    if (dbProjects) {
      setState(current => ({
        ...current,
        projects: dbProjects.map(mapDatabaseProjectToProject),
        loading: false
      }))
    }
  }, [dbProjects])

  const updateState = useCallback((updates: Partial<ProjectState>) => {
    setState(current => ({ ...current, ...updates }))
  }, [])

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

  const fetchProjects = useCallback(async () => {
    if (!state.session) return

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      updateState({ 
        projects: data?.map(mapDatabaseProjectToProject) || [],
        loading: false
      })
    } catch (error: any) {
      console.error('Error fetching projects:', error)
      toast.error('Failed to load projects')
    }
  }, [state.session, updateState])

  return {
    state,
    updateState,
    loadStoredProject,
    fetchProjects
  }
}
