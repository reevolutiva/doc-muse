"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { useState, useEffect } from 'react'
import { useBlockEditor } from '@/lib/hooks/useBlockEditor'
import { BlockError } from './block-error'
import { BlockList } from './block-list'
import { EditorToolbar } from './editor-toolbar'
import { BlockSettings } from './block-settings'
import type { BlockEditorProps, Block } from './types'


export function BlockEditor({ initialContent, onChange }: BlockEditorProps) {
  const {
    blocks,
    selectedBlock,
    handleEditorUpdate,
    handleBlockSelect,
    handleNewBlock,
    handleBlockUpdate
  } = useBlockEditor({ initialContent, onChange })

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      })
    ],
    content: selectedBlock?.data.text || '',
    onUpdate: ({ editor }) => handleEditorUpdate(editor)
  })

  useEffect(() => {
    if (editor && selectedBlock) {
      editor.commands.setContent(selectedBlock.data.text || '')
    }
  }, [selectedBlock, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="flex gap-4">
      <BlockList
        blocks={blocks}
        selectedBlock={selectedBlock}
        onBlockSelect={(block) => {
          handleBlockSelect(block)
          editor.commands.setContent(block.data.text || '')
          editor.commands.focus()
        }}
        onNewBlock={() => {
          handleNewBlock()
          editor.commands.setContent('')
          editor.commands.focus()
        }}
      />

      <div className="flex-1 space-y-4">
        <EditorToolbar editor={editor} />

        <div className="prose max-w-none min-h-[300px] border rounded-lg">
          {!editor?.getHTML() ? (
            <BlockError />
          ) : (
            <EditorContent 
              editor={editor}
              className="p-4"
            />
          )}
        </div>

        {selectedBlock && (
          <BlockSettings
            block={selectedBlock}
            onUpdate={handleBlockUpdate}
          />
        )}
      </div>
    </div>
  )
}
