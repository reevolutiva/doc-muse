import React, { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useStoreApi } from '@xyflow/react';
import "./delterNode.css";

const DeleterNode = ({ id, data }) => {

    const storeApi = useStoreApi();

    const onDelete = useCallback(() => {

        const { nodes, setNodes } = storeApi.getState();

        if(! nodes ) {
            return;

        }
        const newNodes = nodes.filter((node) => node.id !== id);
        setNodes(newNodes);
    
    }, [id, storeApi]);

    return (
        <div className="deleter-node">
            <Handle type="target" position={Position.Top} />
            <div className="react-flow__node-default" >
                { data.label }
            </div>
            <button className="delte-button font-bold rounded" onClick={onDelete}>Delete Node</button>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
};

export default DeleterNode;