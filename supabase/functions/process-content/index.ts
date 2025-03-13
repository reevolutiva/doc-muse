import { createClient, serve, OpenAI, corsHeaders } from '../_shared/imports'
import type { RequestWithAuth, EdgeFunctionResponse } from '../_shared/types'

interface AIRequest {
  content: string;
  operation: 'summarize' | 'keywords' | 'style';
}

Deno.serve(async (req) => {
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

    const { content, operation }: AIRequest = await req.json()

    let prompt = ''
    switch (operation) {
      case 'summarize':
        prompt = `Please provide a concise summary of the following content:\n\n${content}`
        break
      case 'keywords':
        prompt = `Extract the main keywords and key phrases from the following content. Return them as a comma-separated list:\n\n${content}`
        break
      case 'style':
        prompt = `Analyze the writing style of the following content and provide suggestions for improvement. Focus on clarity, tone, and engagement:\n\n${content}`
        break
      default:
        throw new Error('Invalid operation')
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert content editor and writing assistant."
        },
        {
          role: "user",
          content: prompt
        }
      ],
    })

    const result = completion.choices[0].message.content

    return new Response(
      JSON.stringify({ success: true, result }),
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
