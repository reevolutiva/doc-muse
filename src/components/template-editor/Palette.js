// Palette.js - Editor visual de plantillas usando xyflow
import React from 'react';
import './Palette.css'; // Asegúrate de crear este archivo para los estilos

// Definición expandida de bloques con más metadatos
const blocks = [
  { 
    id: 1, 
    type: 'header', 
    name: 'Header', 
    icon: 'header-icon', // Para añadir íconos representativos
    fields: ['title', 'subtitle'],
    description: 'Sección de título principal y subtítulo',
    defaultProps: { title: 'Título principal', subtitle: 'Subtítulo descriptivo' }
  },
  { 
    id: 2, 
    type: 'paragraph', 
    name: 'Paragraph', 
    icon: 'text-icon',
    fields: ['text'],
    description: 'Bloque de texto para contenido principal',
    defaultProps: { text: 'Ingrese su texto aquí...' }
  },
  { 
    id: 3, 
    type: 'image', 
    name: 'Image', 
    icon: 'image-icon',
    fields: ['url', 'caption', 'alt'],
    description: 'Sección para imágenes con descripción',
    defaultProps: { url: '', caption: 'Descripción de la imagen', alt: 'Texto alternativo' }
  },
  { 
    id: 4, 
    type: 'list', 
    name: 'List', 
    icon: 'list-icon',
    fields: ['items'],
    description: 'Lista de elementos numerados o con viñetas',
    defaultProps: { items: ['Elemento 1', 'Elemento 2', 'Elemento 3'] }
  },
  { 
    id: 5, 
    type: 'table', 
    name: 'Table', 
    icon: 'table-icon',
    fields: ['headers', 'rows'],
    description: 'Tabla de datos con encabezados',
    defaultProps: { 
      headers: ['Columna 1', 'Columna 2', 'Columna 3'], 
      rows: [
        ['Valor 1', 'Valor 2', 'Valor 3'],
        ['Valor A', 'Valor B', 'Valor C']
      ]
    }
  },
  { 
    id: 6, 
    type: 'form-field', 
    name: 'Form Field', 
    icon: 'form-icon',
    fields: ['label', 'type', 'required', 'options'],
    description: 'Campo de formulario configurable',
    defaultProps: { 
      label: 'Etiqueta del campo', 
      type: 'text', 
      required: false, 
      options: [] 
    }
  }
];

function Palette({ onDragStart }) {
  // Función para iniciar el arrastre de un bloque
  const handleDragStart = (event, block) => {
    // Configurar datos a transferir durante el arrastre
    event.dataTransfer.setData('application/reactflow', JSON.stringify(block));
    event.dataTransfer.effectAllowed = 'move';
    
    // Si se pasó la función onDragStart como prop, llamarla
    if (typeof onDragStart === 'function') {
      onDragStart(event, block);
    }
  };

  return (
    <div className="palette">
      <h3 className="palette-title">Bloques disponibles</h3>
      <div className="palette-blocks">
        {blocks.map(block => (
          <div 
            key={block.id}
            className="palette-block"
            draggable={true}
            onDragStart={(e) => handleDragStart(e, block)}
            title={block.description}
          >
            <div className="block-icon">
              <span className={block.icon}></span>
            </div>
            <span className="block-name">{block.name}</span>
          </div>
        ))}
      </div>
      <div className="palette-footer">
        <small>Arrastra los bloques al canvas para crear tu plantilla</small>
      </div>
    </div>
  );
}

// Exportar como componente nombrado para poder ser importado con { Palette }
export { Palette, blocks };

// Mantener el default export para compatibilidad con código existente
export default Palette;
