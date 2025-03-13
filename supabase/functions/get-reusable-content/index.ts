import { createClient, serve, OpenAI, corsHeaders } from '../_shared/imports'
import type { RequestWithAuth, EdgeFunctionResponse, ContentReuseRequest } from '../_shared/types'

interface AIResponse {
  message?: string;
  error?: string;
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

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })

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

    const { documentId, projectId, currentContent } = await req.json()

    // Get all document versions from this project
    const { data: versions, error: versionsError } = await supabase
      .from('document_versions')
      .select('content')
      .eq('project_id', projectId)
      .neq('id', documentId)

    if (versionsError) throw versionsError

    // Combine all content for analysis
    const allContent = versions?.map((v: { content: string }) => v.content).join('\n\n') || ''

    // Use OpenAI to find relevant content
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert at finding relevant content from a knowledge base. Given the current document content and a collection of other documents, identify and extract the most relevant sections that could be reused."
        },
        {
          role: "user",
          content: `Current document:\n${currentContent}\n\nKnowledge base:\n${allContent}\n\nFind relevant sections that could be reused in the current document.`
        }
      ],
    })

    const suggestedContent = completion.choices[0].message.content

    return new Response(
      JSON.stringify({ 
        success: true, 
        content: suggestedContent 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 400
      }
    )
  }
})
