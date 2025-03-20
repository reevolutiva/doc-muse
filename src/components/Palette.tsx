import React from 'react';
import { BlockType } from '../types/editor';
import './Palette.css';
import { FileText, Folder } from 'lucide-react';
import { Card } from './ui/card';

// Definición expandida de bloques con más metadatos
const blocks: BlockType[] = [
  { 
    id: 1, 
    type: 'header', 
    name: 'Header', 
    icon: 'header-icon',
    fields: ['title', 'subtitle'],
    description: 'Sección de título principal y subtítulo',
    defaultProps: { 
      title: 'Título principal', 
      subtitle: 'Subtítulo descriptivo' 
    }
  },
  { 
    id: 2, 
    type: 'paragraph', 
    name: 'Paragraph', 
    icon: 'text-icon',
    fields: ['text'],
    description: 'Bloque de texto para contenido principal',
    defaultProps: { 
      text: 'Ingrese su texto aquí...' 
    }
  },
  { 
    id: 3, 
    type: 'image', 
    name: 'Image', 
    icon: 'image-icon',
    fields: ['url', 'caption', 'alt'],
    description: 'Sección para imágenes con descripción',
    defaultProps: { 
      url: '', 
      caption: 'Descripción de la imagen', 
      alt: 'Texto alternativo' 
    }
  },
  { 
    id: 4, 
    type: 'list', 
    name: 'List', 
    icon: 'list-icon',
    fields: ['items'],
    description: 'Lista de elementos numerados o con viñetas',
    defaultProps: { 
      items: ['Elemento 1', 'Elemento 2', 'Elemento 3'] 
    }
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

interface PaletteProps {
  onDragStart?: (event: React.DragEvent, block: BlockType) => void;
  className?: string;
}

const items: PaletteItem[] = [
  { type: 'document', label: 'Document Template', icon: 'document' },
  { type: 'project', label: 'Project Template', icon: 'folder' }
];

export function Palette() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 bg-background p-4 border-r">
      <h3 className="font-medium mb-4">Elements</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <Card
            key={item.type}
            draggable
            onDragStart={(e) => onDragStart(e, item.type)}
            className="p-3 cursor-move flex items-center gap-2 hover:bg-accent"
          >
            {item.icon === 'document' ? (
              <FileText className="h-4 w-4" />
            ) : (
              <Folder className="h-4 w-4" />
            )}
            <span className="text-sm">{item.label}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Palette;
export { blocks };