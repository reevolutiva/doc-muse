"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Loader2, Eye, Edit, Trash2, Star, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

export function DocumentTemplateList() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  
  useEffect(() => {
    fetchTemplates()
  }, [])
  
  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setTemplates(data || [])
    } catch (error) {
      toast.error("Failed to load templates")
      console.error("Error loading templates:", error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleEdit = (templateId) => {
    router.push(`/templates/visual-editor?id=${templateId}`)
  }
  
  // Filtrar por búsqueda
  const filteredTemplates = templates.filter(template => 
    template.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (template.description && template.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No templates found. Create your first template!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <div key={template.id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-[16/9] bg-gray-100 relative">
                <img 
                  src={`https://source.unsplash.com/featured/300x225?document,${template.id}`}
                  alt={template.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-1">{template.title}</h3>
                {template.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{template.description}</p>
                )}
                <div className="flex justify-between items-center">
                  <div className="text-gray-500 text-sm">
                    {new Date(template.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(template.id)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit template"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
