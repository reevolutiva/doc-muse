"use client"

import { useState, useCallback, useEffect } from "react"
import { Upload, FileText, X, Trash2, History, Clock } from "lucide-react"
import { toast } from "sonner"
import * as Dialog from '@radix-ui/react-dialog'
import { useDocumentUpload } from "@/lib/hooks/useDocumentUpload"
import { useDocumentList } from "@/lib/hooks/useDocumentList"
import { DocumentList } from "./document-list"
import { DocumentEditor } from "./document-editor"
import { TemplatesList } from "./templates-list"
import { supabase } from "@/lib/supabase"

interface DocumentManagerProps {
  projectId?: string
  onDocumentChange?: (count: number) => void
}

export function DocumentManager({ projectId, onDocumentChange }: DocumentManagerProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showVersions, setShowVersions] = useState<string | null>(null)
  const [versions, setVersions] = useState<any[]>([])
  
  const { uploadProgress, uploadFile } = useDocumentUpload({ 
    projectId, 
    onSuccess: onDocumentChange 
  })
  
  const { documents, isLoading, deleteDocument, addDocument } = useDocumentList({ 
    projectId, 
    onCountChange: onDocumentChange 
  })


  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploadedFile = await uploadFile(file);
      addDocument({
        name: uploadedFile.name,
        id: uploadedFile.id
      });
    } catch (error: any) {
      toast.error('Error uploading document');
      console.error('Upload error:', error);
    }
  }, [uploadFile, addDocument]);


  return (
    <div>
      <Dialog.Root open={showDialog} onOpenChange={setShowDialog}>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
          <FileText className="w-4 h-4" />
          Documents
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Dialog.Overlay>
        <Dialog.Content asChild>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Dialog.Title className="text-xl font-semibold">
                  Resources & Docs
                </Dialog.Title>
                <div className="flex items-center gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowTemplates(false)}
                    className={`text-sm font-medium ${!showTemplates ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Documents
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTemplates(true)}
                    className={`text-sm font-medium ${showTemplates ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Templates
                  </button>
                </div>
              </div>
              <Dialog.Close asChild>
                <button type="button" className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="space-y-4">
              {!showTemplates ? (
                <>
                  <label className="flex items-center gap-2 justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <Upload className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium">Upload Document</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>

                  <div className="space-y-2">
                {isLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : documents.length === 0 ? (
                  <div className="text-center p-4 text-gray-500">
                    No documents uploaded yet
                  </div>
                ) : (
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium truncate">{doc.name}</span>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>Version 1</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowVersions(doc.id);
                              }}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              View History
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2 flex-shrink-0"
                        title="Delete document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
                  </div>
                </>
              ) : (
                <TemplatesList projectId={projectId} onSuccess={() => setShowTemplates(false)} />
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
    </div>
  )
}
