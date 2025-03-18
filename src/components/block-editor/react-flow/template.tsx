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

import { supabase } from '@/lib/supabase';


const TemplateSelector = ({templates, nodes, setNodes }) => {

  function buildNode( blocks ) {

    const corsd = { x: 10, y: 10 };
    const typeMap = {
      'heading': 'headingNode',
      'paragraph': 'paragraphNode'
    };

    const newNodes = blocks.map( (block, index) => {


      let cords_scale = 100;

      if( block.type == 'paragraph' && index > 1 ){
        cords_scale = 180;
      }

      const newY = corsd.y + (index * cords_scale );

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
      
      const newNode = new Node(
        (nodes.length + 1 + index).toString(),
        corsd.x,
        newY,
        typeMap[block.type],
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
  const nodeTypes = useMemo(() => ({ deleterNode: DeleterNode, headingNode: HeadingNode, paragraphNode: ParagraphNode }), []);
  const [ templates, setTemplates ] = useState([]);
 
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

  const addNode = () => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      data: { label: `Node ${nodes.length + 1}` },
      type: 'deleterNode',
      position: { x: Math.random() * 250, y: Math.random() * 250 },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const generarDocRaw = () => {

      console.log(nodes);
    
  }

  return (
    <div className="w-full h-[500px]">
      <div className="flex space-x-2 mb-2">
        <button onClick={addNode} className="px-4 py-2 bg-blue-500 text-white rounded">Add Node</button>

        <TemplateSelector templates={templates} nodes={nodes} setNodes={setNodes} />
        

        <button onClick={() => generarDocRaw()} className="px-4 py-2 bg-blue-500 text-white rounded" > Generar </button>
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