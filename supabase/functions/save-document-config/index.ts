import { createClient } from 'jsr:@supabase/supabase-js@2'
import { RequestWithAuth, EdgeFunctionResponse } from '../_shared/types'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false
        }
      }
    )

    // Get user ID from auth header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }
    const token = authHeader.replace('Bearer ', '')
    
    // Get user ID from JWT
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      throw new Error('Failed to get user information')
    }

    const { projectId, templateId, config } = await req.json()

    // Validate required fields
    if (!projectId || !templateId || !config) {
      throw new Error('Missing required fields')
    }

    // Create document version with config
    const { data: version, error: versionError } = await supabase
      .from('document_versions')
      .insert({
        document_id: crypto.randomUUID(),
        project_id: projectId,
        version_number: 1,
        content: '',
        created_by: user.id,
        origin_template_id: templateId,
        config: config
      })
      .select()
      .single()

    if (versionError) {
      throw versionError
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: version
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error instanceof Error && error.message.includes('No authorization header') ? 401 : 400
      }
    )
  }
})
