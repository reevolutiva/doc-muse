import { createClient, serve, corsHeaders } from '../_shared/imports'
import type { RequestWithAuth, EdgeFunctionResponse } from '../_shared/types'

interface TemplateData {
  title: string
  description?: string
  content: string
  config?: Record<string, unknown>
  categories?: string[]
}

interface PaginationParams {
  page?: number
  limit?: number
  search?: string
}

serve(async (req: RequestWithAuth) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    // Initialize Supabase client
    const supabaseClient = createClient(supabaseUrl, serviceRoleKey)

    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Failed to get user information')
    }

    const url = new URL(req.url)
    const templateId = url.searchParams.get('id')

    switch (req.method) {
      case 'GET': {
        const { page = 1, limit = 10, search = '' } = Object.fromEntries(
          url.searchParams.entries()
        ) as PaginationParams

        let query = supabaseClient
          .from('document_templates')
          .select('*')
          .eq('user_id', user.id)
          .is('deleted_at', null)
          .order('created_at', { ascending: false })

        if (search) {
          query = query.ilike('title', `%${search}%`)
        }

        const { data, error, count } = await query
          .range((page - 1) * limit, page * limit - 1)
          .select('*')

        if (error) throw error

        return new Response(
          JSON.stringify({
            success: true,
            data,
            pagination: {
              page,
              limit,
              total: count
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'POST': {
        const { title, description, content, config, categories }: TemplateData = await req.json()

        if (!title?.trim() || !content?.trim()) {
          throw new Error('Title and content are required')
        }

        const { data, error } = await supabaseClient
          .from('document_templates')
          .insert({
            title,
            description,
            content,
            config,
            categories,
            user_id: user.id
          })
          .select()
          .single()

        if (error) throw error

        return new Response(
          JSON.stringify({ success: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'PATCH': {
        if (!templateId) throw new Error('Template ID is required')

        const { title, description, content, config, categories }: TemplateData = await req.json()

        if (!title?.trim() || !content?.trim()) {
          throw new Error('Title and content are required')
        }

        const { data, error } = await supabaseClient
          .from('document_templates')
          .update({
            title,
            description,
            content,
            config,
            categories,
            updated_at: new Date().toISOString()
          })
          .eq('id', templateId)
          .eq('user_id', user.id)
          .is('deleted_at', null)
          .select()
          .single()

        if (error) throw error

        return new Response(
          JSON.stringify({ success: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'DELETE': {
        if (!templateId) throw new Error('Template ID is required')

        const { error } = await supabaseClient
          .from('document_templates')
          .update({
            deleted_at: new Date().toISOString()
          })
          .eq('id', templateId)
          .eq('user_id', user.id)
          .single()

        if (error) throw error

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        throw new Error(`Method ${req.method} not allowed`)
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
