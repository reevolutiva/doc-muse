import { createClient, serve, corsHeaders } from '../_shared/imports'
import type { RequestWithAuth, EdgeFunctionResponse, DocumentCompletionRequest } from '../_shared/types'

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
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

    const { documentId, completed } = await req.json()

    // Get document details
    const { data: doc, error: docError } = await supabase
      .from('document_versions')
      .select(`
        id,
        project_id,
        origin_template_id,
        projects:project_id (
          user_id,
          project_template_id
        )
      `)
      .eq('id', documentId)
      .single()

    if (docError) throw new Error('Document not found')
    if (!doc.projects || doc.projects.user_id !== user.id) throw new Error('Unauthorized')

    // Update completion status
    const { error: updateError } = await supabase
      .from('document_completion')
      .upsert({
        project_id: doc.project_id,
        document_template_id: doc.origin_template_id,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        completed_by: completed ? user.id : null
      })

    if (updateError) throw new Error('Failed to update completion status')

    return new Response(
      JSON.stringify({ 
        success: true,
        message: completed ? 'Document marked as complete' : 'Document marked as incomplete'
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
        status: 400
      }
    )
  }
})
