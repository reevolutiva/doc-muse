import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { documentIds } = await request.json()
    
    // Add documents to the template
    const { error } = await supabase
      .from('template_documents')
      .insert(
        documentIds.map((docId: string) => ({
          template_id: params.id,
          document_id: docId,
          sequence_order: 0, // Default order
          is_required: false // Default not required
        }))
      )

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error adding documents to template:', error)
    return NextResponse.json({ error: 'Failed to add documents' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { documents } = await request.json()
    
    // Update document settings in the template
    const { error } = await supabase
      .from('template_documents')
      .upsert(
        documents.map((doc: any) => ({
          template_id: params.id,
          document_id: doc.id,
          sequence_order: doc.sequence_order,
          is_required: doc.is_required
        }))
      )

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating template documents:', error)
    return NextResponse.json({ error: 'Failed to update documents' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { documentId } = await request.json()
    
    const { error } = await supabase
      .from('template_documents')
      .delete()
      .match({ 
        template_id: params.id,
        document_id: documentId 
      })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing document from template:', error)
    return NextResponse.json({ error: 'Failed to remove document' }, { status: 500 })
  }
}