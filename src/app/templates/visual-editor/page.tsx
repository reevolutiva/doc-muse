"use client"
import { useCallback, useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { ReactFlowProvider } from '@xyflow/react'
import type { Node, Edge } from '@xyflow/react'
import { toast } from 'sonner'
import { Save, ArrowLeft, Undo, Redo } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { TemplateCanvas } from '@/components/template-editor/TemplateCanvas'
import { ValidationPanel } from '@/components/template-manager/validation-panel'
import { KeyboardHelpDialog } from '@/components/template-manager/keyboard-help-dialog'
import { TemplateHints } from '@/components/template-manager/template-hints'
import { TemplateTutorial } from '@/components/template-manager/template-tutorial'
import { useTemplateEditorKeyboard } from '@/lib/hooks/useTemplateEditorKeyboard'
import { useTemplateHistory } from '@/lib/hooks/useTemplateHistory'
import { validateTemplateData, validateDependencies } from '@/lib/utils/template-helpers'
import type { TemplateNodeData } from '@/components/template-editor/TemplateNode'
import { TemplateErrorBoundary } from '@/components/template-manager/template-error-boundary'
import { supabase } from '@/lib/supabase'

interface TemplateHistoryState {
  nodes: Node<TemplateNodeData & Record<string, unknown>>[]
  edges: Edge[]
  title: string
  description: string
}

export default function VisualEditor({ searchParams }) {
  const id = searchParams?.id || null
  const templateType = searchParams?.type || "document" // Por defecto es documento si no se especifica
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState('Untitled Template')
  const [description, setDescription] = useState('')
  const [nodes, setNodes] = useState<Node<TemplateNodeData>[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedNode, setSelectedNode] = useState<Node<TemplateNodeData> | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)

  // Inicializar el historial
  const { canUndo, canRedo, undo, redo, saveState } = useTemplateHistory<TemplateHistoryState>()

  // Handler para deshacer cambios
  const handleUndo = useCallback(() => {
    const prevState = undo()
    if (prevState) {
      setNodes(prevState.nodes)
      setEdges(prevState.edges)
      setTitle(prevState.title)
      setDescription(prevState.description)
      setHasUnsavedChanges(true)
    }
  }, [undo])

  // Handler para rehacer cambios
  const handleRedo = useCallback(() => {
    const nextState = redo()
    if (nextState) {
      setNodes(nextState.nodes)
      setEdges(nextState.edges)
      setTitle(nextState.title)
      setDescription(nextState.description)
      setHasUnsavedChanges(true)
    }
  }, [redo])

  // Guardar estado en el historial cuando hay cambios
  useEffect(() => {
    saveState({
      nodes,
      edges,
      title,
      description
    })
  }, [nodes, edges, title, description, saveState])

  useEffect(() => {
    if (id) {
      // Cargar plantilla existente
      const fetchTemplate = async () => {
        try {
          // Determinar la tabla de Supabase según el tipo
          const table = templateType === "project" ? 'project_templates' : 'document_templates'
          
          const { data, error } = await supabase
            .from(table)
            .select('*')
            .eq('id', id)
            .single()
            
          if (error) throw error
          
          if (data) {

            let title = 'Untitled Template';
            let description = '';

            if (templateType === "document") {
              title = data.title || 'Untitled Template';
              description = data.description || '';
            }

            if (templateType === "project") {
              title = data.name || 'Untitled Template';
              description = data.description || '';
            }

            setTitle(title)
            setDescription(description)
            
            if (data.visual_data) {
              setNodes(data.visual_data.nodes || [])
              setEdges(data.visual_data.edges || [])
            }
          }
        } catch (error) {
          console.error("Error loading template:", error)
          toast.error("Failed to load template")
        }
      }
      
      fetchTemplate()
    }
  }, [id, templateType])

  // Prevenir navegación si hay cambios sin guardar
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  useEffect(() => {
    // Check if this is the user's first time
    const hasCompletedTutorial = localStorage.getItem('template-tutorial-completed')
    if (!hasCompletedTutorial && !id) {
      setShowTutorial(true)
    }
  }, [id])

  useEffect(() => {
    console.log( "type", templateType );
  }, [])

  const handleSave = async () => {

    if (!title.trim()) {
      toast.error('Please enter a title')
      return
    }

    const templateData = {
      title: title.trim(),
      description: description.trim(),
      visual_data: { nodes, edges }
    }

  

    // Validar datos antes de guardar
    const validation = validateTemplateData({
      id: id || '',
      ...templateData,
      type: 'document',
      created_at: '',
      updated_at: ''
    })

    console.log("templateData", templateData)
    console.log("validation", validation)

    if (!validation.isValid) {
      toast.error(`Validation failed: ${validation.errors.join(', ')}`)
      return
    }

    // Validar dependencias
    const depValidation = validateDependencies(templateData.visual_data)
    if (!depValidation.isValid) {
      console.log("depValidation", depValidation)
      toast.error(`Dependency validation failed: ${depValidation.errors.join(', ')}`)
      return
    }

    const show_response  = response =>{

      const savedTemplate = response[0];
      if (!id) {
        window.history.replaceState({}, '', `/templates/visual-editor?id=${savedTemplate.id}`)
      }

    }

    try {
      setIsLoading(true)

      const table = templateType === "project" ? 'project_templates' : 'document_templates'

      // Estamos editando o creando una nueva plantilla?
      const is_newTemplate = location.href.includes("id=") ? false : true


      async function newDocumentTemplate( templateData, user_id ){

        const { data: response , error } = await supabase
        .from('document_templates')
        .insert([
          { 
            title: templateData.title,
            description: templateData.description,
            content: templateData.visual_data,
            user_id: user_id , // TODO: Obtener el user_id del usuario actual
            config: {}, // TODO: Configuración del template
            visual_data: templateData.visual_data,
            type: templateType,
            is_required: false
          },
        ])
        .select()

        return response
      }


      async function newProjectTemplate( templateData, user_id ){
        
        const { data: response , error } = await supabase
        .from('project_templates')
        .insert([
          { 
            
            "name": templateData.title,
            "description": templateData.description,
            "created_at": new Date().toISOString(),
            "updated_at": new Date().toISOString(),
            "content": templateData.visual_data,
            "user_id": user_id,
          },
        ])
        .select()

        return
      }

      if (is_newTemplate) {

        // Obtener el user_id del usuario actual
        const { data: { session } } = await supabase.auth.getSession()
        const user_id = session?.user?.id

        let response = null

        if( templateType === "document" ){
          response = await newDocumentTemplate( templateData, user_id )
          
        }

        if( templateType === "project" ){
          response = await newProjectTemplate( templateData, user_id )
        }

          show_response(response)
        
      }

      if(! is_newTemplate ){
      // Extrae da la ultima parte de la url
      const urlParams = new URLSearchParams(window.location.search);
      const tempalte_id = urlParams.get('id');
      const type = urlParams.get('type');

      
      const body = {
        "blocks" : templateData.visual_data.nodes,
        "edges" : templateData.visual_data.edges
      }

      console.log("body", body)

    
      const { data: response , error } = await supabase
      .from( table )
      .update({ "content": body })
      .eq( "id" , tempalte_id )
      .select()

      if (error) throw new Error('Failed to save template')

      show_response(response)

    }

    
      
      
      
      
      setHasUnsavedChanges(false)
      toast.success('Template saved successfully')
    } catch (error) {
      console.error('Error saving template:', error)
      toast.error('Failed to save template')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFlowChange = useCallback((newNodes: Node[], newEdges: Edge[]) => {
    setNodes(newNodes as Node<TemplateNodeData>[])
    setEdges(newEdges)
    setHasUnsavedChanges(true)
  }, [])

  const handleDeleteNode = useCallback((nodeId: string) => {

    console.log("handleDeleteNode", nodeId)
    setNodes(prev => prev.filter(n => n.id !== nodeId))
    setEdges(prev => prev.filter(e => e.source !== nodeId && e.target !== nodeId))
    setSelectedNode(null)
    setHasUnsavedChanges(true)
     
  }, [])

  const handleTutorialComplete = useCallback(() => {
    localStorage.setItem('template-tutorial-completed', 'true')
    setShowTutorial(false)
    toast.success('Tutorial completed! You can now create your template.')
  }, [])

  // Integrar el hook de teclado con undo/redo
  useTemplateEditorKeyboard({
    nodes,
    edges,
    selectedNode,
    onNodesChange: setNodes,
    onEdgesChange: setEdges,
    onSave: handleSave,
    onDelete: handleDeleteNode,
    onUndo: handleUndo,
    onRedo: handleRedo,
    canUndo,
    canRedo
  })

  const visualData = useMemo(() => ({
    nodes: nodes as Node[],
    edges: edges
  }), [nodes, edges]);


  return (
    <TemplateErrorBoundary>
      <ReactFlowProvider>
        <div className="h-screen flex flex-col">
          <header className="border-b p-4 bg-background">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link 
                  href="/templates" 
                  className="text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    if (hasUnsavedChanges) {
                      if (!confirm('You have unsaved changes. Are you sure you want to leave?')) {
                        e.preventDefault()
                      }
                    }
                  }}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex flex-col gap-2">
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value)
                      setHasUnsavedChanges(true)
                    }}
                    className="text-xl font-semibold bg-transparent border-none px-0 focus-visible:ring-0"
                    placeholder="Template Title"
                  />
                  <Textarea
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value)
                      setHasUnsavedChanges(true)
                    }}
                    className="text-sm text-muted-foreground bg-transparent border-none px-0 focus-visible:ring-0 resize-none"
                    placeholder="Add a description..."
                    rows={1}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!canUndo}
                  onClick={handleUndo}
                  title="Undo (⌘Z)"
                >
                  <Undo className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!canRedo}
                  onClick={handleRedo}
                  title="Redo (⌘⇧Z)"
                >
                  <Redo className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={isLoading || !title.trim()}
                  className="flex items-center gap-2 ml-2"
                >
                  <Save className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Saving...' : 'Save Template'}
                </Button>
              </div>
            </div>
          </header>
          
          <div className="flex-1 flex relative">
            <div className="flex-1 bg-accent/5">
              <TemplateCanvas 
                initialNodes={nodes}
                initialEdges={edges}
                onSave={handleFlowChange}
              />
              
              <TemplateHints 
                nodes={nodes}
                edges={edges}
              />
              
              {showTutorial && (
                <TemplateTutorial
                  nodes={nodes}
                  edges={edges}
                  onComplete={handleTutorialComplete}
                />
              )}
            </div>
            
            <ValidationPanel 
              visualData={visualData}
            />
            <KeyboardHelpDialog />
          </div>
          
          <div className="fixed bottom-4 left-16 z-50">
            <span className="text-xs text-gray-500">
              Press <kbd className="px-1 py-0.5 text-xs font-semibold bg-gray-100 border rounded">?</kbd> for keyboard shortcuts
            </span>
          </div>
        </div>
      </ReactFlowProvider>
    </TemplateErrorBoundary>
  )
}