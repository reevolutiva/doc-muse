import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { Template } from '@/lib/types/template'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  try {
    let query = supabase.from('document_templates').select('*')
    
    if (type) {
      query = query.eq('type', type)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching templates:', error)
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('document_templates')
      .insert({
        title: body.title,
        description: body.description,
        type: body.type || 'document',
        visual_data: body.visual_data,
        content: body.content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 })
  }
}