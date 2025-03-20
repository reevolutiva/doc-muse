"use client"

import * as Dialog from '@radix-ui/react-dialog'
import { AlertTriangle } from 'lucide-react'
import { Button } from '../ui/button'
import type { Template } from '@/lib/types/template'

interface ConvertTemplateDialogProps {
  template: Template
  onConfirm: () => void
  onCancel: () => void
  open: boolean
}

export function ConvertTemplateDialog({ template, onConfirm, onCancel, open }: ConvertTemplateDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onCancel}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-xl p-6 z-50">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-yellow-100 rounded-full mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            
            <Dialog.Title className="text-xl font-semibold mb-2">
              Convert to Visual Template?
            </Dialog.Title>
            
            <Dialog.Description className="text-sm text-gray-500 mb-6">
              This template was created with the classic editor. Would you like to convert it to the new visual format? This will allow you to edit it using the visual editor.
            </Dialog.Description>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onCancel}>
                Keep Classic Format
              </Button>
              <Button onClick={onConfirm}>
                Convert to Visual
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}