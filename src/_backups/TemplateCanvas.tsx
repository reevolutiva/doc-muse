import { useCallback, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { TemplateNode } from './TemplateNode';
import { SideBar } from './SideBar';
import { PropertiesPanel } from './PropertiesPanel';
import { toast } from 'react-hot-toast';
import { TemplateNodeData } from './TemplateNode'; // Import the TemplateNodeData interface

// Define node types for our custom nodes
const nodeTypes = {
  templateNode: TemplateNode
};

export const TemplateCanvas = () => {
  // Initialize nodes and edges with empty arrays
  const [nodes, setNodes, onNodesChange] = useNodesState<TemplateNodeData[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node<TemplateNodeData> | null>(null);

  // Handle connections between nodes
  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Handle node selection for properties panel
  const onNodeClick = useCallback((_, node: Node<TemplateNodeData>) => {
    setSelectedNode(node);
  }, []);

  // Add a new node to the canvas
  const onAddNode = (nodeData: TemplateNodeData) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'templateNode',
      position: { x: 100, y: 100 },
      data: { ...nodeData }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div className="flex h-[80vh]">
      <div className="w-64 border-r border-gray-200 p-4">
        <SideBar onAddNode={onAddNode} />
      </div>
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
          >
            <Background />
            <Controls />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
      {selectedNode && (
        <div className="w-80 border-l border-gray-200 p-4">
          <PropertiesPanel 
            node={selectedNode} 
            updateNode={(updatedData) => {
              try {
                setNodes(nodes.map(node => 
                  node.id === selectedNode.id 
                    ? { ...node, data: { ...node.data, ...updatedData } }
                    : node
                ));
              } catch (error: any) {
                toast.error(`Error updating node: ${error.message}`);
              }
            }}
            onClose={() => setSelectedNode(null)}
          />
        </div>
      )}
    </div>
  );
};

export default TemplateCanvas;
