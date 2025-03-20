"use client"
import { useState } from 'react'
import { X, Save, AlertCircle, History, Clock, Loader2 } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Tabs from '@radix-ui/react-tabs'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTemplateForm } from '@/lib/hooks/useTemplateForm'
import { useFormValidation } from './hooks/useFormValidation'
import { BlockEditor } from '@/components/block-editor/block-editor'
import type { TemplateFormProps } from '@/lib/types/template'
import type { BlockEditorContent } from '@/components/block-editor/types'
import { templateValidationSchema } from './types/validation'

export function TemplateForm({ onClose, onSave, initialData, mode }: TemplateFormProps) {
  const [editorContent, setEditorContent] = useState<BlockEditorContent>(
    initialData?.content && typeof initialData.content !== 'string' 
      ? initialData.content as BlockEditorContent
      : { 
          time: Date.now().toString(), 
          blocks: [], 
          version: '1.0.0' 
        }
  )
  
  const { 
    register, 
    formState: { errors }, 
    handleSubmit: hookHandleSubmit,
    setValue 
  } = useForm({
    resolver: zodResolver(templateValidationSchema),
    defaultValues: initialData
  })
  
  const { loading, updateForm, validateForm, handleSubmit } = useTemplateForm({
    initialData,
    onSave: async (formData: any) => {
      try {
        await onSave({
          ...formData,
          content: editorContent
        });
        toast.success('Template saved successfully');
        onClose();
      } catch (error) {
        console.error('Error saving template:', error);
        toast.error('Failed to save template');
      }
    },
    onClose
  })

  const handleEditorChange = (content: BlockEditorContent) => {
    setEditorContent(content);
    setValue('content', content);
  }

  return (
    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl bg-white rounded-xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between border-b pb-6 mb-8">
        <div>
          <Dialog.Title className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Create Template' : 'Edit Template'}
          </Dialog.Title>
          <p className="mt-1 text-sm text-gray-500">
            {mode === 'create' 
              ? 'Create a reusable template for generating documents with AI-powered content'
              : 'Edit your template and update its content'}
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
          <form onSubmit={hookHandleSubmit((data) => {
            handleSubmit();
          })} className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register('title')}
                      onChange={(e) => updateForm({ title: e.target.value })}
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
                    onChange={(e) => updateForm({ description: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border-gray-200 shadow-sm px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-shadow resize-none"
                    placeholder="Add a brief description of this template's purpose"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Template Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('type')}
                    className="w-full rounded-lg border-gray-200 shadow-sm px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-shadow"
                  >
                    <option value="elearning">E-Learning</option>
                    <option value="workshop">Workshop</option>
                    <option value="assessment">Assessment</option>
                    <option value="presentation">Presentation</option>
                  </select>
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700">Template Preview</h3>
                  <p className="text-sm text-gray-500">
                    This is how your template will look when it's used
                  </p>
                </div>
                <div className="border rounded-lg shadow-sm p-4 h-[200px] overflow-y-auto bg-gray-50">
                  {editorContent.blocks.length > 0 ? (
                    <div className="space-y-4">
                      {editorContent.blocks.map((block) => (
                        <div key={block.blockId} className="p-2 border rounded bg-white">
                          <div dangerouslySetInnerHTML={{ __html: block.data.text || '' }} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No content blocks yet
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Content Blocks</h3>
              <p className="text-sm text-gray-500 mb-4">
                Create blocks of content with AI prompts to automatically generate content
              </p>
              <div className="border rounded-lg">                 
                <BlockEditor 
                  initialContent={editorContent}
                  onChange={handleEditorChange}
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
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
                    disabled={loading || Object.keys(errors).length > 0}
                    className={`flex items-center gap-2 px-6 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-offset-2 ${
                      loading || Object.keys(errors).length > 0
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
