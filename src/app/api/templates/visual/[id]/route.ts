import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('document_templates')
      .update({
        title: body.title,
        description: body.description,
        type: body.type,
        visual_data: body.visual_data,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error
    if (!data) return NextResponse.json({ error: 'Template not found' }, { status: 404 })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating visual template:', error)
    return NextResponse.json(
      { error: 'Error updating visual template' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('document_templates')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) throw error
    if (!data) return NextResponse.json({ error: 'Template not found' }, { status: 404 })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching visual template:', error)
    return NextResponse.json(
      { error: 'Error fetching visual template' },
      { status: 500 }
    )
  }
}