"use client"

import { FileText, AlertCircle } from "lucide-react"
import { useTemplateLoader } from "@/lib/hooks/templates/useTemplateLoader.ts"
import { createErrorHandler } from "@/lib/utils/error-handler"

interface ProjectTemplateInfoProps {
  templateId: string | null
}

export function ProjectTemplateInfo({ templateId }: ProjectTemplateInfoProps) {
  const errorHandler = createErrorHandler('Project Template Info');

  console.log( "Entraste a ProjectTemplateInfo" );

  // Function to extract the last part of the URL
  const getLastPartOfUrl = (url: string | null): string | null => {
    if (!url) return null;
    const parts = url.split('/');
    return parts.pop() || null;
  };

  const projectId = getLastPartOfUrl(location.href);

  const { templateData: template, loading, error } = useTemplateLoader(projectId );

  console.log(projectId);
  console.log(template);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm text-blue-600">Loading template information...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-2 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-800">
        <div className="flex items-center gap-2 mb-1">
          <AlertCircle className="h-4 w-4" />
          <p className="font-medium">Failed to load template information</p>
        </div>
        <p>{error.message || "Please try refreshing the page or select a different template."}</p>
      </div>
    )
  }

  if (!template || template.length === 0) return null;

  const templateInfo = template[0].document_templates;

  return (
    <div className="mt-2 space-y-3">
      <p className="text-sm text-blue-700">{templateInfo.description}</p>
      
      {template.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-xs font-medium text-blue-900">Required Documents:</h5>
          <div className="space-y-2">
            {template.map((doc) => (
              <div 
                key={doc.document_template_id}
                className="flex items-start gap-2 text-sm"
              >
                <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">{doc.document_templates.title}</p>
                  {doc.document_templates.description && (
                    <p className="text-xs text-blue-700">{doc.document_templates.description}</p>
                  )}
                </div>
                {doc.is_required && (
                  <AlertCircle className="h-4 w-4 text-blue-600 ml-auto mt-0.5" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectTemplateInfo;
