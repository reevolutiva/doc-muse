import { useState, useCallback } from 'react'

interface LoadingState {
  initial: boolean
  saving: boolean
  loading: boolean
}

export function useLoadingState(initialState: Partial<LoadingState> = {}) {
  const [state, setState] = useState<LoadingState>({
    initial: initialState.initial ?? true,
    saving: initialState.saving ?? false,
    loading: initialState.loading ?? false
  })

  const startInitialLoading = useCallback(() => {
    setState(prev => ({ ...prev, initial: true }))
  }, [])

  const stopInitialLoading = useCallback(() => {
    setState(prev => ({ ...prev, initial: false }))
  }, [])

  const startSaving = useCallback(() => {
    setState(prev => ({ ...prev, saving: true }))
  }, [])

  const stopSaving = useCallback(() => {
    setState(prev => ({ ...prev, saving: false }))
  }, [])

  const startLoading = useCallback(() => {
    setState(prev => ({ ...prev, loading: true }))
  }, [])

  const stopLoading = useCallback(() => {
    setState(prev => ({ ...prev, loading: false }))
  }, [])

  const withLoading = useCallback(async <T,>(
    operation: () => Promise<T>,
    type: keyof LoadingState = 'loading'
  ): Promise<T> => {
    try {
      setState(prev => ({ ...prev, [type]: true }))
      return await operation()
    } finally {
      setState(prev => ({ ...prev, [type]: false }))
    }
  }, [])

  return {
    ...state,
    startInitialLoading,
    stopInitialLoading,
    startSaving,
    stopSaving,
    startLoading,
    stopLoading,
    withLoading
  }
}