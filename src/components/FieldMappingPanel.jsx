import React, { useState, useEffect } from 'react';
import './FieldMappingPanel.css';

function FieldMappingPanel({ nodes, tableColumns, initialMappings, onMappingChange }) {
  const [mappings, setMappings] = useState({});
  
  // Inicializar mappings con los valores existentes
  useEffect(() => {
    if (initialMappings) {
      setMappings(initialMappings);
    }
  }, [initialMappings]);

  // Función para actualizar el mapeo de un campo
  const handleMappingChange = (nodeId, fieldName, columnName) => {
    const newMappings = {
      ...mappings,
      [nodeId]: {
        ...(mappings[nodeId] || {}),
        [fieldName]: columnName
      }
    };
    
    setMappings(newMappings);
    
    if (onMappingChange) {
      onMappingChange(newMappings);
    }
  };

  return (
    <div className="field-mapping-panel">
      <h3 className="mapping-title">Mapeo de Campos</h3>
      
      <div className="mapping-container">
        {nodes.map((node) => (
          <div key={node.id} className="node-mapping">
            <h4 className="node-name">{node.data.label || node.data.name}</h4>
            
            <div className="fields-list">
              {node.data.fields.map((field) => (
                <div key={field} className="field-mapping">
                  <label htmlFor={`${node.id}-${field}`}>
                    {field}:
                  </label>
                  <select
                    id={`${node.id}-${field}`}
                    value={mappings[node.id]?.[field] || ''}
                    onChange={(e) => handleMappingChange(node.id, field, e.target.value)}
                  >
                    <option value="">Seleccionar columna...</option>
                    {tableColumns.map((column) => (
                      <option key={column.name} value={column.name}>
                        {column.name} ({column.type})
                      </option>
                    ))}
                  </select>
                  
                  {/* Indicador de estado del mapeo */}
                  {mappings[node.id]?.[field] ? (
                    <span className="mapping-status mapped">✓</span>
                  ) : (
                    <span className="mapping-status unmapped">!</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Resumen del mapeo */}
      <div className="mapping-summary">
        <h4>Resumen del Mapeo</h4>
        <div className="summary-stats">
          {Object.keys(mappings).length > 0 ? (
            <>
              <div className="stat">
                <span className="stat-label">Nodos mapeados:</span>
                <span className="stat-value">{Object.keys(mappings).length}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Campos totales:</span>
                <span className="stat-value">
                  {nodes.reduce((total, node) => total + node.data.fields.length, 0)}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Campos mapeados:</span>
                <span className="stat-value">
                  {Object.values(mappings).reduce((total, nodeMapping) => 
                    total + Object.keys(nodeMapping).length, 0
                  )}
                </span>
              </div>
            </>
          ) : (
            <p className="no-mappings">No hay campos mapeados aún.</p>
          )}
        </div>
      </div>

      {/* Validaciones y advertencias */}
      <div className="mapping-validations">
        {Object.entries(mappings).map(([nodeId, fieldMappings]) => {
          const node = nodes.find(n => n.id === nodeId);
          if (!node) return null;

          const unmappedFields = node.data.fields.filter(
            field => !fieldMappings[field]
          );

          if (unmappedFields.length > 0) {
            return (
              <div key={nodeId} className="validation-warning">
                <span className="warning-icon">⚠️</span>
                <span className="warning-text">
                  {node.data.label || node.data.name} tiene campos sin mapear:
                  {' '}
                  {unmappedFields.join(', ')}
                </span>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

export default FieldMappingPanel;