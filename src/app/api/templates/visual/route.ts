import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { Template } from '@/lib/types/template'

export async function POST(request: Request) {
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseKey) {
    console.error('supabaseKey is required');
    return new NextResponse('supabaseKey is required', { status: 500 });
  }

  try {
    const { nodes, edges, title, description } = await request.json();

    // Basic validation
    if (!title) {
      return new NextResponse('Title is required', { status: 400 });
    }

    const { data, error } = await supabase
      .from('document_templates')
      .insert([
        {
          title,
          description,
          visual_data: { nodes, edges },
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return new NextResponse('Failed to create template', { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

export async function GET(request: Request) {
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseKey) {
    console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined in environment variables.");
    return new Response(JSON.stringify({ error: "Missing supabaseKey" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  
  try {
    let query = supabase
      .from('document_templates')
      .select('*')
      .not('visual_data', 'is', null)
      
    if (type) {
      query = query.eq('type', type)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching visual templates:', error)
    return NextResponse.json(
      { error: 'Error fetching visual templates' },
      { status: 500 }
    )
  }
}