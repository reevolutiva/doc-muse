"use client"

import { useCallback, useRef } from 'react'
import { 
  ReactFlow as Flow, 
  Background,
  Controls,
  Connection,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  ReactFlowProvider
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { toast } from 'sonner'
import TemplateNode from './TemplateNode'
import type { 
  TemplateNode as TTemplateNode,
  TemplateNodeData, 
  TemplateEdge,
  TemplateVisualData 
} from '@/lib/types/templates'

const nodeTypes = {
  template: TemplateNode
}

interface TemplateCanvasProps {
  initialData?: TemplateVisualData
  onChange?: (data: TemplateVisualData) => void
  readOnly?: boolean
  onNodeSelect?: (node: TTemplateNode | null) => void
}

export function TemplateCanvas({ 
  initialData, 
  onChange, 
  readOnly = false,
  onNodeSelect 
}: TemplateCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialData?.nodes || [])
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData?.edges || [])

  const onConnect = useCallback((params: Connection | TemplateEdge) => {
    setEdges(eds => addEdge(params, eds))
    onChange?.({ nodes, edges: addEdge(params, edges) })
  }, [nodes, edges, onChange, setEdges])

  const onNodeClick = useCallback((event: React.MouseEvent, node: TTemplateNode) => {
    event.preventDefault()
    onNodeSelect?.(node)
  }, [onNodeSelect])

  const onPaneClick = useCallback(() => {
    onNodeSelect?.(null)
  }, [onNodeSelect])

  return (
    <ReactFlowProvider>
      <div ref={reactFlowWrapper} className="w-full h-full">
        <Flow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-dots"
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Controls />
        </Flow>
      </div>
    </ReactFlowProvider>
  )
}
