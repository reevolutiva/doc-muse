import React, { useCallback, useMemo , useEffect, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';

 
import '@xyflow/react/dist/style.css';

import { intialnodes_general_docs, Node } from './general-docs/nodes'
import { intialedges_general_docs } from './general-docs/edges'
import DeleterNode from './general-docs/deleterNode';
import HeadingNode from './general-docs/HeadingNode';
import ParagraphNode from './general-docs/ParagraphNode';
import ImageNode from './general-docs/ImageNode.tsx';
import SubtitleNode from './general-docs/SubtitleNode';

import { supabase } from '@/lib/supabase';
import { AddNodeForm } from './forms/AddNodeForm';
import CreateTemplateModal from './forms/CreateTemplateModal';
import TemplateSelector from './forms/TemplateSelector';
 
export default function TemplatesReactFlow() {

  const [nodes, setNodes, onNodesChange] = useNodesState(intialnodes_general_docs);
  const [edges, setEdges, onEdgesChange] = useEdgesState(intialedges_general_docs);
  const nodeTypes = useMemo(() => ({
    deleterNode: DeleterNode,
    headingNode: HeadingNode,
    paragraphNode: ParagraphNode,
    imageNode: ImageNode,
    subtitleNode: SubtitleNode,
  }), []);

  const [ templates, setTemplates ] = useState([]);
  const [ currentTemplate , setCurrentTemplate ] = useState(null);
  // new state for create template
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
 
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  useEffect(() => {
    
    async function getDocsTemplate() {
        let { data: document_templates, error } = await supabase
        .from('document_templates')
        .select('*')
        setTemplates(document_templates);

    }

    getDocsTemplate();
    
  }, []);

  const addNode = (type, content) => {

    let data = { label: content };
    if (type === 'imageNode') {
      data = { url: content, alt: 'Image' };
    } else if (type === 'subtitleNode') {
      data = { text: content };
    }

    const position = { x: Math.random() * 250, y: Math.random() * 250 };

    if(data.position) {
      position.x = data.position.x;
      position.y = data.position.y;

    }

    const newNode = {
      id: (nodes.length + 1).toString(),
      data: data,
      type: type,
      position: position,
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const generarDocRaw = async ( id ) => {

    try {
      // Recopilar los datos de los nodos en un formato adecuado para Supabase
      const blocksData = nodes.map(node => ({
        id: node.id,
        type: node.type,
        data: node.data,
        position: node.position,
      }));

      const content = { blocks: blocksData, edges: edges };

      // Actualizar la tabla 'projects.blocks' en Supabase
      const { data, error } = await supabase
      .from('document_templates')
      .update({ content : content })
      .eq('id', id)
      .select()

      if (error) {
        console.error("Error al actualizar Supabase:", error);
        alert("Error al guardar los cambios en Supabase.");
        return;
      }

      console.log("Datos guardados en Supabase:", data);
      alert("Cambios guardados exitosamente en Supabase!");

    } catch (error) {
      console.error("Error inesperado:", error);
      alert("Ocurrió un error inesperado al guardar.");
    }
  }

  // Function to handle the creation of a new template
  const handleCreateTemplate = async (templateName) => {
    setIsCreateModalOpen(false);

    const { data: { user } } = await supabase.auth.getUser();
  
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .insert([{ 
          user_id: user.id,
          title: templateName,
          content: { blocks: nodes , edges: edges } // Initialize with empty content
        }])
        .select();

      if (error) {
        console.error("Error creating template:", error);
        alert("Failed to create template.");
        return;
      }

      console.log("Template created successfully:", data);
      alert("Template created successfully!");
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred while creating the template.");
    }
  };

  return (
    <div className="w-full h-[500px]">
      <div className="flex space-x-2 mb-2 pb-5">

        <AddNodeForm nodes={nodes} setNodes={setNodes} addNode={addNode} />

        <TemplateSelector templates={templates} nodes={nodes} setNodes={setNodes} setEdges={setEdges} edges={edges} setCurrentTemplate={setCurrentTemplate} />
        
        {/* Button to open the create template modal */}
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-green-700"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>

        <button onClick={() => generarDocRaw( currentTemplate )} className="px-4 py-2 bg-blue-500 text-white rounded" >          
          <p> Guardar </p>
        </button>
      </div>

      {/* Modal for creating a new template */}
      <CreateTemplateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateTemplate}
      />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}