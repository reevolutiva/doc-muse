"use client"

import { AlertTriangle, CheckCircle2, XCircle, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTemplateValidation } from '@/lib/hooks/useTemplateValidation'
import type { VisualData } from '@/lib/types/template'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

interface ValidationPanelProps {
  visualData: VisualData
}

export function ValidationPanel({ visualData }: ValidationPanelProps) {
  const { isValid, errors, warnings } = useTemplateValidation(
    visualData.nodes,
    visualData.edges
  )

  if (isValid && !warnings.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="absolute bottom-4 right-4 z-50"
      >
        <motion.div 
          className="flex items-center gap-2 p-3 rounded-lg shadow-lg border bg-green-50 border-green-200 text-green-700"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 0.3 }}
        >
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <p className="text-sm">Template structure is valid</p>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="absolute bottom-4 right-4 w-80 z-50">
      <Collapsible defaultOpen={!isValid}>
        {({ open }) => (
          <>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className={`w-full flex items-center justify-between p-3 mb-2 ${
                  !isValid 
                    ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                    : 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  {!isValid ? (
                    <XCircle className="h-5 w-5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5" />
                  )}
                  <span>Validation Results</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="ml-2">
                    {errors.length + warnings.length}
                  </Badge>
                  <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </div>
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                <AnimatePresence>
                  {errors.map((error) => (
                    <motion.div
                      key={error.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-start gap-2 p-3 rounded-lg shadow-lg border bg-red-50 border-red-200 text-red-700"
                    >
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      <p className="text-sm flex-1">{error.message}</p>
                    </motion.div>
                  ))}

                  {warnings.map((warning) => (
                    <motion.div
                      key={warning.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-start gap-2 p-3 rounded-lg shadow-lg border bg-yellow-50 border-yellow-200 text-yellow-700"
                    >
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <p className="text-sm flex-1">{warning.message}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </CollapsibleContent>
          </>
        )}
      </Collapsible>
    </div>
  )
}