"use client"

import { useState, useEffect } from 'react'
import { Editor } from '@tiptap/react'
import { v4 as uuidv4 } from 'uuid'
import type { Block, BlockEditorContent } from '@/components/block-editor/types'

interface UseBlockEditorProps {
  initialContent?: BlockEditorContent
  onChange: (content: BlockEditorContent) => void
}

export function useBlockEditor({ initialContent, onChange }: UseBlockEditorProps) {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)
  const [blocks, setBlocks] = useState<Block[]>([])

  useEffect(() => {
    if (initialContent?.blocks) {
      setBlocks(initialContent.blocks)
      if (initialContent.blocks.length > 0) {
        setSelectedBlock(initialContent.blocks[0])
      }
    }
  }, [initialContent])

  const handleEditorUpdate = (editor: Editor) => {
    if (!selectedBlock) return

    const updatedBlock = {
      ...selectedBlock,
      data: {
        text: editor.getHTML()
      }
    }

    setBlocks(prevBlocks => {
      const newBlocks = selectedBlock.blockId 
        ? prevBlocks.map(b => b.blockId === selectedBlock.blockId ? updatedBlock : b)
        : [...prevBlocks, updatedBlock]

      onChange({
        time: new Date().toISOString(),
        blocks: newBlocks,
        version: '1.0.0'
      })

      return newBlocks
    })
  }

  const handleBlockSelect = (block: Block) => {
    setSelectedBlock(block)
  }

  const handleNewBlock = () => {
    const newBlock = {
      blockId: uuidv4(),
      type: 'paragraph',
      data: { text: '' },
      description: '',
      system: ''
    }
    setBlocks(prev => [...prev, newBlock])
    setSelectedBlock(newBlock)
  }

  const handleBlockUpdate = (updatedBlock: Block) => {
    setSelectedBlock(updatedBlock)
    setBlocks(prev => 
      prev.map(b => b.blockId === updatedBlock.blockId ? updatedBlock : b)
    )
  }

  return {
    blocks,
    selectedBlock,
    handleEditorUpdate,
    handleBlockSelect,
    handleNewBlock,
    handleBlockUpdate
  }
}
