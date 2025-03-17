import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('template_dependencies')
      .select(`
        id,
        source_document_id,
        target_document_id,
        dependency_type
      `)
      .eq('template_id', params.id)
      
    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching template dependencies:', error)
    return NextResponse.json({ error: 'Failed to fetch dependencies' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { dependencies } = await request.json()
    
    // First, remove all existing dependencies for this template
    const { error: deleteError } = await supabase
      .from('template_dependencies')
      .delete()
      .eq('template_id', params.id)

    if (deleteError) throw deleteError

    // Then, insert new dependencies
    if (dependencies?.length > 0) {
      const { error: insertError } = await supabase
        .from('template_dependencies')
        .insert(
          dependencies.map((dep: any) => ({
            template_id: params.id,
            source_document_id: dep.source,
            target_document_id: dep.target,
            dependency_type: dep.type || 'REQUIRED'
          }))
        )

      if (insertError) throw insertError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating template dependencies:', error)
    return NextResponse.json({ error: 'Failed to update dependencies' }, { status: 500 })
  }
}