import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

    const { projectId, templateId, title, description } = await req.json()

    if (!projectId || !templateId) {
      throw new Error('Missing required fields')
    }

    // Get project details to verify ownership and template
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('project_template_id, user_id')
      .eq('id', projectId)
      .single()

    if (projectError) throw new Error('Project not found')
    if (project.user_id !== user.id) throw new Error('Unauthorized')

    // Check if template is associated with project
    const { data: templateAssoc, error: templateError } = await supabase
      .from('project_template_doc_templates')
      .select('sequence_order, is_required')
      .eq('project_template_id', project.project_template_id)
      .eq('document_template_id', templateId)
      .single()

    if (templateError) throw new Error('Template not associated with project')

    // Check dependencies if sequence_order > 1
    if (templateAssoc.sequence_order > 1) {
      const { data: prevDoc, error: prevError } = await supabase
        .from('project_template_doc_templates')
        .select(`
          document_template_id,
          document_completion!inner (
            completed
          )
        `)
        .eq('project_template_id', project.project_template_id)
        .eq('sequence_order', templateAssoc.sequence_order - 1)
        .single()

      if (prevError || !prevDoc?.document_completion?.completed) {
        throw new Error('Previous document must be completed first')
      }
    }

    // Get template content and metadata
    const { data: template, error: contentError } = await supabase
      .from('document_templates')
      .select('content, title, description')
      .eq('id', templateId)
      .single()

    if (contentError) throw new Error('Failed to get template content')

    const documentId = crypto.randomUUID()

    // Create document version
    const { data: version, error: versionError } = await supabase
      .from('document_versions')
      .insert({
        document_id: documentId,
        project_id: projectId,
        content: template.content,
        version_number: 1,
        created_by: user.id,
        origin_template_id: templateId,
        title: title || template.title,
        description: description || template.description || ''
      })
      .select()
      .single()

    if (versionError) throw new Error('Failed to create document version')

    // Initialize completion status
    const { error: completionError } = await supabase
      .from('document_completion')
      .insert({
        project_id: projectId,
        document_template_id: templateId,
        completed: false,
        created_by: user.id
      })

    if (completionError) throw new Error('Failed to initialize completion status')

    // Update project documents count
    const { error: updateError } = await supabase.rpc('increment_documents_count', {
      project_id: projectId
    })

    if (updateError) {
      console.error('Failed to update documents count:', updateError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: version,
        documentId 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in create-document function:', error)
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
