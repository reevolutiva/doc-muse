"use client"

import { X } from "lucide-react"
import * as Dialog from '@radix-ui/react-dialog'
import type { Template } from "../types"

interface TemplatePreviewDialogProps {
  template: Template | null
  onClose: () => void
}

export function TemplatePreviewDialog({ template, onClose }: TemplatePreviewDialogProps) {
  if (!template) return null

  return (
    <Dialog.Root open={!!template} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[90vw] h-[90vh] bg-white rounded-lg shadow-xl p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-semibold">
              {template.title}
            </Dialog.Title>
            <Dialog.Close className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <div className="prose max-w-none">
            {template && (
              <div>
                {(typeof template.content === 'string' ? JSON.parse(template.content) : template.content).blocks.map((block: any) => (
                  <div key={block.blockId} className="mb-4">
                    <div dangerouslySetInnerHTML={{ __html: block.data.text }} />
                    {block.description && (
                      <div className="text-sm text-gray-500 mt-2">
                        Description: {block.description}
                      </div>
                    )}
                    {block.system && (
                      <div className="text-sm text-blue-500 mt-1">
                        AI Prompt: {block.system}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
