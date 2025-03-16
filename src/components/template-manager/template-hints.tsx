"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, ArrowRight, Info } from 'lucide-react'
import type { Node, Edge } from '@xyflow/react'
import type { TemplateNodeData } from '@/components/TemplateNode'

interface TemplateHintsProps {
  nodes: Node<TemplateNodeData>[]
  edges: Edge[]
}

interface Hint {
  id: string
  message: string
  type: 'tip' | 'suggestion' | 'info'
  condition: (nodes: Node<TemplateNodeData>[], edges: Edge[]) => boolean
}

const hints: Hint[] = [
  {
    id: 'empty-canvas',
    message: 'Start by dragging items from the palette to create your template',
    type: 'tip',
    condition: (nodes) => nodes.length === 0
  },
  {
    id: 'single-node',
    message: 'Add more nodes and connect them to create a workflow',
    type: 'suggestion',
    condition: (nodes) => nodes.length === 1
  },
  {
    id: 'no-connections',
    message: 'Connect your nodes by dragging from one handle to another',
    type: 'tip',
    condition: (nodes, edges) => nodes.length > 1 && edges.length === 0
  },
  {
    id: 'add-descriptions',
    message: 'Add descriptions to your nodes to make them clearer',
    type: 'suggestion',
    condition: (nodes) => nodes.some(node => !node.data.description)
  },
  {
    id: 'mark-required',
    message: 'Mark essential nodes as required to enforce their completion',
    type: 'info',
    condition: (nodes) => nodes.length > 0 && !nodes.some(node => node.data.isRequired)
  }
]

export function TemplateHints({ nodes, edges }: TemplateHintsProps) {
  const [activeHints, setActiveHints] = useState<Hint[]>([])
  const [currentHintIndex, setCurrentHintIndex] = useState(0)

  useEffect(() => {
    const relevantHints = hints.filter(hint => hint.condition(nodes, edges))
    setActiveHints(relevantHints)
    setCurrentHintIndex(0)
  }, [nodes, edges])

  if (activeHints.length === 0) return null

  const currentHint = activeHints[currentHintIndex]

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentHint.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border
            ${currentHint.type === 'tip' ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}
            ${currentHint.type === 'suggestion' ? 'bg-green-50 border-green-200 text-green-700' : ''}
            ${currentHint.type === 'info' ? 'bg-purple-50 border-purple-200 text-purple-700' : ''}
          `}
        >
          {currentHint.type === 'tip' && (
            <Lightbulb className="h-5 w-5 flex-shrink-0" />
          )}
          {currentHint.type === 'suggestion' && (
            <ArrowRight className="h-5 w-5 flex-shrink-0" />
          )}
          {currentHint.type === 'info' && (
            <Info className="h-5 w-5 flex-shrink-0" />
          )}
          
          <p className="text-sm">{currentHint.message}</p>

          {activeHints.length > 1 && (
            <div className="flex items-center gap-1 ml-2">
              {activeHints.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentHintIndex(index)}
                  className={`
                    w-2 h-2 rounded-full transition-colors
                    ${index === currentHintIndex ? 'bg-current' : 'bg-current/30'}
                  `}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}