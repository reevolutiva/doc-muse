import React, { useCallback, useMemo } from 'react';
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

import { intialnodes_general_docs } from './general-docs/nodes'
import { intialedges_general_docs } from './general-docs/edges'
import DeleterNode from './general-docs/deleterNode';

const nodeTypes = useMemo(() => ({ deleterNode: DeleterNode }), []);
 
export default function TemplatesReactFlow() {

  const [nodes, setNodes, onNodesChange] = useNodesState(intialnodes_general_docs);
  const [edges, setEdges, onEdgesChange] = useEdgesState(intialedges_general_docs);
 
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const addNode = () => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      data: { label: `Node ${nodes.length + 1}` },
      position: { x: Math.random() * 250, y: Math.random() * 250 },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const removeNode = () => {
    setNodes((nds) => nds.slice(0, -1));
  };
 
  return (
    <div className="w-full h-[500px]">
      <div className="flex space-x-2 mb-2">
        <button onClick={addNode} className="px-4 py-2 bg-blue-500 text-white rounded">Add Node</button>
        <button onClick={removeNode} className="px-4 py-2 bg-red-500 text-white rounded">Remove Node</button>
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