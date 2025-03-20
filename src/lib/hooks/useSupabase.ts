"use client"

import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import type { Database } from '../supabase.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export function useSupabaseQuery<T>(
  query: () => Promise<{ data: T | null; error: any }>,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data, error } = await query()
        console.log(data)
        if (error) throw error
        setData(data)
      } catch (err: any) {
        setError(err)
        toast.error(err.message || 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, deps)

  return { data, loading, error }
}

export function useSupabaseMutation<T>(
  mutation: () => Promise<{ data: T | null; error: any }>,
  options?: {
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
  }
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = async () => {
    try {
      setLoading(true)
      const { data, error } = await mutation()
      if (error) throw error
      if (data && options?.onSuccess) {
        options.onSuccess(data)
      }
      return data
    } catch (err: any) {
      setError(err)
      if (options?.onError) {
        options.onError(err)
      }
      toast.error(err.message || 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { execute, loading, error }
}
