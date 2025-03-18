import React, { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useStoreApi } from '@xyflow/react';
import './paragraphNode.css';

const ParagraphNode = ({ id, data }) => {
    const storeApi = useStoreApi();

    const onDelete = useCallback(() => {
        const { nodes, setNodes } = storeApi.getState();

        if (!nodes) {
            return;
        }
        const newNodes = nodes.filter((node) => node.id !== id);
        setNodes(newNodes);

    }, [id, storeApi]);

    return (
        <div className="paragraph-node react-flow__node-default">
            <Handle type="target" position={Position.Top} />
            <div>
                <p className="text-base">
                    {data.label || 'Escribe tu párrafo aquí'}
                </p>
            </div>
            <button className="delete-button font-bold rounded" onClick={onDelete}>Delete Node</button>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
};

export default ParagraphNode;
