import { ReactFlow, Background, Controls, useNodesState, useEdgesState, Connection, Edge, addEdge, MarkerType, NodeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useState } from 'react';
import type { Node } from '@xyflow/react';
import { toast } from 'sonner';
import { 
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem 
} from '@/components/ui/select';
import { TemplateNode } from './TemplateNode';
import { TemplateEdge } from './template-manager/template-edge';

// Helper function to generate unique edge IDs
const generateEdgeId = () => `e${Math.random().toString(36).substr(2, 9)}`;

interface EdgeData extends Record<string, unknown> {
  dependencyType: string;
}

interface CanvasProps {
  initialData: {
    nodes: Node[];
    edges: Edge<EdgeData>[];
  };
  onNodeSelect: (node: Node) => void;
  onFlowChange: (nodes: Node[], edges: Edge<EdgeData>[]) => void;
}

const nodeTypes = {
  templateNode: TemplateNode
} as NodeTypes;

const edgeTypes = {
  template: TemplateEdge
};

const dependencyTypes = [
  { value: 'depends', label: 'Depends on' },
  { value: 'references', label: 'References' },
  { value: 'triggers', label: 'Triggers' },
  { value: 'optional', label: 'Optional' }
];

const Canvas = ({ initialData, onNodeSelect, onFlowChange }: CanvasProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge<EdgeData>>(initialData.edges);
  const [selectedEdge, setSelectedEdge] = useState<Edge<EdgeData> | null>(null);

  const validateConnection = (connection: Connection) => {
    // Evitar conexiones a sí mismo
    if (connection.source === connection.target) {
      toast.error("A node cannot connect to itself");
      return false;
    }

    // Evitar conexiones duplicadas
    const duplicateConnection = edges.find(
      edge => 
        edge.source === connection.source && 
        edge.target === connection.target
    );
    
    if (duplicateConnection) {
      toast.error("This connection already exists");
      return false;
    }

    // Evitar ciclos
    const wouldCreateCycle = checkForCycle(
      nodes,
      [...edges, connection as Edge<EdgeData>]
    );
    
    if (wouldCreateCycle) {
      toast.error("This connection would create a cycle");
      return false;
    }

    return true;
  };

  const checkForCycle = (nodes: Node[], edges: Edge<EdgeData>[]) => {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const dfs = (nodeId: string): boolean => {
      visited.add(nodeId);
      recursionStack.add(nodeId);

      const outgoingEdges = edges.filter(edge => edge.source === nodeId);
      for (const edge of outgoingEdges) {
        if (!visited.has(edge.target)) {
          if (dfs(edge.target)) return true;
        } else if (recursionStack.has(edge.target)) {
          return true;
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    for (const node of nodes) {
      if (!visited.has(node.id)) {
        if (dfs(node.id)) return true;
      }
    }

    return false;
  };

  const onConnect = useCallback(
    (params: Connection) => {
      if (validateConnection(params)) {
        const newEdge: Edge<EdgeData> = {
          ...params,
          id: generateEdgeId(),
          type: 'template',
          data: { dependencyType: 'depends' },
          markerEnd: { type: MarkerType.ArrowClosed },
          animated: true
        };
        setEdges(eds => addEdge(newEdge, eds) as Edge<EdgeData>[]);
        onFlowChange(nodes, edges);
      }
    },
    [nodes, edges, onFlowChange]
  );

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.stopPropagation();
      onNodeSelect(node);
    },
    [onNodeSelect]
  );

  const handleEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge<EdgeData>) => {
      event.stopPropagation();
      setSelectedEdge(edge);
    },
    []
  );

  const handleDependencyTypeChange = (value: string) => {
    if (!selectedEdge) return;

    setEdges(eds => 
      eds.map(edge => {
        if (edge.id === selectedEdge.id) {
          return {
            ...edge,
            data: { ...edge.data, dependencyType: value },
            animated: value === 'optional'
          };
        }
        return edge;
      })
    );

    setSelectedEdge(null);
  };

  const handlePaneClick = () => {
    setSelectedEdge(null);
  };

  return (
    <>
      <ReactFlow<Node, Edge<EdgeData>>
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
      >
        <Background />
        <Controls />

        {selectedEdge && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-white rounded-lg shadow-lg p-2">
            <Select
              value={selectedEdge.data.dependencyType}
              onValueChange={handleDependencyTypeChange}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select dependency type" />
              </SelectTrigger>
              <SelectContent>
                {dependencyTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </ReactFlow>
    </>
  );
}

export default Canvas;
export { Canvas };