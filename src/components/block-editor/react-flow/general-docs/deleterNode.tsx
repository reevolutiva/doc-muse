import React, { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { useStoreApi } from 'reactflow';

const DeleterNode = ({ id, data }) => {

    const storeApi = useStoreApi();

    const onDelete = useCallback(() => {
        const { setNodes } = storeApi.getState();
        setNodes((nodes) => nodes.filter((node) => node.id !== id));
    }, [id, storeApi]);

    return (
        <div className="deleter-node">
            <Handle type="target" position={Position.Top} />
            <div>
                This is a deleter node: {id}
            </div>
            <button onClick={onDelete}>Delete Node</button>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
};

export default DeleterNode;