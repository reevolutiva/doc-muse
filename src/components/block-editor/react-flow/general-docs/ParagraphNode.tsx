import React from 'react';
import { Handle, Position } from '@xyflow/react';
import './paragraphNode.css';

const ParagraphNode = ({ data }) => {
    return (
        <div className="paragraph-node">
            <Handle type="target" position={Position.Top} />
            <div className="react-flow__node-default">
                <p className="text-base">
                    {data.label || 'Escribe tu párrafo aquí'}
                </p>
            </div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
};

export default ParagraphNode;
