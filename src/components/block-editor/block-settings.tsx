"use client"

import type { BlockSettingsProps } from './types'

export function BlockSettings({ block, onUpdate }: BlockSettingsProps) {
  return (
    <div className="border-t pt-4 space-y-4">
      <h3 className="font-semibold text-gray-700">Block Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Block Description
          </label>
          <input
            type="text"
            value={block.description || ''}
            onChange={(e) => {
              onUpdate({
                ...block,
                description: e.target.value
              })
            }}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Describe the purpose of this block..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            AI System Prompt
          </label>
          <textarea
            value={block.system || ''}
            onChange={(e) => {
              onUpdate({
                ...block,
                system: e.target.value
              })
            }}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter AI prompt for content generation..."
          />
        </div>
      </div>
    </div>
  )
}
