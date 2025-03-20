import { Dispatch, SetStateAction } from 'react';


function nodeGetPosition(node, nodes ){

    let next_pos;
    let before_pos;
    let current_pos;

    console.log("node", node.content);
    console.log("section_type", node.section_type);
    console.log("node", nodes);

    nodes.forEach( ( n, i ) =>{
        if( n.data.content ==  node.content){
            current_pos = i;
            next_pos = current_pos + 1;
            before_pos = current_pos - 1;
        }
    }  );

    return { 
    "before": { 
        "index": before_pos, 
        "data": nodes[before_pos] 
    }, 
    "current":{
        "index": current_pos,
        "data": nodes[current_pos]
    }, 
    "next":{
        "index": next_pos,
        "data": nodes[next_pos]
    } }

}

function alter_position( from , to, nodes ){

    console.log("from", from);
    console.log("to", to);

    const clon = [ ...nodes ];

    if( to.index > nodes.length - 1 ){
        return clon;
    }

    // Cambia la posicion en canva.
    const from_position = from.data.position;
    const to_position = to.data.position;

    const new_from = { ...from.data, position: to_position };
    const new_to = { ...to.data, position: from_position };

    // Cambiamos posicion en el array.
    clon[from.index] = new_to;
    clon[to.index] = new_from;

    return clon;
}

const nodeUp = (
    node ,
    nodes ,
    setNodes
) => {

    // Obtengo posiciones
    const { current, before } = nodeGetPosition(node, nodes );

    // Intercambio
    const altered = alter_position( current, before, nodes );

    // Retorno
    //console.log( altered )
    setNodes( altered );

    
};

const nodeDown = ( node, nodes, setNodes  ) => {

     // Obtengo posiciones
     const { current, next } = nodeGetPosition(node, nodes );

     // Intercambio
     const altered = alter_position( current, next, nodes );
 
     // Retorno
     setNodes( altered );
}

const useNodeMove = () => {
    return {
        nodeUp:nodeUp,
        nodeDown:nodeDown,
    };
}
 
export default useNodeMove;