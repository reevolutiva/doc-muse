"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface LivePreviewProps {
  content: string
  config: Record<string, any>
}

export function LivePreview({ content, config }: LivePreviewProps) {
  const [processedContent, setProcessedContent] = useState(content)
  const [loading, setLoading] = useState(false)

  const editor = useEditor({
    extensions: [StarterKit],
    content: processedContent,
    editable: false
  })

  useEffect(() => {
    const processContent = () => {
      setLoading(true)
      try {
        let newContent = content

        Object.entries(config).forEach(([key, value]) => {
          const placeholder = `{{${key}}}`
          newContent = newContent.replace(new RegExp(placeholder, 'g'), String(value))
        })

        setProcessedContent(newContent)
        if (editor) {
          editor.commands.setContent(newContent)
        }
      } catch (error) {
        console.error('Error processing content:', error)
      } finally {
        setLoading(false)
      }
    }

    processContent()
  }, [content, config, editor])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="h-full prose max-w-none">
      <EditorContent editor={editor} />
    </div>
  )
}
