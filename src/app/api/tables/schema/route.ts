import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const { searchParams } = new URL(request.url);
  const tableName = searchParams.get('table');

  try {
    if (tableName) {
      // Obtener columnas de una tabla específica
      const { data, error } = await supabase
        .rpc('get_table_columns', { table_name: tableName });
      if (error) throw error;
      return NextResponse.json(data);
    } else {
      // Obtener lista de tablas públicas
      const { data, error } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public');
      if (error) throw error;
      return NextResponse.json(data.map(t => t.tablename));
    }
  } catch (error) {
    console.error('Error al obtener información de la tabla:', error);
    return NextResponse.json(
      { error: 'Error al obtener información de la tabla' },
      { status: 500 }
    );
  }
}