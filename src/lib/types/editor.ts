import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react'

export interface EditorRef extends TinyMCEEditor {
  getContent: () => string
  setContent: (content: string) => void
  insertContent: (content: string) => void
  selection: {
    setContent: (content: string) => void
  } | null
}

export interface EditorProps {
  projectId: string
  documentId: string
  initialContent?: string
  onSave?: () => void
}

export interface EditorInitProps {
  evt: any
  editor: EditorRef
}
