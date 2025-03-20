"use client"

import { 
  Bold, Italic, List, Heading1, Heading2, 
  Quote, ListOrdered, Code, Undo, Redo,
  Highlighter, CheckSquare, Palette
} from 'lucide-react'
import type { EditorToolbarProps } from './types'

export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null

  return (
    <div className="flex items-center gap-1 border-b pb-4">
      <div className="flex items-center gap-1">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      <div className="border-l mx-2 h-6" />

      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('bold') ? 'bg-gray-100' : ''
        }`}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('italic') ? 'bg-gray-100' : ''
        }`}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('code') ? 'bg-gray-100' : ''
        }`}
        title="Code"
      >
        <Code className="w-4 h-4" />
      </button>

      <div className="border-l mx-2 h-6" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('heading', { level: 1 }) ? 'bg-gray-100' : ''
        }`}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('heading', { level: 2 }) ? 'bg-gray-100' : ''
        }`}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <div className="border-l mx-2 h-6" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('bulletList') ? 'bg-gray-100' : ''
        }`}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('orderedList') ? 'bg-gray-100' : ''
        }`}
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('blockquote') ? 'bg-gray-100' : ''
        }`}
        title="Quote"
      >
        <Quote className="w-4 h-4" />
      </button>

      <div className="border-l mx-2 h-6" />

      <button
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('taskList') ? 'bg-gray-100' : ''
        }`}
        title="Task List"
      >
        <CheckSquare className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('highlight') ? 'bg-gray-100' : ''
        }`}
        title="Highlight"
      >
        <Highlighter className="w-4 h-4" />
      </button>

      <div className="relative">
        <button
          onClick={() => editor.chain().focus().setColor('#000000').run()}
          className="p-2 rounded hover:bg-gray-100"
          title="Text Color"
        >
          <Palette className="w-4 h-4" />
        </button>
        <input
          type="color"
          onChange={e => editor.chain().focus().setColor(e.target.value).run()}
          className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  )
}
