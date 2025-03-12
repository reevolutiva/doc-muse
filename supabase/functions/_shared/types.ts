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
export interface RequestWithAuth extends Request {
  headers: Headers & {
    get(name: "authorization"): string | null;
  }
}

export interface EdgeFunctionResponse {
  success: boolean
  data?: any
  error?: string
  message?: string
}

export interface ContentReuseRequest {
  documentId: string
  projectId: string
  currentContent: string
}

export interface DocumentGenerationRequest {
  type: string
  projectId: string
  templateId: string
  description: string
}

export interface DocumentCompletionRequest {
  documentId: string
  completed: boolean
}
