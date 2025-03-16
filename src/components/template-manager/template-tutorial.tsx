"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { CheckCircle2 } from 'lucide-react'
import type { Node, Edge } from '@xyflow/react'
import type { TemplateNodeData } from '@/components/TemplateNode'

interface TutorialStep {
  id: string
  title: string
  description: string
  completionCheck: (nodes: Node<TemplateNodeData>[], edges: Edge[]) => boolean
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'add-first-node',
    title: 'Add Your First Node',
    description: 'Drag a document or project node from the palette to start building your template.',
    completionCheck: (nodes) => nodes.length > 0
  },
  {
    id: 'configure-node',
    title: 'Configure Your Node',
    description: 'Click on the node to open the properties panel. Add a title and description.',
    completionCheck: (nodes) => nodes.some(node => 
      node.data.label?.trim() && node.data.description?.trim()
    )
  },
  {
    id: 'add-more-nodes',
    title: 'Add More Nodes',
    description: 'Add at least one more node to create a workflow.',
    completionCheck: (nodes) => nodes.length >= 2
  },
  {
    id: 'create-connection',
    title: 'Connect Your Nodes',
    description: "Create a connection by dragging from one node's handle to another.",
    completionCheck: (_, edges) => edges.length > 0
  },
  {
    id: 'set-dependency',
    title: 'Set Dependency Type',
    description: 'Click on the connection line to choose the type of dependency between nodes.',
    completionCheck: (_, edges) => edges.some(edge => edge.data?.dependencyType)
  }
]

interface TemplateTutorialProps {
  nodes: Node<TemplateNodeData>[]
  edges: Edge[]
  onComplete: () => void
}

export function TemplateTutorial({ nodes, edges, onComplete }: TemplateTutorialProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

  useEffect(() => {
    const currentStep = tutorialSteps[currentStepIndex]
    if (currentStep && currentStep.completionCheck(nodes, edges)) {
      setCompletedSteps(prev => new Set([...prev, currentStep.id]))
      
      if (currentStepIndex < tutorialSteps.length - 1) {
        setTimeout(() => {
          setCurrentStepIndex(prev => prev + 1)
        }, 1000)
      } else {
        setTimeout(() => {
          setIsOpen(false)
          onComplete()
        }, 1500)
      }
    }
  }, [nodes, edges, currentStepIndex, onComplete])

  const currentStep = tutorialSteps[currentStepIndex]
  const isStepCompleted = completedSteps.has(currentStep.id)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Getting Started</DialogTitle>
          <DialogDescription>
            Follow these steps to create your first template
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <motion.div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${isStepCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}
                    `}
                  >
                    {isStepCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      currentStepIndex + 1
                    )}
                  </motion.div>
                  {currentStepIndex < tutorialSteps.length - 1 && (
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-full bg-gray-200" />
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {currentStep.title}
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    {currentStep.description}
                  </p>
                </div>
              </div>

              {isStepCompleted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="ml-11 text-sm text-green-600"
                >
                  Great job! {
                    currentStepIndex < tutorialSteps.length - 1 
                      ? "Let's continue to the next step." 
                      : "You've completed the tutorial!"
                  }
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex justify-between">
          <div className="flex -space-x-1 overflow-hidden">
            {tutorialSteps.map((step, index) => (
              <div
                key={step.id}
                className={`
                  w-2 h-2 rounded-full border-2 border-white
                  ${index === currentStepIndex ? 'bg-blue-600' : ''}
                  ${completedSteps.has(step.id) ? 'bg-green-500' : 'bg-gray-200'}
                `}
              />
            ))}
          </div>

          <Button 
            variant="ghost"
            onClick={() => {
              setIsOpen(false)
              onComplete()
            }}
          >
            Skip Tutorial
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}