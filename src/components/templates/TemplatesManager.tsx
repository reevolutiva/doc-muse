"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectTemplateManager } from "@/components/project-template/project-template-manager"
import { DocumentTemplateList } from "@/components/templates/document-template-list"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Folders } from "lucide-react"
import { useRouter } from "next/navigation"

export function TemplatesManager() {
  const [activeTab, setActiveTab] = useState<"documents" | "projects">("documents")
  const router = useRouter()
  
  const handleCreateTemplate = () => {
    if (activeTab === "documents") {
      router.push("/templates/visual-editor")
    } else {
      // Abrir modal para crear plantilla de proyecto
      // Esto se maneja dentro del ProjectTemplateManager
    }
  }
  
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Templates</h1>
          <p className="text-muted-foreground">
            Create and manage document and project templates
          </p>
        </div>
        
        <Button onClick={handleCreateTemplate} className="flex items-center gap-2">
          <Plus size={16} />
          Create {activeTab === "documents" ? "Document" : "Project"} Template
        </Button>
      </div>
      
      <Tabs defaultValue="documents" onValueChange={(value) => setActiveTab(value as any)}>
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
          <DocumentTemplateList />
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-4">
          <ProjectTemplateManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
