import React from 'react';
import { Handle, Position } from '@xyflow/react';

const ImageNode = ({ data }) => {
  return (
    <div className="image-node react-flow__node-default">
      <Handle type="target" position={Position.Top} />
      <img src={data.url} alt={data.alt} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default ImageNode;
