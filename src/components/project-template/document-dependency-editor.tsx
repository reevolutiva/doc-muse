"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Template } from "@/lib/types/template"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface Dependency {
  source: string
  target: string
  type: 'REQUIRED' | 'OPTIONAL'
}

interface DocumentDependencyEditorProps {
  template: Template
  onCancel: () => void
  onSave: () => void
}

export function DocumentDependencyEditor({
  template,
  onCancel,
  onSave
}: DocumentDependencyEditorProps) {
  const [dependencies, setDependencies] = useState<Dependency[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const response = await fetch(`/api/templates/${template.id}/dependencies`)
        if (!response.ok) throw new Error('Failed to fetch dependencies')
        
        const data = await response.json()
        setDependencies(data.map((dep: any) => ({
          source: dep.source_document_id,
          target: dep.target_document_id,
          type: dep.dependency_type
        })))
      } catch (error) {
        console.error('Error:', error)
        toast.error("Failed to load dependencies")
      } finally {
        setLoading(false)
      }
    }

    fetchDependencies()
  }, [template.id])

  const handleAddDependency = () => {
    const templateDocuments = template.documents || []
    if (templateDocuments.length < 2) return

    setDependencies([
      ...dependencies,
      {
        source: templateDocuments[0].id,
        target: templateDocuments[1].id,
        type: 'REQUIRED'
      }
    ])
  }

  const handleRemoveDependency = (index: number) => {
    setDependencies(dependencies.filter((_, i) => i !== index))
  }

  const handleUpdateDependency = (index: number, field: keyof Dependency, value: string) => {
    const newDependencies = [...dependencies]
    newDependencies[index] = {
      ...newDependencies[index],
      [field]: value
    }
    setDependencies(newDependencies)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch(`/api/templates/${template.id}/dependencies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dependencies }),
      })
      
      if (!response.ok) throw new Error('Failed to save dependencies')
      
      toast.success("Dependencies saved successfully")
      onSave()
    } catch (error) {
      console.error('Error:', error)
      toast.error("Failed to save dependencies")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {dependencies.map((dep, index) => (
          <div key={index} className="flex items-center gap-4 p-4 bg-white border rounded-lg">
            <Select
              value={dep.source}
              onValueChange={(value) => handleUpdateDependency(index, 'source', value)}
            >
              {template.documents?.map((doc) => (
                <option key={doc.id} value={doc.id}>{doc.title}</option>
              ))}
            </Select>
            
            <span className="text-gray-500">depends on</span>
            
            <Select
              value={dep.target}
              onValueChange={(value) => handleUpdateDependency(index, 'target', value)}
            >
              {template.documents?.map((doc) => (
                <option key={doc.id} value={doc.id}>{doc.title}</option>
              ))}
            </Select>
            
            <Select
              value={dep.type}
              onValueChange={(value) => handleUpdateDependency(index, 'type', value as 'REQUIRED' | 'OPTIONAL')}
            >
              <option value="REQUIRED">Required</option>
              <option value="OPTIONAL">Optional</option>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRemoveDependency(index)}
              className="text-red-600 hover:text-red-700"
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      {(template.documents?.length || 0) >= 2 && (
        <Button
          variant="outline"
          onClick={handleAddDependency}
          className="w-full"
        >
          Add Dependency
        </Button>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Dependencies'
          )}
        </Button>
      </div>
    </div>
  )
}