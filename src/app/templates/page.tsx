"use client"

import { useState, useEffect } from "react"
import { Search, Star, StarHalf, Filter, ChevronDown, Heart, Loader2 } from "lucide-react"
import { useInView } from 'react-intersection-observer'
import { Listbox } from '@headlessui/react'
import { toast, Toaster } from "sonner"
import { supabase } from "@/lib/supabase"

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
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState(['all'])
  const [sortBy, setSortBy] = useState(sortOptions[0])
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [quickViewTemplate, setQuickViewTemplate] = useState(null)
  const [favorites, setFavorites] = useState(new Set())

  const { ref, inView } = useInView({
    threshold: 0
  })

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

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage(prev => prev + 1)
    }
  }, [inView, hasMore, loading])

  const toggleFavorite = (templateId: string) => {
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

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategories.includes('all') || 
                          selectedCategories.includes(template.type)
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Templates</h1>
          <p className="text-muted-foreground">
            Discover and manage professional learning templates
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Listbox value={sortBy} onChange={setSortBy}>
            <div className="relative w-48">
              <Listbox.Button className="w-full flex items-center justify-between px-4 py-2 border rounded-lg bg-white">
                <span>{sortBy.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                {sortOptions.map((option) => (
                  <Listbox.Option
                    key={option.id}
                    value={option}
                    className={({ active }) =>
                      `${active ? 'bg-blue-50 text-blue-600' : 'text-gray-900'}
                      cursor-pointer select-none relative py-2 px-4`
                    }
                  >
                    {option.name}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
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
                className="relative group bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
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
                      onClick={() => toggleFavorite(template.id)}
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
                className="relative group bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
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
                      onClick={() => toggleFavorite(template.id)}
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
