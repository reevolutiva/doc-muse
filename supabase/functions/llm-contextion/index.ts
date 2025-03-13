// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient, SupabaseClient } from 'jsr:@supabase/supabase-js@2'
import { get_template_documents_by } from './templates/templates.ts'
import { trainerbotClient } from './trainerbot/client.ts'
import corsHeaders from './cors.ts'

Deno.serve(async (req) => {

  const { template, task } = await req.json()

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
  const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

  const supabaseClient = createClient( SUPABASE_URL, SUPABASE_ANON_KEY, { global: { headers: { Authorization: req.headers.get('Authorization')! }, }, } )
  const { generateDocument } = trainerbotClient;

  let salida

  if( "doc-gen" === task ) {

    salida = await get_template_documents_by( template.key , template.value, supabaseClient );

    const { content, title, description } = salida
    const { blocks } = content

    const document = await generateDocument( "wp", 210 , blocks, title, description )

    salida = document
  }

  return new Response(
    JSON.stringify(salida),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    },
  )
})

