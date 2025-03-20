
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
import { UnHandleNode } from './UnHandleNode';
import { SideBar } from './SideBar';
import { PropertiesPanel } from './PropertiesPanel';
import { toast } from 'react-hot-toast';
import type { TemplateNodeData } from './TemplateNode';
import { UnHandleNodeData } from './UnHandleNode';
import { supabase } from '@/lib/supabase'
import getUrlParameter from './aux';
import useNodeDelete from './hooks/useDelete';
import useNodeMove from './hooks/useNodeMove';

interface TemplateCanvasProps {
  initialNodes?: Node<TemplateNodeData | UnHandleNodeData>[];
  initialEdges?: Edge[];
  onSave?: (nodes: Node<TemplateNodeData | UnHandleNodeData>[], edges: Edge[]) => void;
  readOnly?: boolean;
}

// Define node types for our custom nodes
const nodeTypes = {
  templateNode: ""
};

export const TemplateCanvas = ({
  initialNodes = [],
  initialEdges = [],
  onSave,
  readOnly = false
}: TemplateCanvasProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<TemplateNodeData[]>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<TemplateNodeData> | null | UnHandleNodeData >(null);
  const [nodeToEdit, setNodeToEdit] = useState<Node<TemplateNodeData> | null | UnHandleNodeData >(null);
  const [type , setType] = useState("");

  let hasDragableNodes = true;
  const { nodeUp, nodeDown } = useNodeMove();

 
  

  useEffect(() => {

    const { type } = getUrlParameter();
    setType( type );

    const fetchNodes = async () => { 

      function getTemplateData( content ) {

        let blocks = [];
        let edges = [];

        if( content === null || Object.keys(content).length === 0 ){
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

          const position = { x: node.position.x, y: node.position.y };

          if( ! hasDragableNodes ){
            position.x = 0;
          }

          return {
            ...node,
            draggable: hasDragableNodes,
            position: position,
            data: {
              ...node.data,
              onDelete: ( data ) => {
                useNodeDelete( data, blocks, setNodes, setEdges );
              },
              onMoveUp: ( data ) => {
                console.log("Move up");
                nodeUp( data, blocks, setNodes );
              },
              onMoveDown: ( data ) => {
                console.log("Move down"); 
                nodeDown( data, blocks, setNodes );
              }
            }
          };
        });


        return { blocks, edges };
      }

      

      const { tempalte_id, type, table } = getUrlParameter();

      if( type === "document" ){
         nodeTypes.templateNode = UnHandleNode;
         hasDragableNodes = false;
      }

      if( type === "project" ){
        nodeTypes.templateNode = TemplateNode;
      }


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
    
    console.log("Node clicked", node);
    if (!readOnly) {
      setSelectedNode(node);
      setNodeToEdit(node); // Actualizar el estado con el nodo seleccionado
    }
  }, [readOnly]);

  // Add a new node to the canvas
  const onAddNode = (nodeData: TemplateNodeData | UnHandleNodeData ) => {
    
    if (readOnly) return;

    const action = nodeData.action;

    const { type } = getUrlParameter();
  

    console.log("nodeData", nodeData);
    console.log("nodes", nodes);
  
    const title = nodeData.name;
    const content = nodeData.content;

    const last_node = nodes[nodes.length - 1];
    const last_position = last_node.position;

    if( action === "update" ){

      let updatedNodes = nodes.map(node => {
         
         console.log( title , node.data.name);

        if( type === "document" ){
            if(  content === node.data.content ){
              return { ...node, data: { ...nodeData } };
            }
        }

        if ( type === "project" ) {
          if ( title ===  node.data.id ) {
            return { ...node, data: { ...nodeData } };
          } else {
            return node;

          }
        }

        return node;  

        
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

    const typeNode = type === "document" ? "templateNode" : "unHandleNode";
    const position = { x: 100, y: 100 } ;

    if( type === "document" ){
      position.y = last_position.y + 150;
      position.x = 0;
    }

    const newNode = {
      id: `node-${Date.now()}`,
      type: typeNode ,
      position: position,
      draggable: hasDragableNodes,
      data: { ...nodeData }
    };

    console.log("LLega");
    console.log("newNode", newNode);

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
          <SideBar 
            onAddNode={onAddNode} 
            nodeToEdit={nodeToEdit} 
            setNodeToEdit={setNodeToEdit} 
            type={ type } 
          />
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
            nodesDraggable={hasDragableNodes}
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