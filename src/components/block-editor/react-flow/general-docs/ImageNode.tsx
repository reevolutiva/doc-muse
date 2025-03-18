import React, { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useStoreApi } from '@xyflow/react';
import { generarDocRaw } from '@/lib/utils';

const ImageNode = ({ id, data }) => {
  const storeApi = useStoreApi();

  const onDelete = useCallback(() => {
    const { nodes, setNodes, edges } = storeApi.getState();

    if (!nodes) {
      return;
    }

    const newNodes = nodes.filter((node) => node.id !== id);
    setNodes(newNodes);
    generarDocRaw(id, newNodes, edges );
  }, [id, storeApi]);

  return (
    <div className="image-node react-flow__node-default">
      <Handle type="target" position={Position.Top} />
      <img src={data.url} alt={data.alt} />
      <button className="delete-button font-bold rounded" onClick={onDelete}>Delete Node</button>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default ImageNode;
