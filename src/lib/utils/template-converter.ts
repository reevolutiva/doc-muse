import type { Template, TemplateBlock, VisualData } from '../types/template'
import type { Node, Edge } from '@xyflow/react'

const INITIAL_POSITION = { x: 100, y: 100 }
const NODE_SPACING = 200

/**
 * Convierte una plantilla existente al nuevo formato visual
 */
export function convertToVisualTemplate(template: Template): VisualData {
  const nodes: Node[] = []
  const edges: Edge[] = []
  let currentX = INITIAL_POSITION.x
  let currentY = INITIAL_POSITION.y

  // Si la plantilla tiene un contenido estructurado, convertir los bloques en nodos
  if (template.content?.blocks) {
    template.content.blocks.forEach((block: TemplateBlock, index: number) => {
      // Crear nodo para cada bloque
      const node: Node = {
        id: block.blockId || `node_${index}`,
        type: 'document',
        position: { x: currentX, y: currentY },
        data: {
          label: block.type,
          type: 'document',
          description: block.description || '',
          prompt: block.system || '',
          isRequired: true
        }
      }
      
      nodes.push(node)

      // Si hay un bloque anterior, crear una conexión
      if (index > 0) {
        edges.push({
          id: `edge_${index}`,
          source: `node_${index - 1}`,
          target: node.id,
          type: 'smoothstep'
        })
      }

      // Ajustar posición para el siguiente nodo
      currentX += NODE_SPACING
      if (currentX > INITIAL_POSITION.x + NODE_SPACING * 3) {
        currentX = INITIAL_POSITION.x
        currentY += NODE_SPACING
      }
    })
  } else {
    // Si no hay bloques, crear un nodo simple
    nodes.push({
      id: 'node_1',
      type: 'document',
      position: INITIAL_POSITION,
      data: {
        label: template.title,
        type: 'document',
        description: template.description || '',
        isRequired: true
      }
    })
  }

  return { nodes, edges }
}

/**
 * Convierte una plantilla visual de nuevo al formato clásico
 */
export function convertToClassicTemplate(visualData: VisualData): Template['content'] {
  const blocks: TemplateBlock[] = visualData.nodes.map(node => ({
    blockId: node.id,
    type: node.data.type,
    data: {},
    description: node.data.description,
    system: node.data.prompt
  }))

  return {
    time: Date.now(),
    blocks,
    version: '1.0.0'
  }
}