export type ProcessDocumentRequest = {
  projectId: string;
  documentId: string;
  content: string;
}

export type ProcessDocumentResponse = {
  success: boolean;
  error?: string;
}

export type DocumentChunk = {
  content: string;
  embedding: number[];
}
