import React,{ useState, useEffect } from 'react';
import { Node } from '../general-docs/nodes';
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

      //TODO: Guardar template ID en sessionStorage
      sessionStorage.setItem('kimfe-templateId', templateId);

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

export default TemplateSelector;