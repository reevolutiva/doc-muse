import { createClient } from '@supabase/supabase-js'
import { OpenAI } from 'openai'

export { createClient, OpenAI }

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
}

// Environment helper
export const getEnvVar = (key: string): string => {
  try {
    const value = Deno.env.get(key)
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`)
    }
    return value
  } catch (err) {
    const error = err as Error
    throw new Error(`Environment error: ${error.message}`)
  }
}

// Serve helper with improved error handling
export const serve = (handler: (req: Request) => Promise<Response>) => {
  return Deno.serve(async (req) => {
    try {
      return await handler(req)
    } catch (err) {
      const error = err as Error
      console.error('Error handling request:', error)
      return new Response(
        JSON.stringify({ 
          error: error instanceof Error ? error.message : 'Internal server error'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
  })
}
