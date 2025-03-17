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
import TemplatesReactFlow from '../block-editor/react-flow/template'

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
  
  const { loading, updateForm, validateForm } = useTemplateForm({
    initialData,
    onSave: async (formData: any) => {
      try {
        await onSave({
          ...formData,
          content: editorContent
        });

        //TODO: Sincronizar con Supabase

        console.log( 'formData', formData );
        console.log( 'editorContent', editorContent );

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
    console.log('content', content);
    setEditorContent(content);
    setValue('content', content);
  }

  const [nodes] = useState([
    {
      id: '1',
      type: 'input',
      data: { label: 'Input Node' },
      position: { x: 250, y: 25 },
    }
  ]);

  const [edges] = useState([]);

  return (
    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl bg-white rounded-xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between border-b pb-6 mb-8">
        <Dialog.Title className="text-2xl font-bold text-gray-900">
          {mode === 'create' ? 'Create Template' : 'Edit Template'}
        </Dialog.Title>
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
          <div>
            <TemplatesReactFlow />
          </div>
        </Tabs.Content>
        <Tabs.Content value="versions" className="outline-none">
        
        </Tabs.Content>
      </Tabs.Root>
    </Dialog.Content>
  )
}
