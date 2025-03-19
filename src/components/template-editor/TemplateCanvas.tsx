import { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TemplateNode } from './TemplateNode';
import { SideBar } from './SideBar';
import { PropertiesPanel } from './PropertiesPanel';
import { toast } from 'react-hot-toast';
import type { TemplateNodeData } from './TemplateNode';
import { supabase } from '@/lib/supabase'

// Define node types for our custom nodes
const nodeTypes = {
  templateNode: TemplateNode
};

interface TemplateCanvasProps {
  initialNodes?: Node<TemplateNodeData>[];
  initialEdges?: Edge[];
  onSave?: (nodes: Node<TemplateNodeData>[], edges: Edge[]) => void;
  readOnly?: boolean;
}

export const TemplateCanvas = ({
  initialNodes = [],
  initialEdges = [],
  onSave,
  readOnly = false
}: TemplateCanvasProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<TemplateNodeData[]>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<TemplateNodeData> | null>(null);


  useEffect(() => {

    const fetchNodes = async () => { 

      // Si la url no tiene el id del template, no se hace nada
      if (!location.href.includes("id=")) {
        return;
      }

      const tempalte_id = location.href.split("/").pop().split("id=")[1];

      
      let { data: document_templates, error } = await supabase
      .from('document_templates')
      .select('*')
      .eq('id', tempalte_id)
      .single();

      const content = document_templates.content;
      const blocks = content.blocks;
      const edges = content.edges;
       

      setNodes(blocks);
      setEdges(edges);
      
     };

     fetchNodes();
    
  }
  , []);

  // Handle connections between nodes
  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Handle node selection for properties panel
  const onNodeClick = useCallback((_, node: Node<TemplateNodeData>) => {
    if (!readOnly) {
      setSelectedNode(node);
    }
  }, [readOnly]);

  // Add a new node to the canvas
  const onAddNode = (nodeData: TemplateNodeData) => {
    if (readOnly) return;
    
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'templateNode',
      position: { x: 100, y: 100 },
      data: { ...nodeData }
    };
    setNodes((nds) => [...nds, newNode]);
    
    if (onSave) {
      onSave([...nodes, newNode], edges);
    }
  };

  // Handle node updates
  const handleNodeUpdate = (nodeId: string, data: Partial<TemplateNodeData>) => {
    if (readOnly) return;

    try {
      const updatedNodes = nodes.map(node => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, ...data } }
          : node
      );
      setNodes(updatedNodes);
      
      if (onSave) {
        onSave(updatedNodes, edges);
      }
      
      toast.success('Node updated successfully');
    } catch (error: any) {
      toast.error(`Error updating node: ${error.message}`);
    }
  };

  return (
    <div className="flex h-full">
      {!readOnly && (
        <div className="w-64 border-r border-gray-200 p-4">
          <SideBar onAddNode={onAddNode} />
        </div>
      )}
      
      <div className="flex-1">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            nodesDraggable={!readOnly}
            nodesConnectable={!readOnly}
            elementsSelectable={!readOnly}
          >
            <Background />
            <Controls />
            <Panel position="top-right">
              {onSave && !readOnly && (
                <button
                  onClick={() => onSave(nodes, edges)}
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Save Changes
                </button>
              )}
            </Panel>
          </ReactFlow>
        </ReactFlowProvider>
      </div>
      
      {selectedNode && !readOnly && (
        <div className="w-80 border-l border-gray-200 p-4">
          <PropertiesPanel 
            node={selectedNode}
            updateNode={(updatedData) => handleNodeUpdate(selectedNode.id, updatedData)}
            onClose={() => setSelectedNode(null)}
          />
        </div>
      )}
    </div>
  );
};

export default TemplateCanvas;