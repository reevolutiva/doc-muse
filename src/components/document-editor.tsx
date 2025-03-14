"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Save, Sparkles, Loader2, Wand2, Key, PenTool, CheckCircle, Circle } from 'lucide-react'
import { Tooltip } from 'react-tooltip'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { AIToolbar } from './editor/ai-toolbar'
import { useEditor as useDocumentEditor } from '@/lib/hooks/useEditor'
import type { EditorProps } from '@/lib/types/editor'

export function DocumentEditor({ projectId, documentId, initialContent = '', onSave }: EditorProps) {
  const {
    loading,
    reuseLoading,
    aiLoading,
    handleSave,
    handleReuseContent,
    handleAIOperation,
    handleMarkComplete,
    isComplete
  } = useDocumentEditor({ projectId, documentId, onSave })

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    onUpdate: ({ editor }) => {
      // Store content in editor state
      const content = editor.getHTML()
      // You can trigger auto-save here if needed
    }
  })

  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleMarkComplete()}
            disabled={loading || reuseLoading || aiLoading}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              isComplete 
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'border border-green-600 text-green-600 hover:bg-green-50'
            }`}
            data-tooltip-id="complete-tooltip"
            data-tooltip-content={isComplete ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {isComplete ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <Circle className="h-4 w-4" />
            )}
            {isComplete ? 'Completed' : 'Mark Complete'}
          </button>
          <button
            onClick={handleReuseContent}
            disabled={loading || reuseLoading}
            className="flex items-center gap-2 rounded-md border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            data-tooltip-id="reuse-tooltip"
            data-tooltip-content="Find and reuse relevant content from other project documents"
          >
            {reuseLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Finding Content...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Reuse Content
              </>
            )}
          </button>

          <button
            onClick={() => handleAIOperation('summarize')}
            disabled={loading || aiLoading}
            className="flex items-center gap-2 rounded-md border border-purple-600 px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
            data-tooltip-id="summarize-tooltip"
            data-tooltip-content="Generate a summary of the content"
          >
            <Wand2 className="h-4 w-4" />
            Summarize
          </button>

          <button
            onClick={() => handleAIOperation('keywords')}
            disabled={loading || aiLoading}
            className="flex items-center gap-2 rounded-md border border-green-600 px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
            data-tooltip-id="keywords-tooltip"
            data-tooltip-content="Extract key terms and phrases"
          >
            <Key className="h-4 w-4" />
            Keywords
          </button>

          <button
            onClick={() => handleAIOperation('style')}
            disabled={loading || aiLoading}
            className="flex items-center gap-2 rounded-md border border-orange-600 px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
            data-tooltip-id="style-tooltip"
            data-tooltip-content="Get writing style suggestions"
          >
            <PenTool className="h-4 w-4" />
            Style Tips
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={loading || reuseLoading}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          data-tooltip-id="save-tooltip"
          data-tooltip-content="Save changes to this document"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save
            </>
          )}
        </button>

        <Tooltip id="reuse-tooltip" />
        <Tooltip id="save-tooltip" />
        <Tooltip id="summarize-tooltip" />
        <Tooltip id="keywords-tooltip" />
        <Tooltip id="style-tooltip" />
      </div>

      <p>aca</p>

      <EtherpadEmbed />
    </div>
  )
}
