import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Define the type for the template
interface Template {
  id: string;
  name: string;
  // Add other properties as needed
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('document_templates')
      .insert({
        title: body.title,
        description: body.description,
        visual_data: body.visual_data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { error: 'Error creating template' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Fetch templates from database or other source
    const templates: Template[] = [
      { id: '1', name: 'Template 1' },
      { id: '2', name: 'Template 2' },
    ];

    return NextResponse.json(templates);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}