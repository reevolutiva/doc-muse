import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import './TemplateNode.css';

function TemplateNode({ data, isConnectable, selected }) {
  // Renderizar los campos específicos según el tipo de bloque
  const renderFields = () => {
    const { fields, props } = data;
    
    if (!fields || !props) return null;

    // Mapeamos los campos según su tipo para mostrar una previsualización
    return fields.map((field) => {
      const value = props[field] || '';
      
      // Personalizar visualización según tipo de campo
      switch (field) {
        case 'url':
          return (
            <div key={field} className="node-field">
              {value ? (
                <img 
                  src={value} 
                  alt={props.alt || 'Preview'} 
                  className="node-image-preview" 
                />
              ) : (
                <div className="node-image-placeholder">
                  <span>Sin imagen</span>
                </div>
              )}
            </div>
          );
        
        case 'items':
          if (Array.isArray(value)) {
            return (
              <div key={field} className="node-field">
                <ul className="node-list-preview">
                  {value.slice(0, 3).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                  {value.length > 3 && <li>...</li>}
                </ul>
              </div>
            );
          }
          return null;
        
        case 'headers':
        case 'rows':
          // Para tablas, mostramos una previsualización simplificada
          return null;
        
        default:
          return (
            <div key={field} className="node-field">
              <div className="node-field-label">{field}:</div>
              <div className="node-field-value">
                {String(value).length > 30 ? `${String(value).substring(0, 30)}...` : value}
              </div>
            </div>
          );
      }
    });
  };

  return (
    <div className={`template-node ${selected ? 'selected' : ''} ${data.type}`}>
      {/* Handle de entrada (arriba) */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="node-handle node-handle-top"
      />

      {/* Contenido del nodo */}
      <div className="node-header">
        <div className={`node-icon ${data.icon}`}></div>
        <div className="node-title">{data.name}</div>
      </div>
      
      <div className="node-content">
        {renderFields()}
      </div>
      
      {/* Botón para abrir el editor de propiedades */}
      <div className="node-actions">
        <button className="node-edit-button" title="Editar propiedades">
          <span>⚙️</span>
        </button>
      </div>

      {/* Handle de salida (abajo) */}
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="node-handle node-handle-bottom"
      />
    </div>
  );
}

export default memo(TemplateNode);