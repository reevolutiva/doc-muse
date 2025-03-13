import { Editor } from '@tiptap/react'

export interface EditorRef {
  getContent: () => string
  setContent: (content: string) => void
  insertContent: (content: string) => void
}

export interface EditorProps {
  projectId: string
  documentId: string
  initialContent?: string
  onSave?: (content?: string) => void
}
