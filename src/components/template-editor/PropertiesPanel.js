import React, { useState, useEffect } from 'react';
import './PropertiesPanel.css';

function PropertiesPanel({ selectedNode, onUpdateNode }) {
  const [formData, setFormData] = useState({});
  
  // Actualizar el formulario cuando cambia el nodo seleccionado
  useEffect(() => {
    if (selectedNode && selectedNode.data && selectedNode.data.props) {
      setFormData(selectedNode.data.props);
    } else {
      setFormData({});
    }
  }, [selectedNode]);

  // Si no hay nodo seleccionado, mostrar mensaje
  if (!selectedNode) {
    return (
      <div className="properties-panel empty-state">
        <div className="empty-message">
          <p>Selecciona un elemento del canvas para ver y editar sus propiedades.</p>
        </div>
      </div>
    );
  }

  // Manejar cambios en los campos del formulario
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Aplicar cambios al nodo
  const handleApplyChanges = () => {
    if (onUpdateNode && selectedNode) {
      onUpdateNode(selectedNode.id, {
        ...selectedNode.data,
        props: formData
      });
    }
  };

  // Renderizar el editor de campo adecuado según su tipo
  const renderFieldEditor = (field) => {
    const value = formData[field] || '';

    // Personalizar el editor según el tipo de campo
    switch (field) {
      case 'url':
        return (
          <div className="field-group" key={field}>
            <label htmlFor={field}>{field}</label>
            <div className="field-input-group">
              <input
                id={field}
                type="text"
                value={value}
                onChange={(e) => handleChange(field, e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              {value && (
                <div className="image-preview">
                  <img src={value} alt="Preview" />
                </div>
              )}
            </div>
          </div>
        );
        
      case 'items':
        const items = Array.isArray(value) ? value : [];
        return (
          <div className="field-group" key={field}>
            <label htmlFor={field}>{field}</label>
            <div className="array-editor">
              {items.map((item, idx) => (
                <div className="array-item" key={idx}>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[idx] = e.target.value;
                      handleChange(field, newItems);
                    }}
                  />
                  <button 
                    className="remove-item" 
                    onClick={() => {
                      handleChange(field, items.filter((_, i) => i !== idx));
                    }}
                  >
                    &times;
                  </button>
                </div>
              ))}
              <button 
                className="add-item"
                onClick={() => handleChange(field, [...items, ''])}
              >
                + Añadir elemento
              </button>
            </div>
          </div>
        );
        
      case 'headers':
      case 'rows':
        // Editor especial para tablas
        if (Array.isArray(value)) {
          return (
            <div className="field-group table-editor" key={field}>
              <label>{field === 'headers' ? 'Encabezados' : 'Filas'}</label>
              <div className="table-preview">
                <table>
                  <tbody>
                    {value.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        {Array.isArray(row) ? 
                          row.map((cell, cellIdx) => (
                            <td key={cellIdx}>
                              <input 
                                type="text" 
                                value={cell}
                                onChange={(e) => {
                                  const newData = [...value];
                                  newData[rowIdx][cellIdx] = e.target.value;
                                  handleChange(field, newData);
                                }}
                              />
                            </td>
                          )) : 
                          <td>
                            <input 
                              type="text" 
                              value={row}
                              onChange={(e) => {
                                const newData = [...value];
                                newData[rowIdx] = e.target.value;
                                handleChange(field, newData);
                              }}
                            />
                          </td>
                        }
                        <td>
                          <button 
                            className="remove-item small" 
                            onClick={() => {
                              handleChange(field, value.filter((_, i) => i !== rowIdx));
                            }}
                          >
                            &times;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <button 
                  className="add-item"
                  onClick={() => {
                    if (field === 'headers') {
                      handleChange(field, [...value, '']);
                    } else {
                      // Para filas, crear una nueva con la misma longitud que las cabeceras
                      const headerLength = formData.headers?.length || 3;
                      const newRow = Array(headerLength).fill('');
                      handleChange(field, [...value, newRow]);
                    }
                  }}
                >
                  + Añadir {field === 'headers' ? 'encabezado' : 'fila'}
                </button>
              </div>
            </div>
          );
        }
        return null;
        
      case 'required':
        return (
          <div className="field-group checkbox" key={field}>
            <label>
              <input
                type="checkbox"
                checked={value === true}
                onChange={(e) => handleChange(field, e.target.checked)}
              />
              Requerido
            </label>
          </div>
        );
        
      default:
        return (
          <div className="field-group" key={field}>
            <label htmlFor={field}>{field}</label>
            <input
              id={field}
              type="text"
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={`Ingrese ${field}`}
            />
          </div>
        );
    }
  };
  
  // Definir campos básicos para todos los nodos
  const nodeFields = selectedNode.data.fields || [];
  
  return (
    <div className="properties-panel">
      <div className="panel-header">
        <h3>Propiedades: {selectedNode.data.name}</h3>
        <span className="node-type">{selectedNode.type}</span>
      </div>

      <div className="panel-content">
        <div className="properties-form">
          {/* Información básica del nodo */}
          <div className="section-title">Información general</div>
          <div className="field-group">
            <label htmlFor="node-name">Nombre</label>
            <input
              id="node-name"
              type="text"
              value={selectedNode.data.label || selectedNode.data.name}
              onChange={(e) => {
                if (onUpdateNode) {
                  onUpdateNode(selectedNode.id, {
                    ...selectedNode.data,
                    label: e.target.value
                  });
                }
              }}
            />
          </div>
          
          {/* Campos específicos del tipo de nodo */}
          <div className="section-title">Propiedades del bloque</div>
          {nodeFields.map(field => renderFieldEditor(field))}
          
          {/* Conexiones y dependencias (información) */}
          <div className="section-title">Conexiones</div>
          <div className="connections-info">
            <p>Arrastra desde los conectores del nodo para crear dependencias entre elementos.</p>
          </div>

          <div className="form-actions">
            <button className="apply-button" onClick={handleApplyChanges}>
              Aplicar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Exportar como componente nombrado para poder ser importado con { PropertiesPanel }
export { PropertiesPanel };

// Mantener el default export para compatibilidad con código existente
export default PropertiesPanel;
