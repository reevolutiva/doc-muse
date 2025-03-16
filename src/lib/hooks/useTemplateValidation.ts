import { useEffect, useState } from 'react'
import type { Node, Edge } from '@xyflow/react'
import type { TemplateNodeData } from '@/components/TemplateNode'
import { toast } from 'sonner'

interface ValidationRule {
  id: string
  validate: (nodes: Node<TemplateNodeData>[], edges: Edge[]) => boolean
  message: string
  type: 'error' | 'warning'
}

interface ValidationResult {
  id: string
  message: string
  type: 'error' | 'warning'
  isValid: boolean
}

const defaultRules: ValidationRule[] = [
  {
    id: 'min-nodes',
    validate: (nodes) => nodes.length >= 1,
    message: 'Template must have at least one node',
    type: 'error'
  },
  {
    id: 'required-nodes',
    validate: (nodes) => nodes.some(node => node.data.isRequired),
    message: 'Template should have at least one required node',
    type: 'warning'
  },
  {
    id: 'node-connections',
    validate: (nodes, edges) => {
      if (nodes.length <= 1) return true
      return edges.length > 0
    },
    message: 'Nodes should be connected to establish relationships',
    type: 'warning'
  },
  {
    id: 'node-labels',
    validate: (nodes) => nodes.every(node => node.data.label?.trim()),
    message: 'All nodes must have a label',
    type: 'error'
  },
  {
    id: 'no-orphans',
    validate: (nodes, edges) => {
      if (nodes.length <= 1) return true
      return nodes.every(node => {
        const hasIncoming = edges.some(e => e.target === node.id)
        const hasOutgoing = edges.some(e => e.source === node.id)
        return hasIncoming || hasOutgoing
      })
    },
    message: 'Avoid orphaned nodes',
    type: 'warning'
  }
]

export function useTemplateValidation(
  nodes: Node<TemplateNodeData>[],
  edges: Edge[],
  customRules: ValidationRule[] = []
) {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([])
  const [isValid, setIsValid] = useState(true)

  useEffect(() => {
    try {
      const rules = [...defaultRules, ...customRules]
      const results = rules.map(rule => ({
        id: rule.id,
        message: rule.message,
        type: rule.type,
        isValid: rule.validate(nodes, edges)
      }))

      setValidationResults(results)
      setIsValid(results.every(r => r.type === 'warning' || r.isValid))
    } catch (error: any) {
      console.error('Error during template validation:', error)
      toast.error(`Template validation failed: ${error.message}`)
    }
  }, [nodes, edges, customRules])

  return {
    isValid,
    validationResults,
    errors: validationResults.filter(r => r.type === 'error' && !r.isValid),
    warnings: validationResults.filter(r => r.type === 'warning' && !r.isValid)
  }
}