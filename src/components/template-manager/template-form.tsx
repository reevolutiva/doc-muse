"use client"

import { useState } from 'react'
import { X, Save, AlertCircle, History, Clock, Loader2 } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Tabs from '@radix-ui/react-tabs'
import { toast } from 'sonner'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTemplateForm } from '@/lib/hooks/useTemplateForm'
import { useFormValidation } from './hooks/useFormValidation'
import type { TemplateFormProps } from '@/lib/types/template'
import { templateValidationSchema } from './types/validation'

export function TemplateForm({ onClose, onSave, initialData, mode }: TemplateFormProps) {
  const { 
    register, 
    formState: { errors: formErrors }, 
    handleSubmit: hookHandleSubmit,
    setValue 
  } = useForm({
    resolver: zodResolver(templateValidationSchema),
    defaultValues: initialData
  })

  const { loading, updateForm, validateForm } = useTemplateForm({
    initialData,
    onSave: async (formData: any) => {
      try {
        await onSave(formData);
        toast.success('Template created successfully');
        onClose();
      } catch (error) {
        console.error('Error saving template:', error);
        toast.error('Failed to create template');
      }
    },
    onClose
  })

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialData?.content ? 
      (typeof initialData.content === 'string' ? initialData.content : JSON.stringify(initialData.content))
      : '',
    onUpdate: ({ editor }) => {
      setValue('content', {
        time: Date.now(),
        blocks: [{
          blockId: crypto.randomUUID(),
          type: 'paragraph',
          data: { text: editor.getHTML() },
          description: '',
          system: ''
        }],
        version: '1.0.0'
      })
    }
  })

  return (
    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl bg-white rounded-xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
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

      <Tabs.Root defaultValue="edit" className="w-full">
        <Tabs.List className="flex gap-4 mb-8 border-b">
          <Tabs.Trigger 
            value="edit"
            className="px-4 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
          >
            Edit Template
          </Tabs.Trigger>
          <Tabs.Trigger
            value="versions"
            className="px-4 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
          >
            Version History
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="edit" className="outline-none">
          <form onSubmit={hookHandleSubmit((data) => onSave({
            title: data.title,
            description: data.description ?? null,
            content: data.content
          }))} className="grid grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                {...register('title')}
                className={`w-full rounded-lg border shadow-sm px-4 py-3 transition-shadow ${
                  errors.title ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                }`}
                placeholder="Enter a descriptive title"
              />
              {errors.title && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                  <AlertCircle className="w-5 h-5" />
                </div>
              )}
            </div>
            {errors.title && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
              <span className="ml-1 text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              {...register('description')}
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

        <div className="col-span-2 flex items-center justify-between mt-8 pt-6 border-t">
          <div className="text-sm text-gray-500">
            <span className="text-red-500">*</span> Required fields
          </div>
          <div className="flex gap-3">
            <Dialog.Close asChild>
              <button 
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
            </Dialog.Close>
            <div className="flex flex-col gap-2">
              {Object.keys(errors).length > 0 && (
                <p className="text-sm text-red-500">Please fix the validation errors</p>
              )}
              <button
                type="submit"
                disabled={loading || Object.keys(errors as FormErrors).length > 0}
                className={`flex items-center gap-2 px-6 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-offset-2 ${
                  loading || Object.keys(errors as FormErrors).length > 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {mode === 'create' ? 'Create Template' : 'Update Template'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        </form>
      </Tabs.Content>

      <Tabs.Content value="versions" className="outline-none">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Version History</h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            <div className="text-center py-8 text-gray-500">
              Version history is not available
            </div>
          </div>
        </div>
      </Tabs.Content>
    </Tabs.Root>
    </Dialog.Content>
  )
}
