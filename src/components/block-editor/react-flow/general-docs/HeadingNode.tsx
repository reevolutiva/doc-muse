import React from 'react';
import { Handle, Position } from '@xyflow/react';
import './headingNode.css';

const HeadingNode = ({ data }) => {
    return (
        <div className="heading-node react-flow__node-default">
            <Handle type="target" position={Position.Top} />
            <div>
                <h2 className="text-2xl font-bold">
                    {data.label || 'Encabezado'}
                </h2>
            </div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
};

export default HeadingNode;
