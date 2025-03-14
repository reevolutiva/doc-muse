"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { useEffect } from 'react'
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
    content: selectedBlock?.data?.text || '',
    onUpdate: ({ editor }) => handleEditorUpdate(editor)
  })

  useEffect(() => {
    if (!editor) return;
    if (!selectedBlock || !selectedBlock.data) {
      console.warn('BlockEditor effect: selectedBlock or selectedBlock.data is null');
      return;
    }
    console.log('BlockEditor effect: selectedBlock:', selectedBlock);
    const text = selectedBlock.data.text || '';
    editor.commands.setContent(text);
  }, [selectedBlock, editor])

  if (!editor) {
    return <div>Loading editor...</div>
  }

  // Ensure that selectedBlock is available before rendering
  if (!selectedBlock) {
    return <div>Loading block...</div>
  }

  const handleBlockSelectWrapper = (block: Block) => {
    handleBlockSelect(block)
    editor.commands.setContent(block.data?.text || '')
    editor.commands.focus()
  }

  const handleNewBlockWrapper = () => {
    handleNewBlock()
    editor.commands.setContent('')
    editor.commands.focus()
  }

  return (
    <div className="flex gap-4">
      <BlockList
        blocks={blocks}
        selectedBlock={selectedBlock}
        onBlockSelect={handleBlockSelectWrapper}
        onNewBlock={handleNewBlockWrapper}
      />

      <div className="flex-1 space-y-4">

        <EditorToolbar editor={editor} />

        <div className="prose max-w-none min-h-[300px] border rounded-lg">
          <EditorContent editor={editor} />
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
