"use client"

import { Editor } from '@tinymce/tinymce-react'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import EtherpadEmbed from "./EtherpadEmbed";

interface LivePreviewProps {
  content: string
  config: Record<string, any>
}

export function LivePreview({ content, config }: LivePreviewProps) {
  const [processedContent, setProcessedContent] = useState(content)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Process content with config values
    const processContent = () => {
      setLoading(true)
      try {
        let newContent = content

        // Replace config placeholders with actual values
        Object.entries(config).forEach(([key, value]) => {
          const placeholder = `{{${key}}}`
          newContent = newContent.replace(new RegExp(placeholder, 'g'), String(value))
        })

        setProcessedContent(newContent)
      } catch (error) {
        console.error('Error processing content:', error)
      } finally {
        setLoading(false)
      }
    }

    processContent()
  }, [content, config])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="h-full">
      <EtherpadEmbed/>
    </div>
  )
}
