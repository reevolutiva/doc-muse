"use client"

import { useState, useEffect } from "react"
import { Star, StarHalf, Filter, ChevronDown, Heart, Loader2, Plus } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useInView } from 'react-intersection-observer'
import { Listbox } from '@headlessui/react'
import { toast, Toaster } from "sonner"
import { supabase } from "@/lib/supabase"
import { TemplateForm } from "@/components/template-manager/template-form"
import * as Dialog from '@radix-ui/react-dialog'
import { useSearchParams } from "next/navigation"

const sortOptions = [
  { id: 'popular', name: 'Most Popular' },
  { id: 'newest', name: 'Newest' },
  { id: 'rating', name: 'Highest Rated' }
]

const categories = [
  { id: 'all', name: 'All Templates' },
  { id: 'elearning', name: 'E-Learning' },
  { id: 'workshop', name: 'Workshop' },
  { id: 'assessment', name: 'Assessment' },
  { id: 'presentation', name: 'Presentation' }
]

export default function TemplatesPage() {
  // Obtener los parámetros de URL
  const searchParams = useSearchParams()
  const editTemplateId = searchParams.get('edit')
  
  // Estado para la plantilla que se está editando
  const [editingTemplate, setEditingTemplate] = useState(null)
  
  // ... existing states ...
  const [selectedCategories, setSelectedCategories] = useState(['all'])
  const [sortBy, setSortBy] = useState(sortOptions[0])
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [quickViewTemplate, setQuickViewTemplate] = useState(null)
  const [favorites, setFavorites] = useState(new Set())
  const [showDialog, setShowDialog] = useState(false)
  const { ref, inView } = useInView({
    threshold: 0
  })

  // Cargar plantillas
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('document_templates')
          .select('*')
          .order('created_at', { ascending: false })
          .range((page - 1) * 12, page * 12 - 1)
        if (error) throw error
        setTemplates(prev => page === 1 ? data : [...prev, ...data])
        setHasMore(data.length === 12)
      } catch (error) {
        toast.error('Failed to load templates')
      } finally {
        setLoading(false)
      }
    }
    fetchTemplates()
  }, [page])

  // Cargar la plantilla específica para edición si se proporciona un ID
  useEffect(() => {
    const fetchTemplateForEdit = async () => {
      if (!editTemplateId) return
      
      try {
        const { data, error } = await supabase
          .from('document_templates')
          .select('*')
          .eq('id', editTemplateId)
          .single()
          
        if (error) throw error
        
        // Procesar el contenido si es un string
        if (data && typeof data.content === 'string') {
          try {
            data.content = JSON.parse(data.content)
          } catch (e) {
            console.warn('Failed to parse template content')
          }
        }
        
        setEditingTemplate(data)
        setShowDialog(true)
      } catch (error) {
        console.error('Error fetching template:', error)
        toast.error('No se pudo cargar la plantilla para editar')
      }
    }
    
    fetchTemplateForEdit()
  }, [editTemplateId])

  const openTemplateEditor = (templateId) => {
    window.open(`/templates?edit=${templateId}`, '_blank')
  }

  const toggleFavorite = (e, templateId) => {
    e.stopPropagation(); // Evita que el clic se propague a la tarjeta
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(templateId)) {
        newFavorites.delete(templateId)
      } else {
        newFavorites.add(templateId)
      }
      return newFavorites
    })
    toast.success('Template favorites updated')
  }

  interface FormData {
    title: string;
    description: string;
    content: {
      time: number;
      blocks: any[];
      version: string;
    };
  }

  const handleSaveTemplate = async (formData: FormData) => {
    try {
      // Si estamos editando una plantilla existente
      if (editTemplateId && editingTemplate) {
        const { error } = await supabase
          .from('document_templates')
          .update({
            title: formData.title,
            description: formData.description,
            content: formData.content,
            updated_at: new Date().toISOString()
          })
          .eq('id', editTemplateId)
          
        if (error) throw error
        
        toast.success('Plantilla actualizada correctamente')
        // Actualizar la lista de plantillas
        setTemplates(prev => 
          prev.map(t => t.id === editTemplateId 
            ? { ...t, 
                title: formData.title, 
                description: formData.description, 
                content: formData.content,
                updated_at: new Date().toISOString()
              } 
            : t
          )
        )
        
        // Si la edición fue abierta en una nueva pestaña, cerramos al finalizar
        if (window.opener) {
          window.close()
        }
        
        return { id: editTemplateId }
      } else {
        // Crear nueva plantilla
        const { data, error } = await supabase
          .from('document_templates')
          .insert({
            title: formData.title,
            description: formData.description,
            content: formData.content
          })
          .select()
  
        if (error) throw error
        setTemplates(prev => [data[0], ...prev])
        return data
      }
    } catch (error) {
      console.error('Error saving template:', error)
      throw error
    }
  }

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategories.includes('all') || selectedCategories.includes(template.type)
    return matchesCategory
  })

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Templates</h1>
            <p className="text-muted-foreground">
              Discover and manage professional learning templates
            </p>
          </div>
          <Dialog.Root open={showDialog} onOpenChange={setShowDialog}>
            <Dialog.Trigger asChild>
              <button
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Template
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <TemplateForm 
                onClose={() => {
                  setShowDialog(false)
                  setEditingTemplate(null)
                  // Limpiar parámetro de edición de la URL
                  if (editTemplateId) {
                    window.history.replaceState({}, '', '/templates')
                  }
                }} 
                onSave={handleSaveTemplate}
                initialData={editingTemplate || {
                  title: '',
                  description: '',
                  content: {
                    time: Date.now(),
                    blocks: [],
                    version: '1.0.0'
                  }
                }}
                mode={editTemplateId ? "edit" : "create"}
              />
            </Dialog.Portal>
          </Dialog.Root>
        </div>
        
        {/* Categories */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                if (category.id === 'all') {
                  setSelectedCategories(['all'])
                } else {
                  setSelectedCategories(prev => 
                    prev.includes('all') ? [category.id] :
                    prev.includes(category.id) ? 
                      prev.filter(id => id !== category.id) :
                      [...prev, category.id]
                  )
                }
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategories.includes(category.id) 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Featured Templates */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Featured Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.slice(0, 3).map((template) => (
              <div
                key={template.id}
                onClick={() => openTemplateEditor(template.id)}
                className="relative group bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="aspect-[16/9] bg-gray-100">
                  <img
                    src={`https://source.unsplash.com/featured/400x225?education,${template.id}`}
                    alt={template.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-lg">{template.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{template.description}</p>
                    </div>
                    <button
                      onClick={(e) => toggleFavorite(e, template.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Heart
                        className={`h-5 w-5 ${favorites.has(template.id) ? 'fill-red-500 text-red-500' : ''}`}
                      />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-500 ml-1">4.5</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* All Templates */}
        <div>
          <h2 className="text-xl font-semibold mb-4">All Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => openTemplateEditor(template.id)}
                className="relative group bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="aspect-[4/3] bg-gray-100">
                  <img
                    src={`https://source.unsplash.com/featured/300x225?education,${template.id}`}
                    alt={template.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium">{template.title}</h3>
                    <button
                      onClick={(e) => toggleFavorite(e, template.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Heart
                        className={`h-4 w-4 ${favorites.has(template.id) ? 'fill-red-500 text-red-500' : ''}`}
                      />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">{template.description}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Load More Trigger */}
          {hasMore && (
            <div ref={ref} className="flex justify-center mt-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          )}
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}
