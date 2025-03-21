import { supabase  } from "@/lib/supabase";


function nodeGetPosition(node, nodes ){

    let next_pos;
    let before_pos;
    let current_pos;

    nodes.forEach( ( n, i ) =>{
        if( n.data.content ==  node.content){
            current_pos = i;
            next_pos = current_pos + 1;
            before_pos = current_pos - 1;
        }
    }  );



    if( current_pos > 0 && before_pos < 0 ){
        throw Error("before post no puede ser menor que 0");
    }

    if( current_pos !== nodes.length && next_pos > nodes.length ){
        throw Error("nex pos no puede ser mayor que el array de nodos");
    }

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

function alter_position( from , to , nodes ){

    // Validar índices
  if (from.index < 0 || from.index >= nodes.length || to.index < 0 || to.index >= nodes.length) {
    throw new Error("Índices fuera de los límites del array");
  }

  // Verificar existencia de datos
  if (!nodes[from.index] || !nodes[to.index]) {
    throw new Error("Elementos no encontrados en las posiciones especificadas");
  }


    function cross_array_position( nodes, from, to ){

        console.log( "index", from.index, to.index);
        console.log( "Crossing array position", from.data.position , to.data.position );

        const clon = [ ...nodes ];

        if( to.index > nodes.length - 1 ){
            return clon;
        }
        
        // Cambiamos posicion en el array.
        clon[from.index] = to.data;
        clon[to.index] = from.data;

        return [... clon];
    }

    function cross_canvas_position( nodes, from, to ){

        console.log( "index", from.index, to.index);
        console.log( "Crossing array position", from.data.position , to.data.position );

        const clon = [ ...nodes ];

        if( to.index > nodes.length - 1 ){
            return clon;
        }

        const from_position = from.data.position;
        const to_position = to.data.position;
        
        // alternamos posisicones.
        clon[from.index].position = to_position;
        clon[to.index].position = from_position;

        console.log( "new from",  clon[from.index] );
        console.log( "new to", clon[to.index] );

        return [ ... clon ];

        
    }

    const alternate_canvas = cross_canvas_position( nodes  , from, to );

    const alternate_array = cross_array_position( alternate_canvas, from, to );

    return alternate_array;


}

const nodeUp = (
    node ,
    nodes,
    edges,
    tempalte_id,
    callback
) => {

    // Obtengo posiciones
    const { current, before } = nodeGetPosition(node, nodes );

    // Intercambio
    const altered = alter_position( current, before, nodes );


    const mod_nodes = [...altered];

    save_document_template_content_in_db(
        mod_nodes,
        edges,
        tempalte_id,
        callback
    )

    // Retorno
    return mod_nodes ;

    
};


function save_document_template_content_in_db( blocks, edges, tempalte_id, callback ){

    const table = "document_templates";

    const content = {
        "blocks": blocks ,
        "edges": edges
    };

    supabase
        .from(table)
        .update( { content: content } )
        .eq('id', tempalte_id)
        .select()
        .single()
        .then(({ data: document_templates, error }) => {
            if (error) {
                console.error(error);
            } else {
                callback(document_templates);
            }
        });
}

const nodeDown = ( node, nodes, edges, tempalte_id, callback  ) => {

     // Obtengo posiciones
     const { current, next } = nodeGetPosition(node, nodes );

     // Intercambio
     const altered = alter_position( current, next, nodes );    

     const mod_nodes = [ ...altered ];

     save_document_template_content_in_db(
        mod_nodes,
        edges,
        tempalte_id,
        callback
    )
 
     // Retorno
     return mod_nodes;
}

const useNodeMove = () => {
    return {
        nodeUp:nodeUp,
        nodeDown:nodeDown,
    };
}
 
export default useNodeMove;
export { save_document_template_content_in_db };