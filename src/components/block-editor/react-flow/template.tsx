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

// New component for creating a new template
const CreateTemplateModal = ({ isOpen, onClose, onCreate }) => {
  const [templateName, setTemplateName] = useState('');

  const handleCreate = () => {
    onCreate(templateName);
    setTemplateName('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Template</h3>
          <div className="mt-2 px-7 py-3">
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Template Name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </div>
          <div className="items-center px-4 py-3">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 mr-2"
              onClick={handleCreate}
            >
              Create
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const TemplateSelector = ({templates, nodes, setNodes, setCurrentTemplate, setEdges, edges  }) => {

  function buildNode( blocks ) {


    const newNodes = blocks.map( (block, index) => {


      let label = {};

      if(block.data.label) {
        label = {
          "label": block.data.label
        }
      }

      if(block.data.text) {
        label = {
          "label": block.data.text
        }
      }

      const { x, y } = block.position;
      
      const newNode = new Node(
        (nodes.length + 1 + index).toString(),
        x,
        y,
        block.type,
        label.label
      );

      return newNode;
    });


    return newNodes;



  }

  function getBlocks( template ) {
    const blocks = template.content.blocks;
    return blocks;
  }

  function onChangeHandler(e) {
    const templateId = e.target.value;
    setCurrentTemplate(templateId);
    const template = templates.find( template => template.id === templateId);
    const blocks = getBlocks(template);
    console.log('blocks', blocks);
    const newNodes = buildNode(blocks);
    setNodes(newNodes);
    setEdges(getEdge(template));
    
  
  }

  function getEdge( template ){
    
    const edges = template.content.edges;
    console.log('edges', edges);
    return edges;
  }

  return ( 
    <select
              className="px-4 py-2 bg-gray-500 text-white rounded"
              onChange={(e) => onChangeHandler(e)}
            >
              <option value="">Select a template</option>
              {templates?.map((template) => (
              <option key={template.id} value={template.id}>
                {template.title}
              </option>
              ))}
      </select>
   );
}
 
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
          <svg fill="#fff" className="w-6 h-6" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/>
          </svg>
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