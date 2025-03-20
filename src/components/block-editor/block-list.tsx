"use client"

import { Plus } from 'lucide-react'
import type { BlockListProps } from './types'

export function BlockList({ blocks, selectedBlock, onBlockSelect, onNewBlock }: BlockListProps) {
  return (
    <div className="w-64 border-r pr-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-700">Blocks</h3>
        <button
          onClick={onNewBlock}
          className="p-1 rounded hover:bg-gray-100"
          title="Add new block"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-2">
        {blocks.map((block) => (
          <div
            key={block.blockId}
            onClick={() => onBlockSelect(block)}
            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
              selectedBlock?.blockId === block.blockId
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-sm font-medium truncate">
              {block.description || 'Untitled Block'}
            </div>
            <div className="text-xs text-gray-500 mt-1 truncate">
              {block.type}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
