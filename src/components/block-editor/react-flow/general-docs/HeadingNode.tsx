import React,{ useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import './headingNode.css';
import { useStoreApi } from '@xyflow/react';
import { generarDocRaw } from '@/lib/utils';

const HeadingNode = ({ id, data }) => {

     const storeApi = useStoreApi();
    
        const onDelete = useCallback(() => {
    
            const { nodes, setNodes, edges } = storeApi.getState();
    
            if(! nodes ) {
                return;
    
            }
            const newNodes = nodes.filter((node) => node.id !== id);
            setNodes(newNodes);
            generarDocRaw(id, newNodes, edges );
        
        }, [id, storeApi]);


    return (
        <div className="heading-node react-flow__node-default">
            <Handle type="target" position={Position.Top} />
            <div>
                <h2 className="text-2xl font-bold">
                    {data.label || 'Encabezado'}
                </h2>
            </div>
            <button className="delte-button font-bold rounded" onClick={onDelete}>Delete Node</button>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
};

export default HeadingNode;
