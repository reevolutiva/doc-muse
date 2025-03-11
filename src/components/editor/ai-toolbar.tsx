"use client"

import { Wand2, Key, PenTool, Loader2 } from 'lucide-react'
import { Tooltip } from 'react-tooltip'

interface AIToolbarProps {
  loading: boolean
  onOperation: (operation: 'summarize' | 'keywords' | 'style') => void
}

export function AIToolbar({ loading, onOperation }: AIToolbarProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onOperation('summarize')}
        disabled={loading}
        className="flex items-center gap-2 rounded-md border border-purple-600 px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
        data-tooltip-id="summarize-tooltip"
        data-tooltip-content="Generate a summary of the content"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
        Summarize
      </button>

      <button
        onClick={() => onOperation('keywords')}
        disabled={loading}
        className="flex items-center gap-2 rounded-md border border-green-600 px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
        data-tooltip-id="keywords-tooltip"
        data-tooltip-content="Extract key terms and phrases"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
        Keywords
      </button>

      <button
        onClick={() => onOperation('style')}
        disabled={loading}
        className="flex items-center gap-2 rounded-md border border-orange-600 px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
        data-tooltip-id="style-tooltip"
        data-tooltip-content="Get writing style suggestions"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PenTool className="h-4 w-4" />}
        Style Tips
      </button>

      <Tooltip id="summarize-tooltip" />
      <Tooltip id="keywords-tooltip" />
      <Tooltip id="style-tooltip" />
    </div>
  )
}
