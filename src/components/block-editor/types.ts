import { Editor } from '@tiptap/core'

export interface Block {
  blockId: string
  type: string
  data: Record<string, any>
  description?: string
  system?: string
}

export interface BlockEditorContent {
  time: string
  blocks: Block[]
  version: string
}

export interface BlockEditorProps {
  initialContent?: BlockEditorContent
  onChange: (content: BlockEditorContent) => void
}

export interface BlockListProps {
  blocks: Block[]
  selectedBlock: Block | null
  onBlockSelect: (block: Block) => void
  onNewBlock: () => void
}

export interface BlockSettingsProps {
  block: Block
  onUpdate: (updatedBlock: Block) => void
}

export interface EditorToolbarProps {
  editor: Editor | null
}
