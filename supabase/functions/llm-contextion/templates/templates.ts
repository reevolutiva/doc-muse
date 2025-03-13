async function get_template_documents_by( key: string, value: string,  supabaseClient: SupabaseClient, ) {

  const { data, error } = await supabaseClient
    .from('document_templates')
    .select("*")
    .eq( key, value )

  if (error) throw error

  if( Array.isArray(data)  && data.length === 1 ) {
    return data[0]
  }

  return data

}

export { get_template_documents_by }