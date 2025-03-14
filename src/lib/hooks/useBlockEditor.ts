"use client"

import { useState, useEffect } from 'react'
import { Editor } from '@tiptap/react'
import { v4 as uuidv4 } from 'uuid'
import type { Block, BlockEditorContent } from '@/components/block-editor/types'

interface UseBlockEditorProps {
  initialContent?: BlockEditorContent
  onChange: (content: BlockEditorContent) => void
}

// Initialize blocks immediately so that selectedBlock is not null on first render
const createEmptyBlock = (): Block => ({
  blockId: uuidv4(),
  type: 'paragraph',
  data: { text: '' },
  description: '',
  system: ''
});

export function useBlockEditor({ initialContent, onChange }: UseBlockEditorProps) {
  const initialBlocks = (initialContent?.blocks && initialContent.blocks.length > 0)
    ? initialContent.blocks
    : [createEmptyBlock()];

  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(initialBlocks[0]);

  // Update state from initialContent only if selectedBlock is not set
  useEffect(() => {
    if (!selectedBlock && initialContent?.blocks && initialContent.blocks.length > 0) {
      setBlocks(initialContent.blocks);
      setSelectedBlock(initialContent.blocks[0]);
    }
  }, [initialContent, selectedBlock]);

  const handleEditorUpdate = (editor: Editor) => {
    if (!selectedBlock) return;

    const updatedBlock = {
      ...selectedBlock,
      data: {
        text: editor.getHTML()
      }
    };

    setBlocks(prevBlocks => {
      const newBlocks = selectedBlock.blockId 
        ? prevBlocks.map(b => b.blockId === selectedBlock.blockId ? updatedBlock : b)
        : [...prevBlocks, updatedBlock];

      onChange({
        time: new Date().toISOString(),
        blocks: newBlocks,
        version: '1.0.0'
      });

      return newBlocks;
    });
  };

  const handleBlockSelect = (block: Block) => {
    setSelectedBlock(block);
  };

  const handleNewBlock = () => {
    const newBlock = createEmptyBlock();
    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlock(newBlock);
  };

  const handleBlockUpdate = (updatedBlock: Block) => {
    setSelectedBlock(updatedBlock);
    setBlocks(prev => 
      prev.map(b => b.blockId === updatedBlock.blockId ? updatedBlock : b)
    );
  };

  return {
    blocks,
    selectedBlock,
    handleEditorUpdate,
    handleBlockSelect,
    handleNewBlock,
    handleBlockUpdate
  };
}
