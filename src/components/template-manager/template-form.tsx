"use client"

import { X } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { useTemplateForm } from '@/lib/hooks/useTemplateForm'
import type { TemplateFormProps } from '@/lib/types/template'

export function TemplateForm({ onClose, onSave, initialData, mode }: TemplateFormProps) {
  const { form, loading, updateForm, handleSubmit } = useTemplateForm({
    initialData,
    onSave,
    onClose
  })

  const editor = useEditor({
    extensions: [StarterKit],
    content: typeof form.content === 'string' ? form.content : JSON.stringify(form.content),
    onUpdate: ({ editor }) => {
      updateForm({ 
        content: {
          ...form.content,
          blocks: [{
            blockId: crypto.randomUUID(),
            type: 'paragraph',
            data: { text: editor.getHTML() },
            description: '',
            system: ''
          }]
        }
      })
    }
  })

  return (
    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white rounded-xl shadow-2xl p-8">
      <div className="flex items-center justify-between border-b pb-6 mb-8">
        <div>
          <Dialog.Title className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Create Template' : 'Edit Template'}
          </Dialog.Title>
          <p className="mt-1 text-sm text-gray-500">
            Create a reusable template for generating documents
          </p>
        </div>
        <Dialog.Close className="text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-6 h-6" />
        </Dialog.Close>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateForm({ title: e.target.value })}
              className="w-full rounded-lg border-gray-200 shadow-sm px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-shadow"
              placeholder="Enter a descriptive title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
              <span className="ml-1 text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => updateForm({ description: e.target.value })}
              rows={3}
              className="w-full rounded-lg border-gray-200 shadow-sm px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-shadow resize-none"
              placeholder="Add a brief description of this template's purpose"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Content
          </label>
          <div className="border rounded-lg shadow-sm overflow-hidden">
            <EditorContent 
              editor={editor} 
              className="prose max-w-none min-h-[400px] border rounded-lg p-4" 
            />
          </div>
        </div>

        <div className="col-span-2 flex justify-end gap-3 mt-8 pt-6 border-t">
          <Dialog.Close asChild>
            <button 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
          </Dialog.Close>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-200 transition-all"
          >
            {mode === 'create' ? 'Create Template' : 'Update Template'}
          </button>
        </div>
      </div>
    </Dialog.Content>
  )
}
