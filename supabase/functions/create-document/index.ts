import { createClient, serve, corsHeaders } from '../_shared/imports'
import { RequestWithAuth, EdgeFunctionResponse } from '../_shared/types'
serve(async (req: Request) => {
  // Handle CORS preflight requests
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

    // Parse JSON body with error handling
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (e) {
      throw new Error('Invalid request body: ' + (e instanceof Error ? e.message : String(e)));
    }

    const { projectId, templateId, title, description } = requestBody;

    if (!projectId || !templateId) {
      throw new Error('Missing required fields: projectId and templateId are required')
    }

    // Get project details to verify ownership and template
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('project_template_id, user_id')
      .eq('id', projectId)
      .single()

    if (projectError) throw new Error('Project not found')
    if (project.user_id !== user.id) throw new Error('Unauthorized: you do not own this project')

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
          document_completion:document_template_id (
            completed
          )
        `)
        .eq('project_template_id', project.project_template_id)
        .eq('sequence_order', templateAssoc.sequence_order - 1)
        .single()

      if (prevError || !prevDoc?.document_completion?.[0]?.completed) {
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

    if (versionError) throw new Error('Failed to create document version: ' + versionError.message)

    // Initialize completion status
    const { error: completionError } = await supabase
      .from('document_completion')
      .insert({
        project_id: projectId,
        document_template_id: templateId,
        completed: false,
        created_by: user.id
      })

    if (completionError) throw new Error('Failed to initialize completion status: ' + completionError.message)

    // Update project documents count
    const { error: updateError } = await supabase.rpc('increment_documents_count', {
      project_id: projectId
    })

    if (updateError) {
      console.error('Failed to update documents count:', updateError)
      // Don't throw here, continue with the success response
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: version,
        documentId 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200  // Explicitly set 200 status
      }
    )

  } catch (error) {
    console.error('Error in create-document function:', error)
    
    // Always return with CORS headers, even in error cases
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
