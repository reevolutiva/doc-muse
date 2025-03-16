/**
 * Utilities para obtener información del esquema de tablas
 */

/**
 * Obtiene la lista de tablas disponibles
 */
export async function fetchTables(): Promise<string[]> {
  try {
    const response = await fetch('/api/tables/schema');
    if (!response.ok) throw new Error('Error al obtener las tablas');
    return response.json();
  } catch (error) {
    console.error('Error al obtener las tablas:', error);
    return [];
  }
}

/**
 * Obtiene las columnas de una tabla específica
 */
export interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: boolean;
  column_default: string | null;
}

export async function fetchTableColumns(tableName: string): Promise<ColumnInfo[]> {
  try {
    const response = await fetch(`/api/tables/schema?table=${tableName}`);
    if (!response.ok) throw new Error('Error al obtener las columnas');
    return response.json();
  } catch (error) {
    console.error(`Error al obtener las columnas de ${tableName}:`, error);
    return [];
  }
}

/**
 * Valida un mapeo de campos contra el esquema de una tabla
 */
export interface FieldMapping {
  [nodeId: string]: {
    [fieldName: string]: string;
  };
}

export function validateFieldMapping(
  mapping: FieldMapping,
  columns: ColumnInfo[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const columnNames = columns.map(c => c.column_name);

  // Verificar que todos los campos mapeados existen en la tabla
  Object.entries(mapping).forEach(([nodeId, fields]) => {
    Object.entries(fields).forEach(([fieldName, columnName]) => {
      if (!columnNames.includes(columnName)) {
        errors.push(
          `La columna "${columnName}" mapeada al campo "${fieldName}" no existe en la tabla`
        );
      }
    });
  });

  // Verificar que no hay mapeos duplicados a la misma columna
  const usedColumns = new Set<string>();
  Object.values(mapping).forEach(fields => {
    Object.values(fields).forEach(columnName => {
      if (usedColumns.has(columnName)) {
        errors.push(
          `La columna "${columnName}" está mapeada a múltiples campos`
        );
      }
      usedColumns.add(columnName);
    });
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Genera un mapeo de campos inicial basado en nombres similares
 */
export function suggestFieldMappings(
  nodes: any[],
  columns: ColumnInfo[]
): FieldMapping {
  const mapping: FieldMapping = {};
  const columnNames = columns.map(c => c.column_name);

  nodes.forEach(node => {
    const nodeMappings: { [key: string]: string } = {};

    node.data.fields.forEach((field: string) => {
      // Buscar una columna con nombre exacto o similar
      const matchingColumn = columnNames.find(colName => 
        colName.toLowerCase() === field.toLowerCase() ||
        colName.toLowerCase().includes(field.toLowerCase()) ||
        field.toLowerCase().includes(colName.toLowerCase())
      );

      if (matchingColumn) {
        nodeMappings[field] = matchingColumn;
      }
    });

    if (Object.keys(nodeMappings).length > 0) {
      mapping[node.id] = nodeMappings;
    }
  });

  return mapping;
}