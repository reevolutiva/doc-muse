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
  const [nodeToEdit, setNodeToEdit] = useState<Node<TemplateNodeData> | null>(null);

  useEffect(() => {

    const fetchNodes = async () => { 


      function getUrlParameter() {
        // Si la url no tiene el id del template, no se hace nada
        if (!location.href.includes("id=")) {
          return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const tempalte_id = urlParams.get('id');
        const type = urlParams.get('type');

        const table = type === "document" ? "document_templates" : "project_templates";

        return { tempalte_id, type, table };
      }

      function getTemplateData( content ) {

        let blocks = [];
        let edges = [];

        if( content === null ){
          return { blocks, edges };
        }
        
  
        // content tiene la propiedad blocks?
        if (content.hasOwnProperty("blocks")) {
          blocks = content.blocks;
        }else{
          blocks = content.nodes;
        }

        edges = content.edges;    


        // Añaddir a cada nodo en blocks el callback onDelete()
        blocks = blocks.map((node: any) => {
          return {
            ...node,
            data: {
              ...node.data,
              onDelete: ( data ) => {

                const { id, name } = data;

                

                const filter_data = id === undefined ? name : id;
                const filter_key = id === undefined ? "name" : "id";

                const updatedNodes = blocks.filter((n: Node<TemplateNodeData> ) => {
                  
                  if( filter_key === "name" ){
                    return n.data.name !== filter_data ;
                  }

                  if( filter_key === "id" ){
                    return n.data.id !== filter_data ;
                  }

                  return n;

                } );

                console.log("updatedNodes", updatedNodes);
                
                setNodes(updatedNodes);
                setEdges([]);



              }
            }
          };
        });


        return { blocks, edges };
      }

      const { tempalte_id, type, table } = getUrlParameter();


      let { data: document_templates, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', tempalte_id)
      .single();

      const content = document_templates.content;
      const { blocks, edges } = getTemplateData( content );

      console.log( "content" , content );
      console.log( "blocks" , blocks );

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
      setNodeToEdit(node); // Actualizar el estado con el nodo seleccionado
    }
  }, [readOnly]);

  // Add a new node to the canvas
  const onAddNode = (nodeData: TemplateNodeData) => {
    
    if (readOnly) return;

    const action = nodeData.action;

  
  

    console.log("nodeData", nodeData);
    console.log("nodes", nodes);
    const title = nodeData.name;

    if( action === "update" ){

      let updatedNodes = nodes.map(node => {
         
         console.log( title , node.data.name);

        if ( title ===  node.data.name ) {
          return { ...node, data: { ...nodeData } };
        } else {
          return node;
        }
      });

      console.log("updatedNodes", updatedNodes);

      setNodes(updatedNodes);
      
      if (onSave) {
        console.log("tiene onSave");
        onSave(updatedNodes, edges);
      }else{
        console.log("no tiene onSave");
      }
      
      toast.success('Node updated successfully');
      return;

    }
    
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
          <SideBar onAddNode={onAddNode} nodeToEdit={nodeToEdit} setNodeToEdit={setNodeToEdit} />
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