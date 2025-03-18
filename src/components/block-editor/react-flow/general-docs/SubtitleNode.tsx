import React, { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useStoreApi } from '@xyflow/react';
import "./SubtitleNode.css";
import { generarDocRaw } from '@/lib/utils';

const SubtitleNode = ({ id, data }) => {
  const storeApi = useStoreApi();

  const onDelete = useCallback(() => {

    const { nodes, edges, setNodes } = storeApi.getState();

    if (!nodes) {
      return;
    }

    const newNodes = nodes.filter((node) => node.id !== id);
    generarDocRaw(id, newNodes, edges );
    setNodes(newNodes);
  }, [id, storeApi]);

  return (
    <div className="subtitle-node react-flow__node-default">
      <Handle type="target" position={Position.Top} />
      <h3>{data.text}</h3>
      <button className="delete-button font-bold rounded" onClick={onDelete}>Delete Node</button>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default SubtitleNode;
