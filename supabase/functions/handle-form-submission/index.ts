import { createClient } from 'npm:@supabase/supabase-js@2.38.4'
import { z } from 'npm:zod@3.22.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

interface FormSubmission {
  formId: string
  data: Record<string, any>
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from auth header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) throw new Error('No authorization header')
    
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    if (authError || !user) throw new Error('Failed to get user information')

    // Parse request body
    const { formId, data }: FormSubmission = await req.json()
    if (!formId || !data) throw new Error('Missing required fields')

    // Get form validation rules
    const { data: validationRules, error: rulesError } = await supabaseClient
      .from('form_validation_rules')
      .select('*')
      .eq('template_id', formId)

    if (rulesError) throw rulesError

    // Validate form data against rules
    const validationErrors: Record<string, string[]> = {}

    for (const rule of validationRules || []) {
      const { field_name, rule_type, rule_config } = rule
      const value = data[field_name]

      try {
        let schema
        switch (rule_type) {
          case 'string':
            schema = z.string()
            if (rule_config.min) schema = schema.min(rule_config.min)
            if (rule_config.max) schema = schema.max(rule_config.max)
            if (rule_config.pattern) schema = schema.regex(new RegExp(rule_config.pattern))
            break
          case 'number':
            schema = z.number()
            if (rule_config.min) schema = schema.min(rule_config.min)
            if (rule_config.max) schema = schema.max(rule_config.max)
            break
          case 'boolean':
            schema = z.boolean()
            break
          case 'date':
            schema = z.date()
            break
          default:
            continue
        }

        schema.parse(value)
      } catch (error) {
        if (!validationErrors[field_name]) {
          validationErrors[field_name] = []
        }
        validationErrors[field_name].push(error.message)
      }
    }

    // Insert form submission
    const { error: submitError } = await supabaseClient
      .from('form_submissions')
      .insert({
        form_id: formId,
        user_id: user.id,
        data,
        status: Object.keys(validationErrors).length > 0 ? 'invalid' : 'submitted',
        validation_errors: Object.keys(validationErrors).length > 0 ? validationErrors : null
      })

    if (submitError) throw submitError

    return new Response(
      JSON.stringify({
        success: true,
        validationErrors: Object.keys(validationErrors).length > 0 ? validationErrors : null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
