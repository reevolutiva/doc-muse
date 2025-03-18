import React from 'react';
import { Handle, Position } from '@xyflow/react';
import "./SubtitleNode.css";

const SubtitleNode = ({ data }) => {
  return (
    <div className="subtitle-node react-flow__node-default">
      <Handle type="target" position={Position.Top} />
      <h3>{data.text}</h3>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default SubtitleNode;
