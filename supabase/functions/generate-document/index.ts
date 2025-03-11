/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from "npm:@supabase/supabase-js@2.39.3"
import OpenAI from "npm:openai@4.24.1"

interface GenerateDocumentRequest {
  type: string
  projectId: string
  templateId: string
  description: string
}

interface Project {
  title: string
  description: string | null
  objectives: string | null
}

interface Template {
  content: string
}

// Constants
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize clients
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  }
)

const openai = new OpenAI({ 
  apiKey: Deno.env.get('OPENAI_API_KEY') ?? ''
})

// Helper functions
async function authenticateUser(authHeader: string | null) {
  if (!authHeader) {
    throw new Error('No authorization header')
  }
  const token = authHeader.replace('Bearer ', '')
  
  const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
  if (authError || !user) {
    throw new Error('Failed to get user information')
  }
  
  return user
}

async function fetchProjectAndTemplate(projectId: string, templateId: string): Promise<[Project, Template]> {
  const [projectResult, templateResult] = await Promise.all([
    supabaseClient
      .from('projects')
      .select('title, description, objectives')
      .eq('id', projectId)
      .single(),
    supabaseClient
      .from('document_templates')
      .select('content')
      .eq('id', templateId)
      .single()
  ])

  if (projectResult.error) throw projectResult.error
  if (templateResult.error) throw templateResult.error

  return [projectResult.data as Project, templateResult.data as Template]
}

async function generateContent(type: string, template: Template, project: Project, description: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an expert in creating educational content. Generate content for a ${type} based on this template: ${template.content}`
      },
      {
        role: "user",
        content: `Project Details:
Title: ${project.title}
Description: ${project.description}
Objectives: ${project.objectives}
Additional Context: ${description}`
      }
    ],
    temperature: 0.7,
  })

  if (!completion.choices[0].message.content) {
    throw new Error('No content generated')
  }

  return completion.choices[0].message.content.trim()
}

async function saveDocumentVersion(projectId: string, templateId: string, content: string, userId: string) {
  const { error: versionError } = await supabaseClient
    .from('document_versions')
    .insert({
      document_id: `${projectId}-${templateId}`,
      project_id: projectId,
      content,
      created_by: userId,
      origin_template_id: templateId
    })

  if (versionError) throw versionError
}

// Main handler
serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const user = await authenticateUser(req.headers.get('authorization'))
    const requestData: GenerateDocumentRequest = await req.json()
    const { type, projectId, templateId, description } = requestData

    const [project, template] = await fetchProjectAndTemplate(projectId, templateId)
    const content = await generateContent(type, template, project, description)
    await saveDocumentVersion(projectId, templateId, content, user.id)

    return new Response(
      JSON.stringify({ success: true, content }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
