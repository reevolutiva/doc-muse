import { Dispatch, SetStateAction } from 'react';

interface NodeType {
    id: string;
    type: string;
    position: number;
    data: {
        content: string;
    };
    [key: string]: any;
}

const nodeUp = (
    node: NodeType,
    nodes: NodeType[],
    setNodes: Dispatch<SetStateAction<NodeType[]>>
) => {

    if (!node) {
        console.error("Error: El nodo es undefined en nodeUp");
        return;
    }

    if (!node.content) {
        console.error("Error: node.data es undefined en nodeUp", node);
        return;
    }

    

    const content = node.content;
    let current_pos = 0;
    let before_pos = 0;
    let current_index = 0;
    let before_index = 0;

    nodes.forEach((n: NodeType, index: number) => {
        const data = n.data;
        if (data.content === content) {
            if (index > 0) {
                before_pos = nodes[index - 1].position;
                before_index = index - 1;
            }
            current_pos = n.position;
            current_index = index;
        }
    });

    console.log("current_pos", current_pos);
    console.log("before_pos", before_pos);

    if (before_index < 0) {
        setNodes([...nodes]);
        return;
    }

    const altered_nodes = nodes.map((n: NodeType, index: number) => {
        if (index === before_index) {
            return { ...n, position: current_pos };
        }
        if (index === current_index) {
            return { ...n, position: before_pos };
        }
        return n;
    });

    setNodes(altered_nodes);
};

const nodeDown = ( node, nodes, setNodes  ) => {

    const content = node.content;
    let newNode = {};
    let current_index = 0;
    nodes.forEach((n, index) => {
        const data = n.data;
        if( data.content === content ){
            newNode = { ...n};
            current_index = index - 1;
        }

    });

    console.log( newNode );

    let current_pos = newNode.position;
    let after_pos = nodes[current_index + 1].position;

    console.log("current_pos", current_pos);
    console.log("after_pos", after_pos);

    const altered_nodes = nodes.map((n, index) => {

        if( index === current_index ){
            return { ...n, position: after_pos };
        }
        if( index === current_index + 1 ){
            return { ...n, position: current_pos };
        }
        return n;
    });

    setNodes(altered_nodes);
}

const useNodeMove = () => {
    return {
        nodeUp:nodeUp,
        nodeDown:nodeDown,
    };
}
 
export default useNodeMove;