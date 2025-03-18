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


const TemplateSelector = ({templates, nodes, setNodes, setCurrentTemplate  }) => {

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

  return (
    <div className="w-full h-[500px]">
      <div className="flex space-x-2 mb-2 pb-5">

        <AddNodeForm nodes={nodes} setNodes={setNodes} addNode={addNode} />

        <TemplateSelector templates={templates} nodes={nodes} setNodes={setNodes} setCurrentTemplate={setCurrentTemplate} />
        

        <button onClick={() => generarDocRaw( currentTemplate )} className="px-4 py-2 bg-blue-500 text-white rounded" > Generar </button>
      </div>
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