import { supabase } from '@/lib/supabase';

/**
 * Guarda una plantilla nueva o actualiza una existente
 * @param {Object} template - Datos de la plantilla
 * @param {Object} templateVisualData - Datos visuales de la plantilla (nodos, conexiones)
 * @returns {Promise} - Promesa con los datos de la plantilla guardada
 */
export async function saveTemplate(template, templateVisualData = {}) {
  try {
    // Preparar los datos para guardar en la DB
    const templateData = {
      name: template.name,
      description: template.description || '',
      is_required: template.is_required || false,
      // Guardamos la información visual como JSONB
      visual_data: templateVisualData,
      // Si hay otros campos, los preservamos
      ...template
    };

    let result;

    if (template.id) {
      // Actualizar plantilla existente
      const { data, error } = await supabase
        .from('templates')
        .update(templateData)
        .eq('id', template.id)
        .select();

      if (error) throw error;
      result = data[0];
    } else {
      // Crear nueva plantilla
      const { data, error } = await supabase
        .from('templates')
        .insert(templateData)
        .select();

      if (error) throw error;
      result = data[0];
    }

    return result;
  } catch (error) {
    console.error('Error al guardar la plantilla:', error);
    throw error;
  }
}

/**
 * Carga una plantilla específica por ID
 * @param {number|string} templateId - ID de la plantilla a cargar
 * @returns {Promise} - Promesa con los datos de la plantilla
 */
export async function loadTemplate(templateId) {
  try {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error al cargar la plantilla:', error);
    throw error;
  }
}

/**
 * Lista todas las plantillas disponibles
 * @param {Object} filters - Filtros opcionales
 * @returns {Promise} - Promesa con la lista de plantillas
 */
export async function listTemplates(filters = {}) {
  try {
    let query = supabase.from('templates').select('*');

    // Aplicar filtros si existen
    if (filters.isRequired !== undefined) {
      query = query.eq('is_required', filters.isRequired);
    }

    // Ordenar por nombre
    query = query.order('name');

    const { data, error } = await query;

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error al listar las plantillas:', error);
    throw error;
  }
}

/**
 * Elimina una plantilla
 * @param {number|string} templateId - ID de la plantilla a eliminar
 * @returns {Promise} - Promesa con el resultado de la operación
 */
export async function deleteTemplate(templateId) {
  try {
    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', templateId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar la plantilla:', error);
    throw error;
  }
}

/**
 * Conexión entre tabla de datos y plantilla
 * @param {number|string} templateId - ID de la plantilla
 * @param {string} tableName - Nombre de la tabla en Supabase
 * @param {Object} fieldMappings - Mapeo de campos {nodeId: {fieldName: column}}
 * @returns {Promise} - Promesa con el resultado de la operación
 */
export async function mapTemplateToTable(templateId, tableName, fieldMappings) {
  try {
    const mappingData = {
      template_id: templateId,
      table_name: tableName,
      field_mappings: fieldMappings
    };

    // Verificamos si ya existe un mapeo
    const { data: existingMapping } = await supabase
      .from('template_table_mappings')
      .select('id')
      .eq('template_id', templateId)
      .eq('table_name', tableName)
      .single();

    let result;
    
    if (existingMapping) {
      // Actualizar mapeo existente
      const { data, error } = await supabase
        .from('template_table_mappings')
        .update({ field_mappings: fieldMappings })
        .eq('id', existingMapping.id)
        .select();

      if (error) throw error;
      result = data[0];
    } else {
      // Crear nuevo mapeo
      const { data, error } = await supabase
        .from('template_table_mappings')
        .insert(mappingData)
        .select();

      if (error) throw error;
      result = data[0];
    }

    return result;
  } catch (error) {
    console.error('Error al mapear plantilla con tabla:', error);
    throw error;
  }
}

/**
 * Obtiene el mapeo de una plantilla con una tabla
 * @param {number|string} templateId - ID de la plantilla
 * @param {string} tableName - Nombre de la tabla (opcional)
 * @returns {Promise} - Promesa con el mapeo
 */
export async function getTemplateMappings(templateId, tableName = null) {
  try {
    let query = supabase
      .from('template_table_mappings')
      .select('*')
      .eq('template_id', templateId);
    
    if (tableName) {
      query = query.eq('table_name', tableName);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error al obtener mapeo de plantilla:', error);
    throw error;
  }
}
