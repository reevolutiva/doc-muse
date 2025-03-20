import type { Template, VisualData } from '../types/template'

export function isVisualTemplate(template: Template): boolean {
  return !!template.visual_data
}

export function validateTemplateData(template: Template) {
  const errors: string[] = []
  
  if (!template.title?.trim()) {
    errors.push('Title is required')
  }

  if (template.visual_data) {
    if (!Array.isArray(template.visual_data.nodes)) {
      errors.push('Invalid visual data: nodes must be an array')
    }
    if (!Array.isArray(template.visual_data.edges)) {
      errors.push('Invalid visual data: edges must be an array')
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function getTemplateStats(template: Template) {
  if (!template.visual_data) {
    return {
      nodeCount: 0,
      connectionCount: 0,
      requiredNodes: 0
    }
  }

  const { nodes, edges } = template.visual_data
  
  return {
    nodeCount: nodes.length,
    connectionCount: edges.length,
    requiredNodes: nodes.filter(node => node.data.isRequired).length
  }
}

export function validateDependencies(visualData: VisualData) {
  const { nodes, edges } = visualData
  const errors: string[] = []

  // Verificar que todos los nodos referenciados existen
  edges.forEach(edge => {
    const sourceExists = nodes.some(node => node.id === edge.source)
    const targetExists = nodes.some(node => node.id === edge.target)

    if (!sourceExists) {
      errors.push(`Invalid connection: source node ${edge.source} not found`)
    }
    if (!targetExists) {
      errors.push(`Invalid connection: target node ${edge.target} not found`)
    }
  })

  // Verificar ciclos
  const hasCycle = checkForCycles(nodes.map(n => n.id), edges)
  if (hasCycle) {
    errors.push('Invalid dependencies: cycle detected')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

function checkForCycles(nodeIds: string[], edges: VisualData['edges']): boolean {
  const visited = new Set<string>()
  const recursionStack = new Set<string>()

  function dfs(nodeId: string): boolean {
    visited.add(nodeId)
    recursionStack.add(nodeId)

    const outgoingEdges = edges.filter(edge => edge.source === nodeId)
    for (const edge of outgoingEdges) {
      if (!visited.has(edge.target)) {
        if (dfs(edge.target)) return true
      } else if (recursionStack.has(edge.target)) {
        return true
      }
    }

    recursionStack.delete(nodeId)
    return false
  }

  for (const nodeId of nodeIds) {
    if (!visited.has(nodeId)) {
      if (dfs(nodeId)) return true
    }
  }

  return false
}