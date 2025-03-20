"use client"
import { Suspense, useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Plus, FileText, Folders } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { toast } from "react-hot-toast"
import Card from '../../components/shared/Card';

function TemplatesContent() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState<"documents" | "projects">(
    tabParam === "projects" ? "projects" : "documents"
  )
  const router = useRouter()
  const [documentTemplates, setDocumentTemplates] = useState([])
  const [projectTemplates, setProjectTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchTemplates()
  }, [])
  
  const fetchTemplates = async () => {
    try {
      setLoading(true)
      
      const { data: docData, error: docError } = await supabase
        .from('document_templates')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (docError) throw docError
      setDocumentTemplates(docData || [])
      
      const { data: projData, error: projError } = await supabase
        .from('project_templates')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (projError) throw projError
      setProjectTemplates(projData || [])
      
    } catch (error) {
      toast.error("Failed to load templates")
      console.error("Error loading templates:", error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleCreateTemplate = () => {
    router.push(`/templates/visual-editor${activeTab === "projects" ? "?type=project" : ""}`)
  }
  
  const handleEditTemplate = (id: string, type: string) => {
    router.push(`/templates/visual-editor?id=${id}${type === "project" ? "&type=project" : ""}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Templates</h1>
          <p className="text-muted-foreground">
            Create and manage templates for documents and projects
          </p>
        </div>
        
        <Button onClick={handleCreateTemplate} className="flex items-center gap-2">
          <Plus size={16} />
          Create New Template 
        </Button>
      </div>
      
      <Tabs 
        defaultValue={tabParam === "projects" ? "projects" : "documents"} 
        onValueChange={(value) => {
          setActiveTab(value as "documents" | "projects")
          router.push(`/templates?tab=${value}`, { scroll: false })
        }}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText size={16} />
            Document Templates
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Folders size={16} />
            Project Templates
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents" className="space-y-4">
          {documentTemplates.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No document templates found. Create your first template!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documentTemplates.map(template => (
                <Card
                  key={template.id}
                  id={template.id}
                  title={template.title}
                  description={template.description}
                  image={template.coverImage}
                  date={template.createdAt}
                  type="template"
                  onClick={() => handleEditTemplate(template.id, "document")}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-4">
          {projectTemplates.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No project templates found. Create your first template!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectTemplates.map(template => (
                <Card
                  key={template.id}
                  id={template.id}
                  title={template.title}
                  description={template.description}
                  image={template.coverImage}
                  date={template.createdAt}
                  type="template"
                  onClick={() => handleEditTemplate(template.id, "project")}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function TemplatesPageContent() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <TemplatesContent />
    </Suspense>
  )
}